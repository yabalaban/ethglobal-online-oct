// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.16;

// basics
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

// spark -> sDai
import {ISavingsDai} from "@sdai/ISavingsDai.sol";

// aave -> spark
import {IPoolAddressesProvider} from "@spark-core/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@spark-core/interfaces/IPool.sol";
import {IWrappedTokenGatewayV3} from "@spark-periphery/misc/interfaces/IWrappedTokenGatewayV3.sol";

// uma

import {ClaimData} from "@uma/core/contracts/optimistic-oracle-v3/implementation/ClaimData.sol";
import {OptimisticOracleV3Interface} from "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

// internals
import {CryptoVCEvents} from "./CryptoVCEvents.sol";

contract CryptoVC is CryptoVCEvents, ERC2771Context {
    using SafeERC20 for IERC20;

    enum ProjectState {
        Created,
        Funded,
        Completed,
        Failed
    }

    struct Project {
        bytes32 id;
        address creator;
        uint256 ethCollateralDeposit;
        uint256 totalFundingRequired;
        uint256 fundingAllocated;
        uint256 daiDeposit;
        ProjectState state;
        bytes cid;
        // TODO: check if we need more states?
    }

    /// @dev The minimum value required to create a project.
    uint256 public constant MIN_VALUE = 0.1 ether;

    bytes32 private immutable _defaultIdentifier;
    IERC20 private immutable _defaultCurrency;
    OptimisticOracleV3Interface private immutable _umaOracle;
    ISavingsDai private immutable _savingsDai;
    IWrappedTokenGatewayV3 private immutable _sparkETHGateway;
    IPool private immutable _sparkPool;

    mapping(bytes32 => Project) private _projects;

    modifier onlyUmaOracle() {
        require(msg.sender == address(_umaOracle), "Only UMA oracle can call this function");
        _;
    }

    constructor(
        IERC20 defaultCurrency_, // should be DAI
        OptimisticOracleV3Interface umaOracle_,
        ISavingsDai savingsDai_,
        IWrappedTokenGatewayV3 sparkETHGateway_,
        IPoolAddressesProvider sparkPoolAddressesProvider_,
        address trustredForwarder_
    )
        ERC2771Context(trustredForwarder_)
    {
        _defaultCurrency = defaultCurrency_;
        _umaOracle = umaOracle_;
        _savingsDai = savingsDai_;
        _defaultIdentifier = umaOracle_.defaultIdentifier();
        _sparkETHGateway = sparkETHGateway_;
        _sparkPool = IPool(sparkPoolAddressesProvider_.getPool());

        _defaultCurrency.safeApprove(address(_savingsDai), type(uint256).max);
    }

    function defaultCurrency() external view returns (IERC20) {
        return _defaultCurrency;
    }

    function createProject(
        bytes calldata cid,
        uint256 fundingRequired
    ) external payable {
        require(msg.value > MIN_VALUE, "Value must be greater than MIN_VALUE");

        // deposit ETH to Spark as collateral
        _sparkETHGateway.depositETH{value: msg.value}(address(_sparkPool), address(this), 0);
        // borrow DAI for this collateral
        // TODO: calculate this properly using pool or something?
        uint256 toBorrow = 1e18;
        _sparkPool.borrow(address(_defaultCurrency), toBorrow, 2, 0, address(this));
        // deposit DAI to sDAI
        _savingsDai.deposit(toBorrow, address(this));

        // creating project
        bytes32 projectId = keccak256(abi.encodePacked(msg.sender, cid));
        _projects[projectId] = Project({
            id: projectId,
            creator: msg.sender,
            ethCollateralDeposit: msg.value,
            totalFundingRequired: fundingRequired,
            fundingAllocated: 0,
            daiDeposit: toBorrow,
            state: ProjectState.Created,
            cid: cid
        });

        emit ProjectCreated(projectId, msg.sender, msg.value, fundingRequired, cid);
    }

    function fundProject(
        bytes32 projectId,
        uint256 amount
    ) external {
        // TODO: check project state etc
        // TODO: add struct to hold funding requests
        // when we get enough funding, we can start the project
        // TODO: start project by creating safe with funders as owners
        // - transfer of funds into safe via DAI->sDAI
        // - transfer of bootstrap funds
        // - allow the creator to request funds by proposing a UMA tx to safe
        // - owners can vote on the tx
        // - the tx post asserting to UMA on behalf of the safe
        // - as it completed, the safe can withdraw funds to the creator
    }

    function createAssertion() external {
        // uint256 bond = _umaOracle.getMinimumBond(address(defaultCurrency));
        // defaultCurrency.safeTransferFrom(_msgSender(), address(this), bond);
        // defaultCurrency.forceApprove(address(_umaOracle), bond);

        // bytes32 assertionId = _umaOracle.assertTruth(
        //     abi.encodePacked(
        //         "Promise contract is claiming that statement ",
        //         promises[promiseId].statement,
        //         " had occurred as of ",
        //         ClaimData.toUtf8BytesUint(block.timestamp),
        //         "."
        //     ),
        //     msg.sender,
        //     address(this),
        //     address(0), // No sovereign security.
        //     assertionLiveness,
        //     defaultCurrency,
        //     bond,
        //     defaultIdentifier,
        //     bytes32(0) // No domain.
        // );

        // assertedPromises[assertionId] = promiseId;
        // emit PromiseAssertionRequested(promiseId, assertionId);
        // return assertionId;
    }

    function assertionResolvedCallback(
        bytes32 /* assertionId */,
        bool /* assertedTruthfully */
    ) onlyUmaOracle external {
        // bytes32 promiseId = assertedPromises[assertionId];
        // Promise memory p = promises[promiseId];
        // p.fullfilled = assertedTruthfully;
        // p.asserted = true;
        // emit PromiseAsserted(promiseId, p.promisor, p.fullfilled);
        // delete assertedPromises[assertionId];
    }

    // If assertion is disputed, do nothing and wait for resolution.
    function assertionDisputedCallback(
        bytes32 /* assertionId */
    ) onlyUmaOracle external {
        // TODO: emit event and do some fancy logic with xmtp/pushes?
    }
}
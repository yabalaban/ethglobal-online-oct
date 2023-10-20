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

// safe
import {SafeProxyFactory} from "@safe/proxies/SafeProxyFactory.sol";
import {SafeProxy} from "@safe/proxies/SafeProxy.sol";

// internals
import {CryptoVCEvents} from "./CryptoVCEvents.sol";
import {SharesToken} from "./SharesToken.sol";

contract CryptoVC is CryptoVCEvents, ERC2771Context {
    using SafeERC20 for IERC20;

    enum ProjectState {
        Created,
        Started,
        Completed,
        Failed
    }

    struct Project {
        bytes32 id;
        address creator;
        uint256 ethCollateralDeposit;
        uint256 totalFundingRequired;
        uint256 totalFundingReceived;
        uint256 totalFundingAllocated;
        uint256 daiDeposit;
        ProjectState state;
        bytes cid;
        address[] funders;
        address safe;
        SharesToken shares;
        uint256 distribution;
        // TODO: check if we need more states?
    }

    struct Tranche {
        bytes32 projectId;
        uint256 amount;
        bytes claim;
        bool claimed;
    }

    /// @dev The minimum value required to create a project.
    uint256 public constant MIN_VALUE = 0.00001 ether;
    uint256 private constant _DEFAULT_SHARES = 1000;

    bytes32 private immutable _defaultIdentifier;
    IERC20 private immutable _defaultCurrency;
    OptimisticOracleV3Interface private immutable _umaOracle;
    ISavingsDai private immutable _savingsDai;
    IWrappedTokenGatewayV3 private immutable _sparkETHGateway;
    IPool private immutable _sparkPool;
    SafeProxyFactory private immutable _safeFactory;
    address private immutable _safeSingleton;

    mapping(bytes32 => Project) private _projects;
    mapping(address => mapping (bytes32 => uint256)) private _fundings;
    mapping(bytes32 => Tranche) private _tranches;

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
        SafeProxyFactory safeFactory_,
        address safeSingleton_,
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
        _safeFactory = safeFactory_;
        _safeSingleton = safeSingleton_;

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
        require(fundingRequired > 0, "Funding required must be greater than 0");

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

        address[] memory funders = new address[](1);
        funders[0] = msg.sender;

        SharesToken shares = new SharesToken(_DEFAULT_SHARES * (10 ** 18));
        uint256 distribution = 0.3 * (10 ** 18);

        _projects[projectId] = Project({
            id: projectId,
            creator: msg.sender,
            ethCollateralDeposit: msg.value,
            totalFundingRequired: fundingRequired,
            totalFundingReceived: 0,
            totalFundingAllocated: 0,
            daiDeposit: toBorrow,
            state: ProjectState.Created,
            cid: cid,
            funders: funders,
            safe: address(0),
            shares: shares,
            distribution: distribution
        });

        // send shares to creator
        shares.transfer(msg.sender, _DEFAULT_SHARES * (10 ** 18) - (_DEFAULT_SHARES * distribution));

        emit ProjectCreated(projectId, msg.sender, msg.value, fundingRequired, cid);
    }

    function fundProject(
        bytes32 id,
        uint256 amount
    ) external {
        address sender = _msgSender();

        Project storage project = _projects[id];
        require(project.id == id, "Project must exist");
        require(project.state == ProjectState.Created, "Project must be in Created state");
        require(project.creator != sender, "Cannot fund your own project");

        require(_defaultCurrency.allowance(sender, address(this)) >= amount, "Must approve DAI first");

        project.funders.push(sender);
        _fundings[sender][id] += amount;

        uint256 fundingLeftToMeet = project.totalFundingRequired - project.totalFundingReceived;
        if (amount >= fundingLeftToMeet) {
            amount = fundingLeftToMeet;
        }

        project.totalFundingReceived += amount;

        if (project.totalFundingReceived == project.totalFundingRequired) {
            _startProject(project);
        }

        emit ProjectFunded(id, sender, amount);
    }

    function requestTranche(bytes32 id, uint256 amount, bytes calldata claim) external {
        Project storage project = _projects[id];
        require(project.id == id, "Project must exist");
        require(project.state == ProjectState.Started, "Project must be in Started state");
        require(project.safe == _msgSender(), "Only safe can request tranche");

        uint256 bondAmount = _umaOracle.getMinimumBond(address(_defaultCurrency));
        IERC20 bondCurrency = _defaultCurrency;
        if (bondAmount == 0) { // for testnet 1 USDC goerli
            bondAmount = 1 * (10 ** 6);
            bondCurrency = IERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F);
        } else {
            _savingsDai.withdraw(bondAmount, address(this), address(this));
        }
        bondCurrency.forceApprove(address(_umaOracle), bondAmount);

        bytes32 assertionId = _umaOracle.assertTruth(
            claim,
            address(this),
            address(this),
            address(0),
            1 minutes, // TODO: better period for mainnet?
            bondCurrency,
            bondAmount,
            _umaOracle.defaultIdentifier(),
            bytes32(0)
        );

        _tranches[assertionId] = Tranche({
            projectId: id,
            amount: amount,
            claim: claim,
            claimed: false
        });

        emit TrancheRequested(assertionId, id, amount, claim);
    }

    function assertionResolvedCallback(
        bytes32 assertionId,
        bool assertedTruthfully
    ) onlyUmaOracle external {
        Tranche storage tranche = _tranches[assertionId];
        require(tranche.amount > 0, "Tranche must exist");
        Project storage project = _projects[tranche.projectId];
        require(project.id == tranche.projectId, "Project must exist");

        project.totalFundingAllocated += tranche.amount;
        if (project.totalFundingAllocated == project.totalFundingRequired) {
            _completeProject(project);
        }

        if (assertedTruthfully) {
            // sending the funds: sDai -> Dai
            _savingsDai.withdraw(tranche.amount, project.creator, address(this));
            emit TrancheClaimed(assertionId, tranche.projectId, tranche.amount);
        } else {
            emit TrancheFailed(assertionId, tranche.projectId, tranche.amount);
        }

        tranche.amount = 0;
        tranche.claimed = true;
    }

    // If assertion is disputed, do nothing and wait for resolution.
    function assertionDisputedCallback(
        bytes32 /* assertionId */
    ) onlyUmaOracle external {
        // TODO: emit event and do some fancy logic with xmtp/pushes?
    }

    function _startProject(Project storage project) internal {
        for (uint256 i = 0; i < project.funders.length; i++) {
            address funder = project.funders[i];
            uint256 amount = _fundings[funder][project.id];
            if (amount > 0) { // will be 0 for creator
                _defaultCurrency.transferFrom(funder, address(this), amount);
                uint256 sharesAmount = _DEFAULT_SHARES * project.distribution * amount / project.totalFundingReceived;
                project.shares.transfer(funder, sharesAmount);
            }
        }
        _savingsDai.deposit(project.totalFundingReceived, address(this));

        // create safe
        SafeProxy safe = _safeFactory.createProxyWithNonce(
            _safeSingleton,
            abi.encodeWithSignature(
                "setup(address[],uint256,address,bytes,address,address,uint256,address)",
                project.funders,
                project.funders.length - 1,
                0x0000000000000000000000000000000000000000,
                bytes(""),
                0x0000000000000000000000000000000000000000,
                0x0000000000000000000000000000000000000000,
                0,
                0x0000000000000000000000000000000000000000
            ),
            133701
        );
        project.safe = address(safe);
        project.state = ProjectState.Started;

        emit ProjectStarted(project.id, address(safe));
    }

    function _completeProject(Project storage project) internal {
        // TODO: collect sDAI interest

        project.state = ProjectState.Completed;
        emit ProjectCompleted(project.id);
    }
}
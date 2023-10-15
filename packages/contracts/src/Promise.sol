// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.16;

import "@uma/core/contracts/optimistic-oracle-v3/implementation/ClaimData.sol";
import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CryptoVCProtocol {
    using SafeERC20 for IERC20;
    IERC20 public immutable defaultCurrency;
    OptimisticOracleV3Interface public immutable oo;
    uint64 public constant assertionLiveness = 7200;
    bytes32 public immutable defaultIdentifier;

    struct Promise {
        bytes statement;
        address promisor;
        bool fullfilled;
        bool asserted;
    }

    mapping(bytes32 => bytes32) public assertedPromises;
    mapping(bytes32 => Promise) public promises;

    event PromiseAsserted(
        bytes32 indexed promiseId,
        address indexed promisor,
        bool indexed fullfilled
    );
    event PromiseAssertionRequested(
        bytes32 indexed promiseId,
        bytes32 indexed assertionId
    );
    event PromiseIssued(
        bytes32 indexed promiseId,
        address indexed promisor
    );

    constructor(address _defaultCurrency, address _optimisticOracleV3) {
        defaultCurrency = IERC20(_defaultCurrency);
        oo = OptimisticOracleV3Interface(_optimisticOracleV3);
        defaultIdentifier = oo.defaultIdentifier();
    }

    function issuePromise(bytes memory statement) public returns (bytes32 promiseId) {
        promiseId = keccak256(abi.encode(statement, msg.sender));
        promises[promiseId] = Promise({
            statement: statement,
            promisor: msg.sender,
            fullfilled: false,
            asserted: false
        });
        emit PromiseIssued(promiseId, msg.sender);
    }

    function getFullfilled(bytes32 promiseId) public view returns (bool, bool) {
        return (promises[promiseId].fullfilled, promises[promiseId].asserted);
    }

    function assertPromise(bytes32 promiseId) public returns (bytes32 assertionId) {
        uint256 bond = oo.getMinimumBond(address(defaultCurrency));
        defaultCurrency.safeTransferFrom(msg.sender, address(this), bond);
        defaultCurrency.forceApprove(address(oo), bond);

        assertionId = oo.assertTruth(
            abi.encodePacked(
                "Promise contract is claiming that statement ",
                promises[promiseId].statement,
                " had occurred as of ",
                ClaimData.toUtf8BytesUint(block.timestamp),
                "."
            ),
            msg.sender,
            address(this),
            address(0), // No sovereign security.
            assertionLiveness,
            defaultCurrency,
            bond,
            defaultIdentifier,
            bytes32(0) // No domain.
        );

        assertedPromises[assertionId] = promiseId;
        emit PromiseAssertionRequested(promiseId, assertionId);
    }

    function assertionResolvedCallback(
        bytes32 assertionId,
        bool assertedTruthfully
    ) public {
        require(msg.sender == address(oo));
        bytes32 promiseId = assertedPromises[assertionId];
        Promise memory p = promises[promiseId];
        p.fullfilled = assertedTruthfully;
        p.asserted = true;
        emit PromiseAsserted(promiseId, p.promisor, p.fullfilled);
        delete assertedPromises[assertionId];
    }

    // If assertion is disputed, do nothing and wait for resolution.
    function assertionDisputedCallback(bytes32 assertionId) public {
        // require(msg.sender == address(oo));
        // TODO: emit event and do some fancy logic with xmtp/pushes?
    }
}
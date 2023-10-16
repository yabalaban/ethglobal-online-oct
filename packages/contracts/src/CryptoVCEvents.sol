// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

interface CryptoVCEvents {
    event ProjectCreated(
        bytes32 indexed projectId,
        address indexed creator,
        uint256 ethCollateralDeposit,
        uint256 fundingRequired,
        bytes cid
    );

    event ProjectFunded(
        bytes32 indexed projectId,
        address indexed funder,
        uint256 amount
    );

    event ProjectStarted(bytes32 indexed projectId, address indexed safe);

    event ProjectCompleted(bytes32 indexed projectId);

    event TrancheRequested(
        bytes32 indexed trancheId,
        bytes32 indexed projectId,
        uint256 amount,
        bytes claim
    );

    event TrancheClaimed(bytes32 indexed trancheId, bytes32 indexed projectId, uint256 amount);
    event TrancheFailed(bytes32 indexed trancheId, bytes32 indexed projectId, uint256 amount);
}
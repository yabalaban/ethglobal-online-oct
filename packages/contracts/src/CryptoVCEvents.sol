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
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Owned} from "@solmate/auth/Owned.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";

contract SharesToken is ERC20, Owned {
    constructor(uint256 shares)
        ERC20("SharesToken", "SHARES", 18)
        Owned(msg.sender)
    {
        _mint(msg.sender, shares);
    }
}

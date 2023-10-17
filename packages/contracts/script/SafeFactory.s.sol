// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {SafeProxyFactory} from "@safe/proxies/SafeProxyFactory.sol";
import {SafeProxy} from "@safe/proxies/SafeProxy.sol";

contract SafeScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address[] memory funders = new address[](2);
        funders[0] = 0xE432a8314d971441Ad7700e8b45d66cC326CE517;
        funders[1] = 0x030D144c32B519B497e756F488Fdc98747201029;

        SafeProxyFactory _safeFactory = SafeProxyFactory(0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2);

        SafeProxy safe = _safeFactory.createProxyWithNonce(
            0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552,
            abi.encodeWithSignature(
                "setup(address[],uint256,address,bytes,address,address,uint256,address)",
                funders,
                funders.length - 1,
                0x0000000000000000000000000000000000000000,
                bytes(""),
                0x0000000000000000000000000000000000000000,
                0x0000000000000000000000000000000000000000,
                0,
                0x0000000000000000000000000000000000000000
            ),
            1337
        );

        console2.log("safe: ", address(safe));

        vm.stopBroadcast();
    }
}

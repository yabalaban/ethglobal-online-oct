// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {ISavingsDai} from "@sdai/ISavingsDai.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPoolAddressesProvider} from "@spark-core/interfaces/IPoolAddressesProvider.sol";
import {IWrappedTokenGatewayV3} from "@spark-periphery/misc/interfaces/IWrappedTokenGatewayV3.sol";
import {SafeProxyFactory} from "@safe/proxies/SafeProxyFactory.sol";
import {OptimisticOracleV3Interface} from "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import {CryptoVC} from "../src/CryptoVC.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        CryptoVC vc = new CryptoVC{salt: bytes32(uint256(1337))}(
            IERC20(0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844), // goerli dai
            OptimisticOracleV3Interface(0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB), // uma goerli
            ISavingsDai(0xD8134205b0328F5676aaeFb3B2a0DC15f4029d8C), // spark savings dai goerli
            IWrappedTokenGatewayV3(0xe6fC577E87F7c977c4393300417dCC592D90acF8), // spark eth gateway
            IPoolAddressesProvider(0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E), // spark goerli addresses provider
            SafeProxyFactory(0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2),
            0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552, // safe singleton or 0x3E5c63644E683549055b9Be8653de26E0B4CD36E L2
            0xb539068872230f20456CF38EC52EF2f91AF4AE49  // trusted forwarder gelato relay
        );

        console2.log("vc address: ", address(vc));

        vm.stopBroadcast();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {RecyclingTraceability} from "../src/RecyclingTraceability.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        address admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; 
        AccessManager access = new AccessManager(admin);

        new RecyclingTraceability(address(access));

        vm.stopBroadcast();
    }
}

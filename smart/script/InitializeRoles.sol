// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AccessManager} from "../src/AccessManager.sol";

contract InitializeRoles is Script {
    address constant ADMIN = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant ACCESS_MANAGER = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    address constant CITIZEN = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address constant TRANSPORTER = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    address constant PROCESSOR = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
    address constant REWARD_AUTHORITY = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;

    function run() external {
        AccessManager access = AccessManager(ACCESS_MANAGER);

        // --- Leer los roles antes de hacer broadcast ---
        bytes32 citizenRole = access.CITIZEN();
        bytes32 transporterRole = access.TRANSPORTER();
        bytes32 processorRole = access.PROCESSOR();
        bytes32 rewardRole = access.REWARD_AUTHORITY();

        // --- PASO 1: Solicitudes de rol ---
        vm.startBroadcast(CITIZEN);
        access.requestRole(citizenRole);
        vm.stopBroadcast();

        vm.startBroadcast(TRANSPORTER);
        access.requestRole(transporterRole);
        vm.stopBroadcast();

        vm.startBroadcast(PROCESSOR);
        access.requestRole(processorRole);
        vm.stopBroadcast();

        vm.startBroadcast(REWARD_AUTHORITY);
        access.requestRole(rewardRole);
        vm.stopBroadcast();

        // --- PASO 2: Aprobaciones del admin ---
        vm.startBroadcast(ADMIN);
        access.approveAccount(CITIZEN);
        access.approveAccount(TRANSPORTER);
        access.approveAccount(PROCESSOR);
        access.approveAccount(REWARD_AUTHORITY);
        vm.stopBroadcast();
    }
}
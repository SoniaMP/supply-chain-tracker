// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {AccessManager} from "../src/AccessManager.sol";

contract AccessManagerTest is Test {
    AccessManager public manager;
    address public admin = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    bytes32 constant ADMIN = keccak256("ADMIN");
    bytes32 constant CONSUMER = keccak256("CONSUMER");
    bytes32 constant RETAILER = keccak256("RETAILER");
    bytes32 constant FACTORY = keccak256("FACTORY");
    bytes32 constant PRODUCER = keccak256("PRODUCER");

    function setUp() public {
        manager = new AccessManager(admin);
    }

    // --- 1️⃣ Deploy ---
    function test_AdminHasRoleAfterDeploy() public view {
        assertTrue(manager.hasRole(ADMIN, admin));
        assertTrue(manager.hasRole(manager.DEFAULT_ADMIN_ROLE(), admin));
    }

    // --- 2️⃣ Solicitud de rol ---
    function test_UserCanRequestRole() public {
        vm.startPrank(user1);
        manager.requestRole(CONSUMER);
        vm.stopPrank();

        (bytes32 role, uint8 status) = manager.getAccountInfo(user1);
        assertEq(role, CONSUMER);
        assertEq(status, uint8(AccessManager.AccountStatus.Pending));
    }

    function test_RevertIfRequestInvalidRole() public {
        vm.startPrank(user1);
        vm.expectRevert("Invalid role");
        manager.requestRole(keccak256("INVALID_ROLE"));
        vm.stopPrank();
    }

    function test_RevertIfAlreadyRequested() public {
        vm.startPrank(user1);
        manager.requestRole(RETAILER);
        vm.expectRevert("Already requested or processed");
        manager.requestRole(RETAILER);
        vm.stopPrank();
    }

    // --- 3️⃣ Aprobación de cuenta ---
    function test_AdminCanApproveAccount() public {
        vm.startPrank(user1);
        manager.requestRole(CONSUMER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        (bytes32 role, uint8 status) = manager.getAccountInfo(user1);
        assertEq(role, CONSUMER);
        assertEq(status, uint8(AccessManager.AccountStatus.Approved));
        assertTrue(manager.hasRole(CONSUMER, user1));
    }

    function test_RevertIfNotPendingOnApprove() public {
        vm.startPrank(admin);
        vm.expectRevert("Not pending");
        manager.approveAccount(user1);
        vm.stopPrank();
    }

    // --- 4️⃣ Rechazo ---
    function test_AdminCanRejectAccount() public {
        vm.startPrank(user1);
        manager.requestRole(RETAILER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.rejectAccount(user1);
        vm.stopPrank();

        (, uint8 status) = manager.getAccountInfo(user1);
        assertEq(status, uint8(AccessManager.AccountStatus.Rejected));
        assertFalse(manager.hasRole(RETAILER, user1));
    }

    // --- 5️⃣ Cancelación ---
    function test_AdminCanCancelAccount() public {
        vm.startPrank(user1);
        manager.requestRole(FACTORY);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        manager.cancelAccount(user1);
        vm.stopPrank();

        (, uint8 status) = manager.getAccountInfo(user1);
        assertEq(status, uint8(AccessManager.AccountStatus.Canceled));
        assertFalse(manager.hasRole(FACTORY, user1));
    }

    function test_RevertIfCancelWithoutApproval() public {
        vm.startPrank(user1);
        manager.requestRole(PRODUCER);
        vm.stopPrank();

        vm.startPrank(admin);
        vm.expectRevert("Not approved");
        manager.cancelAccount(user1);
        vm.stopPrank();
    }

    // --- 6️⃣ Listados y consultas ---
    function test_GetAccountsByRole() public {
        vm.startPrank(user1);
        manager.requestRole(CONSUMER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        address[] memory consumers = manager.getAccountsByRole(CONSUMER);
        assertEq(consumers.length, 1);
        assertEq(consumers[0], user1);
    }

    function test_HasActiveRole() public {
        vm.startPrank(user1);
        manager.requestRole(CONSUMER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        assertTrue(manager.hasActiveRole(user1, CONSUMER));
    }

    function test_GetAllAccounts() public {
        // User1 as CONSUMER
        vm.startPrank(user1);
        manager.requestRole(CONSUMER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        // User2 as RETAILER
        vm.startPrank(user2);
        manager.requestRole(RETAILER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user2);
        vm.stopPrank();

        (
            address[] memory accountsList,
            bytes32[] memory roles,
            uint8[] memory statuses
        ) = manager.getAllAccounts();

        assertEq(accountsList.length, 3);
        assertEq(roles.length, 3);
        assertEq(statuses.length, 3);

        assertEq(accountsList[1], user1);
        assertEq(roles[1], CONSUMER);
        assertEq(statuses[1], uint8(AccessManager.AccountStatus.Approved));

        assertEq(accountsList[2], user2);
        assertEq(roles[2], RETAILER);
        assertEq(statuses[2], uint8(AccessManager.AccountStatus.Approved));
    }
}

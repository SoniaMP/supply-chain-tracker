// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {AccessManager} from "../src/AccessManager.sol";

contract AccessManagerTest is Test {
    AccessManager public accessManager;
    
    address public admin;
    address public user1;
    address public user2;
    address public user3;
    address public user4;
    address public user5;
    
    // Events to test
    event RoleAssigned(address indexed account, bytes32 indexed role, address indexed admin);
    event RoleRevoked(address indexed account, bytes32 indexed role, address indexed admin);

    function setUp() public {
        admin = address(0x1);
        user1 = address(0x2);
        user2 = address(0x3);
        user3 = address(0x4);
        user4 = address(0x5);
        user5 = address(0x6);
        
        // Deploy AccessManager with admin
        accessManager = new AccessManager(admin);
    }

    // ============ Constructor Tests ============
    
    function testConstructor() public view {
        // Check that admin has ADMIN role
        assertTrue(accessManager.isAdmin(admin));
        assertTrue(accessManager.hasRole(accessManager.ADMIN(), admin));
        
        // Check that admin has DEFAULT_ADMIN_ROLE
        assertTrue(accessManager.hasRole(accessManager.DEFAULT_ADMIN_ROLE(), admin));
        
        // Check that other users don't have admin role
        assertFalse(accessManager.isAdmin(user1));
    }
    
    function testConstructorZeroAddress() public {
        vm.expectRevert("AccessManager: Admin cannot be zero address");
        new AccessManager(address(0));
    }

    // ============ Role Assignment Tests ============
    
    function testAssignRoleByAdmin() public {
        vm.startPrank(admin);
        
        // Assign CONSUMER role to user1
        vm.expectEmit();
        emit RoleAssigned(user1, accessManager.CONSUMER(), admin);
        accessManager.assignRole(user1, accessManager.CONSUMER());
        
        // Verify role assignment
        assertTrue(accessManager.isConsumer(user1));
        assertTrue(accessManager.checkRole(user1, accessManager.CONSUMER()));
        
        vm.stopPrank();
    }
    
    function testAssignMultipleRoles() public {
        vm.startPrank(admin);
        
        // Assign different roles to different users
        accessManager.assignRole(user1, accessManager.CONSUMER());
        accessManager.assignRole(user2, accessManager.RETAILER());
        accessManager.assignRole(user3, accessManager.FACTORY());
        accessManager.assignRole(user4, accessManager.PRODUCER());
        
        // Verify all assignments
        assertTrue(accessManager.isConsumer(user1));
        assertTrue(accessManager.isRetailer(user2));
        assertTrue(accessManager.isFactory(user3));
        assertTrue(accessManager.isProducer(user4));
        
        vm.stopPrank();
    }
    
    function testAssignRoleByNonAdmin() public {
        // First verify that user1 is not an admin
        bytes32 consumerRole = accessManager.CONSUMER();
        assertFalse(accessManager.isAdmin(user1));
        
        vm.expectRevert();

        accessManager.assignRole(user2, consumerRole);
        
        vm.stopPrank();
    }
    
    function testAssignRoleZeroAddress() public {
        bytes32 consumerRole = accessManager.CONSUMER();
        vm.startPrank(admin);
        
        vm.expectRevert("AccessManager: Account cannot be zero address");
        accessManager.assignRole(address(0), consumerRole);
        
        vm.stopPrank();
    }
    
    function testAssignInvalidRole() public {
        vm.startPrank(admin);
        
        vm.expectRevert("AccessManager: Invalid role");
        accessManager.assignRole(user1, keccak256("INVALID_ROLE"));
        
        vm.stopPrank();
    }

    // ============ Role Revocation Tests ============
    
    function testRevokeRoleByAdmin() public {
        bytes32 consumerRole = accessManager.CONSUMER();
        vm.startPrank(admin);
        
        // First assign a role
        accessManager.assignRole(user1, consumerRole);
        assertTrue(accessManager.isConsumer(user1));
        
        // Then revoke it
        vm.expectEmit();
        emit RoleRevoked(user1, consumerRole, admin);
        accessManager.revokeRole(user1, consumerRole);
        
        // Verify role revocation
        assertFalse(accessManager.isConsumer(user1));
        assertFalse(accessManager.checkRole(user1, consumerRole));
        
        vm.stopPrank();
    }
    
    function testRevokeRoleByNonAdmin() public {
        bytes32 consumerRole = accessManager.CONSUMER();

        vm.startPrank(admin);
        accessManager.assignRole(user1, consumerRole);
        vm.stopPrank();
        
        // Verify that user1 is not an admin
        assertFalse(accessManager.isAdmin(user1));
        
        vm.startPrank(user1);
        
        //vm.expectRevert();
        vm.expectRevert();
        accessManager.revokeRole(user1, consumerRole);
        
        vm.stopPrank();
    }
    
    function testRevokeRoleZeroAddress() public {
        bytes32 consumerRole = accessManager.CONSUMER();
        vm.startPrank(admin);
        
        vm.expectRevert("AccessManager: Account cannot be zero address");
        accessManager.revokeRole(address(0), consumerRole);
        
        vm.stopPrank();
    }
    
    function testRevokeInvalidRole() public {
        vm.startPrank(admin);
        
        vm.expectRevert("AccessManager: Invalid role");
        accessManager.revokeRole(user1, keccak256("INVALID_ROLE"));
        
        vm.stopPrank();
    }

    // ============ Role Checking Tests ============
    
    function testCheckRole() public {
        vm.startPrank(admin);
        
        accessManager.assignRole(user1, accessManager.CONSUMER());
        accessManager.assignRole(user2, accessManager.RETAILER());
        
        // Test checkRole function
        assertTrue(accessManager.checkRole(user1, accessManager.CONSUMER()));
        assertTrue(accessManager.checkRole(user2, accessManager.RETAILER()));
        assertFalse(accessManager.checkRole(user1, accessManager.RETAILER()));
        assertFalse(accessManager.checkRole(user2, accessManager.CONSUMER()));
        
        vm.stopPrank();
    }
    
    function testIsAdmin() public view {
        assertTrue(accessManager.isAdmin(admin));
        assertFalse(accessManager.isAdmin(user1));
    }
    
    function testIsConsumer() public {
        vm.startPrank(admin);
        accessManager.assignRole(user1, accessManager.CONSUMER());
        vm.stopPrank();
        
        assertTrue(accessManager.isConsumer(user1));
        assertFalse(accessManager.isConsumer(user2));
    }
    
    function testIsRetailer() public {
        vm.startPrank(admin);
        accessManager.assignRole(user1, accessManager.RETAILER());
        vm.stopPrank();
        
        assertTrue(accessManager.isRetailer(user1));
        assertFalse(accessManager.isRetailer(user2));
    }
    
    function testIsFactory() public {
        vm.startPrank(admin);
        accessManager.assignRole(user1, accessManager.FACTORY());
        vm.stopPrank();
        
        assertTrue(accessManager.isFactory(user1));
        assertFalse(accessManager.isFactory(user2));
    }
    
    function testIsProducer() public {
        vm.startPrank(admin);
        accessManager.assignRole(user1, accessManager.PRODUCER());
        vm.stopPrank();
        
        assertTrue(accessManager.isProducer(user1));
        assertFalse(accessManager.isProducer(user2));
    }

    // ============ Role Members Tests ============
    
    function testGetAccountsByRole() public {
        vm.startPrank(admin);
        
        accessManager.assignRole(user1, accessManager.CONSUMER());
        accessManager.assignRole(user2, accessManager.CONSUMER());
        accessManager.assignRole(user3, accessManager.RETAILER());
        
        // Get all consumers
        address[] memory consumers = accessManager.getAccountsByRole(accessManager.CONSUMER());
        assertEq(consumers.length, 2);
        assertEq(consumers[0], user1);
        assertEq(consumers[1], user2);
        
        // Get all retailers
        address[] memory retailers = accessManager.getAccountsByRole(accessManager.RETAILER());
        assertEq(retailers.length, 1);
        assertEq(retailers[0], user3);
        
        vm.stopPrank();
    }

    // ============ Utility Functions Tests ============
    
    function testIsValidRole() public view {
        assertTrue(accessManager.isValidRole(accessManager.ADMIN()));
        assertTrue(accessManager.isValidRole(accessManager.CONSUMER()));
        assertTrue(accessManager.isValidRole(accessManager.RETAILER()));
        assertTrue(accessManager.isValidRole(accessManager.FACTORY()));
        assertTrue(accessManager.isValidRole(accessManager.PRODUCER()));
        
        assertFalse(accessManager.isValidRole(keccak256("INVALID")));
        assertFalse(accessManager.isValidRole(keccak256("")));
    }
    
    function testGetRoleName() public view {
        assertEq(accessManager.getRoleName(accessManager.ADMIN()), "ADMIN");
        assertEq(accessManager.getRoleName(accessManager.CONSUMER()), "CONSUMER");
        assertEq(accessManager.getRoleName(accessManager.RETAILER()), "RETAILER");
        assertEq(accessManager.getRoleName(accessManager.FACTORY()), "FACTORY");
        assertEq(accessManager.getRoleName(accessManager.PRODUCER()), "PRODUCER");
        assertEq(accessManager.getRoleName(keccak256("INVALID")), "UNKNOWN");
    }

    // ============ Complex Scenarios Tests ============
    
    function testAssignAndRevokeMultipleRoles() public {
        vm.startPrank(admin);
        
        // Assign multiple roles to same user
        accessManager.assignRole(user1, accessManager.CONSUMER());
        accessManager.assignRole(user1, accessManager.RETAILER());
        
        assertTrue(accessManager.isConsumer(user1));
        assertTrue(accessManager.isRetailer(user1));
        
        // Revoke one role, keep the other
        accessManager.revokeRole(user1, accessManager.CONSUMER());
        
        assertFalse(accessManager.isConsumer(user1));
        assertTrue(accessManager.isRetailer(user1));
        
        vm.stopPrank();
    }
    
    function testRoleMembersAfterRevoke() public {
        vm.startPrank(admin);
        
        // Assign roles to multiple users
        accessManager.assignRole(user1, accessManager.CONSUMER());
        accessManager.assignRole(user2, accessManager.CONSUMER());
        accessManager.assignRole(user3, accessManager.CONSUMER());
        
        // Verify initial state
        assertEq(accessManager.getRoleMemberCount(accessManager.CONSUMER()), 3);
        
        // Revoke middle user's role
        accessManager.revokeRole(user2, accessManager.CONSUMER());
        
        // Verify updated state
        assertEq(accessManager.getRoleMemberCount(accessManager.CONSUMER()), 2);
        address[] memory consumers = accessManager.getAccountsByRole(accessManager.CONSUMER());
        assertEq(consumers.length, 2);
        assertEq(consumers[0], user1);
        assertEq(consumers[1], user3);
        
        vm.stopPrank();
    }
    
    function testReassignSameRole() public {
        vm.startPrank(admin);
        
        // Assign role
        accessManager.assignRole(user1, accessManager.CONSUMER());
        assertTrue(accessManager.isConsumer(user1));
        assertEq(accessManager.getRoleMemberCount(accessManager.CONSUMER()), 1);
        
        // Try to assign same role again (should not fail but also not duplicate)
        accessManager.assignRole(user1, accessManager.CONSUMER());
        assertTrue(accessManager.isConsumer(user1));
        assertEq(accessManager.getRoleMemberCount(accessManager.CONSUMER()), 1);
        
        vm.stopPrank();
    }
}

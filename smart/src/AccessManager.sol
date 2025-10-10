// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

/**
 * @title AccessManager
 * @dev Sistema de gestión de acceso con solicitud de roles y estados de cuenta.
 */
contract AccessManager is AccessControl {
    // --- Roles ---
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant CONSUMER = keccak256("CONSUMER");
    bytes32 public constant RETAILER = keccak256("RETAILER");
    bytes32 public constant FACTORY = keccak256("FACTORY");
    bytes32 public constant PRODUCER = keccak256("PRODUCER");

    // --- Estados ---
    enum AccountStatus {
        Pending,   // 0
        Approved,  // 1
        Rejected,  // 2
        Canceled   // 3
    }

    struct Account {
        bytes32 role;   // 32 bytes
        uint8 status;   // 1 byte
    }

    mapping(address => Account) private accounts;
    mapping(bytes32 => address[]) private _roleMembers;
    mapping(bytes32 => mapping(address => bool)) private _isInRoleMembers;

    // --- Eventos ---
    event RoleRequested(address indexed account, bytes32 indexed role);
    event AccountApproved(address indexed account, bytes32 indexed role);
    event AccountRejected(address indexed account);
    event AccountCanceled(address indexed account);

    // --- Constructor ---
    constructor(address _admin) {
        require(_admin != address(0), "Admin cannot be zero address");
        _grantRole(ADMIN, _admin);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);

        // Registrar al admin como Approved
        accounts[_admin] = Account(ADMIN, uint8(AccountStatus.Approved));
        _roleMembers[ADMIN].push(_admin);
        _isInRoleMembers[ADMIN][_admin] = true;
    }

    // --- Solicitud de rol ---
    function requestRole(bytes32 role) external {
        require(isValidRole(role), "Invalid role");
        Account storage acc = accounts[msg.sender];
        require(acc.status == 0, "Already requested or processed");

        accounts[msg.sender] = Account(role, uint8(AccountStatus.Pending));
        emit RoleRequested(msg.sender, role);
    }

    // --- Aprobación ---
    function approveAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];
        require(acc.status == uint8(AccountStatus.Pending), "Not pending");
        acc.status = uint8(AccountStatus.Approved);

        _grantRole(acc.role, account);
        if (!_isInRoleMembers[acc.role][account]) {
            _roleMembers[acc.role].push(account);
            _isInRoleMembers[acc.role][account] = true;
        }

        emit AccountApproved(account, acc.role);
    }

    // --- Rechazo ---
    function rejectAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];
        require(acc.status == uint8(AccountStatus.Pending), "Not pending");
        acc.status = uint8(AccountStatus.Rejected);
        emit AccountRejected(account);
    }

    // --- Cancelación ---
    function cancelAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];
        require(acc.status == uint8(AccountStatus.Approved), "Not approved");
        acc.status = uint8(AccountStatus.Canceled);

        _revokeRole(acc.role, account);
        emit AccountCanceled(account);
    }

    // --- Consultas ---
    function getAccountInfo(address account)
        external
        view
        returns (bytes32 role, uint8 status)
    {
        Account memory acc = accounts[account];
        return (acc.role, acc.status);
    }

    function getAccountsByRole(bytes32 role) external view returns (address[] memory) {
        return _roleMembers[role];
    }

    function hasActiveRole(address account, bytes32 role) external view returns (bool) {
        Account memory acc = accounts[account];
        return acc.status == uint8(AccountStatus.Approved) && hasRole(role, account);
    }

    // --- Validaciones ---
    function isValidRole(bytes32 role) public pure returns (bool) {
        return role == ADMIN ||
               role == CONSUMER ||
               role == RETAILER ||
               role == FACTORY ||
               role == PRODUCER;
    }

    function getRoleName(bytes32 role) external pure returns (string memory) {
        if (role == ADMIN) return "ADMIN";
        if (role == CONSUMER) return "CONSUMER";
        if (role == RETAILER) return "RETAILER";
        if (role == FACTORY) return "FACTORY";
        if (role == PRODUCER) return "PRODUCER";
        return "UNKNOWN";
    }
}
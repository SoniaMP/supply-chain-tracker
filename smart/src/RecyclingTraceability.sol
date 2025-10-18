// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessManager} from "./AccessManager.sol";

contract RecyclingTraceability {
    AccessManager public accessManager;

    enum Stage {
        None,
        Created,
        Collected,
        Processed,
        Rewarded
    }

    struct Token {
        uint256 id;
        address creator;
        address currentHolder;
        string name;
        uint256 totalSupply;
        string citizenFeatures; 
        string processorFeatures;
        uint256 parentId;
        uint256 dateCreated;
        Stage stage;
    }

    struct TokenView {
        uint256 id;
        address creator;
        address currentHolder;
        string name;
        uint256 totalSupply;
        uint8 stage;
        string citizenFeatures;
        string processorFeatures;
        uint256 dateCreated;
    }

    uint256 private _tokenCounter;
    mapping(uint256 => Token) private _tokens;
    uint256[] private _allTokenIds;

    event TokenCreated(uint256 indexed id, address indexed citizen, string name);
    event TokenCollected(uint256 indexed id, address indexed transporter);
    event TokenProcessed(uint256 indexed id, address indexed processor);
    event TokenRewarded(uint256 indexed id, address indexed authority);

    event CustodyChanged(
        uint256 indexed tokenId,
        address indexed previousHolder,
        address indexed newHolder,
        uint8 action,
        uint256 timestamp
    );

    modifier onlyRoleActive(bytes32 role) {
        require(
            accessManager.hasActiveRole(msg.sender, role),
            "Access denied: inactive or missing role"
        );
        _;
    }

    constructor(address accessManagerAddr) {
        require(accessManagerAddr != address(0), "Invalid AccessManager");
        accessManager = AccessManager(accessManagerAddr);
    }

    // --- 1️⃣ Citizen: crea el token inicial ---
    function createToken(
        string memory name,
        uint256 totalSupply,
        string memory citizenFeatures,
        uint256 parentId
    ) external onlyRoleActive(accessManager.CITIZEN()) {
        require(bytes(name).length > 0, "Empty name");
        require(totalSupply > 0, "Invalid totalSupply");

        _tokenCounter++;
        uint256 newId = _tokenCounter;

        _tokens[newId] = Token({
            id: newId,
            creator: msg.sender,
            currentHolder: msg.sender,
            name: name,
            totalSupply: totalSupply,
            citizenFeatures: citizenFeatures,
            processorFeatures: "",
            parentId: parentId,
            dateCreated: block.timestamp,
            stage: Stage.Created
        });

        _allTokenIds.push(newId);

        emit TokenCreated(newId, msg.sender, name);
        emit CustodyChanged(newId, address(0), msg.sender, uint8(Stage.Created), block.timestamp);
    }

    function collectToken(uint256 tokenId)
        external
        onlyRoleActive(accessManager.TRANSPORTER())
    {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Created, "Already collected or beyond");

        address previous = t.currentHolder;
        t.stage = Stage.Collected;
        t.currentHolder = msg.sender;

        emit TokenCollected(tokenId, msg.sender);
        emit CustodyChanged(tokenId, previous, msg.sender, uint8(Stage.Collected), block.timestamp);
    }

    function processToken(uint256 tokenId, string memory processorFeatures)
        external
        onlyRoleActive(accessManager.PROCESSOR())
    {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Collected, "Not collected yet");

        address previous = t.currentHolder;
        t.stage = Stage.Processed;
        t.processorFeatures = processorFeatures;
        t.currentHolder = msg.sender;

        emit TokenProcessed(tokenId, msg.sender);
        emit CustodyChanged(tokenId, previous, msg.sender, uint8(Stage.Processed), block.timestamp);
    }

    function rewardToken(uint256 tokenId)
        external
        onlyRoleActive(accessManager.REWARD_AUTHORITY())
    {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Processed, "Not processed yet");

        t.stage = Stage.Rewarded;

        emit TokenRewarded(tokenId, msg.sender);
        emit CustodyChanged(tokenId, t.currentHolder, msg.sender, uint8(Stage.Rewarded), block.timestamp);
    }

    function getToken(uint256 tokenId)
        external
        view
        returns (
            uint256 id,
            address creator,
            address currentHolder,
            string memory name,
            uint256 totalSupply,
            string memory citizenFeatures,
            string memory processorFeatures,
            uint256 parentId,
            uint256 dateCreated,
            uint8 stage
        )
    {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");

        return (
            t.id,
            t.creator,
            t.currentHolder,
            t.name,
            t.totalSupply,
            t.citizenFeatures,
            t.processorFeatures,
            t.parentId,
            t.dateCreated,
            uint8(t.stage)
        );
    }

    function getAllTokens() external view returns (TokenView[] memory list) {
        uint256 total = _allTokenIds.length;
        list = new TokenView[](total);

        for (uint256 i = 0; i < total; i++) {
            Token storage t = _tokens[_allTokenIds[i]];
            list[i] = TokenView({
                id: t.id,
                creator: t.creator,
                currentHolder: t.currentHolder,
                name: t.name,
                totalSupply: t.totalSupply,
                stage: uint8(t.stage),
                citizenFeatures: t.citizenFeatures,
                processorFeatures: t.processorFeatures,
                dateCreated: t.dateCreated
            });
        }
    }

    function getTokensByUser(address user)
        external
        view
        returns (TokenView[] memory list)
    {
        uint256 total = _allTokenIds.length;
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (_tokens[_allTokenIds[i]].creator == user) {
                count++;
            }
        }

        list = new TokenView[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            Token storage t = _tokens[_allTokenIds[i]];
            if (t.creator == user) {
                list[index] = TokenView({
                    id: t.id,
                    creator: t.creator,
                    currentHolder: t.currentHolder,
                    name: t.name,
                    totalSupply: t.totalSupply,
                    stage: uint8(t.stage),
                    citizenFeatures: t.citizenFeatures,
                    processorFeatures: t.processorFeatures,
                    dateCreated: t.dateCreated
                });
                index++;
            }
        }
    }
}
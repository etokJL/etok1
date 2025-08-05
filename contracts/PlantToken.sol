// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IQuestNFT {
    function canCreatePlant(address user) external view returns (bool);
    function burnForPlant(address user) external returns (bool);
}

contract PlantToken is ERC1155, Ownable {
    using Strings for uint256;
    
    // Constants
    uint256 public constant DEFAULT_SUB_UNITS = 1000;
    
    // State variables
    uint256 private _tokenIdCounter;
    IQuestNFT public questNFT;
    
    // Token data
    struct TokenData {
        string name;
        uint256 subUnits;
        string qrCode;
        uint256 createdAt;
        address owner;
    }
    
    mapping(uint256 => TokenData) public tokens;
    mapping(string => bool) public nameExists;
    mapping(string => uint256) public nameToTokenId;
    mapping(string => uint256) public qrCodeToTokenId;
    
    // History tracking
    struct Transaction {
        uint256 timestamp;
        uint256 amount;
        bool isLoading; // true for loading, false for unloading
        string operation;
    }
    
    mapping(uint256 => Transaction[]) public tokenHistory;
    
    // Events
    event PlantCreated(address indexed owner, uint256 indexed tokenId, string name, string qrCode);
    event SubUnitsLoaded(uint256 indexed tokenId, uint256 amount, uint256 newTotal);
    event SubUnitsUnloaded(uint256 indexed tokenId, uint256 amount, uint256 newTotal);
    
    constructor(address initialOwner, address _questNFT) ERC1155("https://api.booster-nft.com/plant/{id}.json") Ownable(initialOwner) {
        questNFT = IQuestNFT(_questNFT);
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Create a Plant Token by burning 15 NFTs
     */
    function createPlant(string memory plantName) external returns (uint256) {
        require(bytes(plantName).length > 0, "Plant name cannot be empty");
        require(!nameExists[plantName], "Plant name already exists");
        require(questNFT.canCreatePlant(msg.sender), "Missing NFTs for Plant creation");
        
        // Burn the NFTs
        require(questNFT.burnForPlant(msg.sender), "Failed to burn NFTs");
        
        uint256 tokenId = _tokenIdCounter++;
        string memory qrCode = generateQRCode(tokenId, plantName);
        
        // Store token data
        tokens[tokenId] = TokenData({
            name: plantName,
            subUnits: DEFAULT_SUB_UNITS,
            qrCode: qrCode,
            createdAt: block.timestamp,
            owner: msg.sender
        });
        
        nameExists[plantName] = true;
        nameToTokenId[plantName] = tokenId;
        qrCodeToTokenId[qrCode] = tokenId;
        
        // Mint the token
        _mint(msg.sender, tokenId, 1, "");
        
        // Record initial creation
        tokenHistory[tokenId].push(Transaction({
            timestamp: block.timestamp,
            amount: DEFAULT_SUB_UNITS,
            isLoading: true,
            operation: "Initial creation"
        }));
        
        emit PlantCreated(msg.sender, tokenId, plantName, qrCode);
        return tokenId;
    }
    
    /**
     * @dev Load sub-units into a token (manual entry)
     */
    function loadSubUnitsManual(uint256 tokenId, uint256 amount) external {
        require(balanceOf(msg.sender, tokenId) > 0, "Not token owner");
        require(amount > 0, "Amount must be positive");
        
        tokens[tokenId].subUnits += amount;
        
        tokenHistory[tokenId].push(Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isLoading: true,
            operation: "Manual loading"
        }));
        
        emit SubUnitsLoaded(tokenId, amount, tokens[tokenId].subUnits);
    }
    
    /**
     * @dev Load sub-units using formula (verified by both parties)
     */
    function loadSubUnitsFormula(uint256 tokenId, uint256 amount, bytes32 verificationHash) external {
        require(balanceOf(msg.sender, tokenId) > 0, "Not token owner");
        require(amount > 0, "Amount must be positive");
        require(verificationHash != bytes32(0), "Verification required");
        
        tokens[tokenId].subUnits += amount;
        
        tokenHistory[tokenId].push(Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isLoading: true,
            operation: "Formula loading (verified)"
        }));
        
        emit SubUnitsLoaded(tokenId, amount, tokens[tokenId].subUnits);
    }
    
    /**
     * @dev Unload sub-units from a token
     */
    function unloadSubUnits(uint256 tokenId, uint256 amount) external {
        require(balanceOf(msg.sender, tokenId) > 0, "Not token owner");
        require(amount > 0, "Amount must be positive");
        require(tokens[tokenId].subUnits >= amount, "Insufficient sub-units");
        
        tokens[tokenId].subUnits -= amount;
        
        tokenHistory[tokenId].push(Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isLoading: false,
            operation: "Unloading"
        }));
        
        emit SubUnitsUnloaded(tokenId, amount, tokens[tokenId].subUnits);
    }
    
    /**
     * @dev Get token by name
     */
    function getTokenByName(string memory name) external view returns (uint256) {
        require(nameExists[name], "Plant name does not exist");
        return nameToTokenId[name];
    }
    
    /**
     * @dev Get token by QR code
     */
    function getTokenByQRCode(string memory qrCode) external view returns (uint256) {
        uint256 tokenId = qrCodeToTokenId[qrCode];
        require(tokenId > 0, "QR code does not exist");
        return tokenId;
    }
    
    /**
     * @dev Get token details
     */
    function getTokenDetails(uint256 tokenId) external view returns (
        string memory name,
        uint256 subUnits,
        string memory qrCode,
        uint256 createdAt,
        address owner
    ) {
        require(tokenId < _tokenIdCounter && tokenId > 0, "Token does not exist");
        TokenData memory token = tokens[tokenId];
        return (token.name, token.subUnits, token.qrCode, token.createdAt, token.owner);
    }
    
    /**
     * @dev Get token history
     */
    function getTokenHistory(uint256 tokenId) external view returns (Transaction[] memory) {
        return tokenHistory[tokenId];
    }
    
    /**
     * @dev Get all tokens owned by an address
     */
    function getOwnerTokens(address owner) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](_tokenIdCounter - 1);
        uint256 counter = 0;
        
        for (uint256 i = 1; i < _tokenIdCounter; i++) {
            if (balanceOf(owner, i) > 0) {
                result[counter] = i;
                counter++;
            }
        }
        
        // Resize array to actual size
        uint256[] memory resized = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            resized[i] = result[i];
        }
        return resized;
    }
    
    /**
     * @dev Generate QR code for token
     */
    function generateQRCode(uint256 tokenId, string memory name) internal pure returns (string memory) {
        return string(abi.encodePacked("PLANT_", tokenId.toString(), "_", name));
    }
    
    /**
     * @dev Override uri for metadata
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked("https://api.booster-nft.com/plant/", tokenId.toString(), ".json"));
    }
    
    /**
     * @dev Get next token ID
     */
    function getNextTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract QuestNFT is ERC721A, Ownable {
    using Strings for uint256;
    
    // Constants
    uint256 public constant TOTAL_NFT_TYPES = 15;
    uint256 public constant NFTS_PER_PACKAGE = 5;
    
    // State variables
    uint256 public currentPackageId;
    mapping(uint256 => uint256[]) public packageContents; // packageId => NFT types
    mapping(uint256 => uint256) private _nftTypes; // tokenId => NFT type
    
    // Events
    event PackageCreated(uint256 indexed packageId, uint256[] nftTypes);
    event PackagePurchased(address indexed buyer, uint256 indexed packageId, uint256[] nftTypes);
    event NFTsBurned(address indexed user, uint256[] tokenIds);
    
    constructor(address initialOwner) ERC721A("BoosterQuestNFT", "BQNFT") Ownable(initialOwner) {
        currentPackageId = 0;
    }
    
    /**
     * @dev Create a weekly drop package with 5 random NFTs
     */
    function createWeeklyPackage() external onlyOwner returns (uint256[] memory) {
        uint256[] memory nftTypes = new uint256[](NFTS_PER_PACKAGE);
        
        // Generate 5 random NFT types (1-15)
        for (uint256 i = 0; i < NFTS_PER_PACKAGE; i++) {
            nftTypes[i] = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i, currentPackageId))) % TOTAL_NFT_TYPES) + 1;
        }
        
        packageContents[currentPackageId] = nftTypes;
        emit PackageCreated(currentPackageId, nftTypes);
        
        currentPackageId++;
        return nftTypes;
    }
    
    /**
     * @dev Purchase a package (in real app would handle payment)
     */
    function purchasePackage(uint256 packageId) external {
        require(packageId < currentPackageId, "Package does not exist");
        
        uint256[] memory nftTypes = packageContents[packageId];
        
        // Mint 5 NFTs in one transaction using ERC721A
        uint256 startTokenId = _nextTokenId();
        _mint(msg.sender, NFTS_PER_PACKAGE);
        
        // Assign NFT types to the minted tokens
        for (uint256 i = 0; i < NFTS_PER_PACKAGE; i++) {
            uint256 tokenId = startTokenId + i;
            _nftTypes[tokenId] = nftTypes[i];
        }
        
        emit PackagePurchased(msg.sender, packageId, nftTypes);
    }
    
    /**
     * @dev Get NFT type for a token ID
     */
    function getNFTType(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _nftTypes[tokenId];
    }
    
    /**
     * @dev Check if user has all 15 different NFT types for Plant creation
     */
    function canCreatePlant(address user) external view returns (bool) {
        bool[] memory hasType = new bool[](TOTAL_NFT_TYPES + 1);
        uint256 totalSupply = _nextTokenId();
        
        // Check all tokens from startTokenId to current supply
        for (uint256 tokenId = _startTokenId(); tokenId < totalSupply; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == user) {
                uint256 nftType = _nftTypes[tokenId];
                if (nftType >= 1 && nftType <= TOTAL_NFT_TYPES) {
                    hasType[nftType] = true;
                }
            }
        }
        
        for (uint256 i = 1; i <= TOTAL_NFT_TYPES; i++) {
            if (!hasType[i]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * @dev Burn 15 NFTs (one of each type) for Plant creation
     */
    function burnForPlant(address user) external returns (bool) {
        uint256 balance = balanceOf(user);
        require(balance >= TOTAL_NFT_TYPES, "Insufficient NFTs");
        
        uint256[] memory tokensToBurn = new uint256[](TOTAL_NFT_TYPES);
        bool[] memory typeBurned = new bool[](TOTAL_NFT_TYPES + 1);
        uint256 burnCount = 0;
        uint256 totalSupply = _nextTokenId();
        
        // Find one NFT of each type to burn
        for (uint256 tokenId = _startTokenId(); tokenId < totalSupply && burnCount < TOTAL_NFT_TYPES; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == user) {
                uint256 nftType = _nftTypes[tokenId];
                
                if (nftType >= 1 && nftType <= TOTAL_NFT_TYPES && !typeBurned[nftType]) {
                    tokensToBurn[burnCount] = tokenId;
                    typeBurned[nftType] = true;
                    burnCount++;
                }
            }
        }
        
        require(burnCount == TOTAL_NFT_TYPES, "Missing NFT types for Plant creation");
        
        // Burn the tokens
        for (uint256 i = 0; i < TOTAL_NFT_TYPES; i++) {
            _burn(tokensToBurn[i]);
        }
        
        emit NFTsBurned(user, tokensToBurn);
        return true;
    }
    
    /**
     * @dev Get user's NFT counts for all types
     */
    function getUserNFTCounts(address user) external view returns (uint256[] memory) {
        uint256[] memory counts = new uint256[](TOTAL_NFT_TYPES);
        uint256 totalSupply = _nextTokenId();
        
        for (uint256 tokenId = _startTokenId(); tokenId < totalSupply; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == user) {
                uint256 nftType = _nftTypes[tokenId];
                if (nftType >= 1 && nftType <= TOTAL_NFT_TYPES) {
                    counts[nftType - 1]++;
                }
            }
        }
        return counts;
    }
    
    /**
     * @dev Get package contents
     */
    function getPackageContents(uint256 packageId) external view returns (uint256[] memory) {
        return packageContents[packageId];
    }
    
    /**
     * @dev Get total available packages
     */
    function getTotalPackages() external view returns (uint256) {
        return currentPackageId;
    }
    
    /**
     * @dev Override tokenURI for metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        uint256 nftType = _nftTypes[tokenId];
        return string(abi.encodePacked("https://api.booster-nft.com/metadata/", nftType.toString(), ".json"));
    }
    
    /**
     * @dev Override _startTokenId to start from 1 instead of 0
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./QuestNFT.sol";
import "./PlantToken.sol";

/**
 * @title NFTShop
 * @dev Shop contract for purchasing NFTs and Plant Tokens with USDT
 */
contract NFTShop is Ownable, ReentrancyGuard {
    IERC20 public immutable usdt;
    QuestNFT public immutable questNFT;
    PlantToken public immutable plantToken;

    // Prices in USDT (6 decimals)
    uint256 public questNFTPackagePrice = 10 * 10**6; // 10 USDT
    uint256 public singleQuestNFTPrice = 2 * 10**6;   // 2 USDT
    uint256 public plantTokenPrice = 50 * 10**6;      // 50 USDT

    // Shop statistics
    uint256 public totalSales;
    uint256 public totalQuestNFTsSold;
    uint256 public totalPlantTokensSold;
    
    // Events
    event QuestNFTPackagePurchased(address indexed buyer, uint256 packageId, uint256 price);
    event SingleQuestNFTPurchased(address indexed buyer, uint256 nftType, uint256 price);
    event PlantTokenPurchased(address indexed buyer, string plantName, uint256 tokenId, uint256 price);
    event PricesUpdated(uint256 questNFTPackagePrice, uint256 singleQuestNFTPrice, uint256 plantTokenPrice);

    constructor(
        address _usdt,
        address _questNFT,
        address _plantToken,
        address initialOwner
    ) Ownable(initialOwner) {
        usdt = IERC20(_usdt);
        questNFT = QuestNFT(_questNFT);
        plantToken = PlantToken(_plantToken);
    }

    /**
     * @dev Purchase a random Quest NFT package (5 NFTs)
     */
    function purchaseQuestNFTPackage() external nonReentrant {
        require(usdt.balanceOf(msg.sender) >= questNFTPackagePrice, "Insufficient USDT balance");
        require(usdt.transferFrom(msg.sender, address(this), questNFTPackagePrice), "USDT transfer failed");

        // Create and purchase a random package - NFTs go directly to buyer
        uint256[] memory nftTypes = questNFT.createWeeklyPackage();
        uint256 packageId = questNFT.currentPackageId() - 1;
        questNFT.purchasePackageFor(msg.sender, packageId);

        totalSales += questNFTPackagePrice;
        totalQuestNFTsSold += nftTypes.length;

        emit QuestNFTPackagePurchased(msg.sender, packageId, questNFTPackagePrice);
    }

    /**
     * @dev Purchase a single Quest NFT of specific type
     */
    function purchaseSingleQuestNFT(uint256 nftType) external nonReentrant {
        require(nftType >= 1 && nftType <= 15, "Invalid NFT type");
        require(usdt.balanceOf(msg.sender) >= singleQuestNFTPrice, "Insufficient USDT balance");
        require(usdt.transferFrom(msg.sender, address(this), singleQuestNFTPrice), "USDT transfer failed");

        // Create custom package with single NFT type
        uint256[] memory nftTypes = new uint256[](1);
        nftTypes[0] = nftType;
        uint256 packageId = questNFT.createCustomPackage(nftTypes);
        questNFT.purchasePackageFor(msg.sender, packageId);

        totalSales += singleQuestNFTPrice;
        totalQuestNFTsSold += 1;

        emit SingleQuestNFTPurchased(msg.sender, nftType, singleQuestNFTPrice);
    }

    /**
     * @dev Purchase a Plant Token (requires user to have all 15 Quest NFT types)
     */
    function purchasePlantToken(string memory plantName) external nonReentrant {
        require(bytes(plantName).length > 0, "Plant name cannot be empty");
        require(usdt.balanceOf(msg.sender) >= plantTokenPrice, "Insufficient USDT balance");
        require(questNFT.canCreatePlant(msg.sender), "Missing required Quest NFTs");
        require(usdt.transferFrom(msg.sender, address(this), plantTokenPrice), "USDT transfer failed");

        // Note: Plant token creation calls questNFT.burnForPlant internally
        // The plant token will be minted directly to msg.sender by the PlantToken contract
        uint256 tokenId = plantToken.createPlant(plantName);

        totalSales += plantTokenPrice;
        totalPlantTokensSold += 1;

        emit PlantTokenPurchased(msg.sender, plantName, tokenId, plantTokenPrice);
    }

    /**
     * @dev Update prices (only owner)
     */
    function updatePrices(
        uint256 _questNFTPackagePrice,
        uint256 _singleQuestNFTPrice,
        uint256 _plantTokenPrice
    ) external onlyOwner {
        questNFTPackagePrice = _questNFTPackagePrice;
        singleQuestNFTPrice = _singleQuestNFTPrice;
        plantTokenPrice = _plantTokenPrice;

        emit PricesUpdated(_questNFTPackagePrice, _singleQuestNFTPrice, _plantTokenPrice);
    }

    /**
     * @dev Withdraw USDT earnings (only owner)
     */
    function withdrawEarnings() external onlyOwner {
        uint256 balance = usdt.balanceOf(address(this));
        require(balance > 0, "No earnings to withdraw");
        require(usdt.transfer(owner(), balance), "Transfer failed");
    }

    /**
     * @dev Get shop statistics
     */
    function getShopStats() external view returns (
        uint256 _totalSales,
        uint256 _totalQuestNFTsSold,
        uint256 _totalPlantTokensSold,
        uint256 _currentUSDTBalance
    ) {
        return (
            totalSales,
            totalQuestNFTsSold,
            totalPlantTokensSold,
            usdt.balanceOf(address(this))
        );
    }

    /**
     * @dev Get current prices
     */
    function getPrices() external view returns (
        uint256 _questNFTPackagePrice,
        uint256 _singleQuestNFTPrice,
        uint256 _plantTokenPrice
    ) {
        return (questNFTPackagePrice, singleQuestNFTPrice, plantTokenPrice);
    }

    /**
     * @dev Check if user can afford specific item
     */
    function canAfford(address user, uint256 itemType) external view returns (bool) {
        uint256 userBalance = usdt.balanceOf(user);
        
        if (itemType == 0) return userBalance >= questNFTPackagePrice; // Package
        if (itemType == 1) return userBalance >= singleQuestNFTPrice;   // Single NFT
        if (itemType == 2) return userBalance >= plantTokenPrice;      // Plant Token
        
        return false;
    }
}

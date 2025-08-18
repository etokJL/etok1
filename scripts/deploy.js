const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting contract deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const contracts = {};
  const timestamp = new Date().toISOString();

  try {
    // 1. Deploy QuestNFT
    console.log("\n📦 Deploying QuestNFT...");
    const QuestNFT = await ethers.getContractFactory("QuestNFT");
    const questNFT = await QuestNFT.deploy(deployer.address);
    await questNFT.waitForDeployment();
    const questNFTAddress = await questNFT.getAddress();
    console.log("✅ QuestNFT deployed to:", questNFTAddress);

    contracts.QuestNFT = {
      address: questNFTAddress,
      abi: JSON.parse(QuestNFT.interface.formatJson()),
      deployedAt: timestamp
    };

    // 2. Deploy PlantToken
    console.log("\n🌱 Deploying PlantToken...");
    const PlantToken = await ethers.getContractFactory("PlantToken");
    const plantToken = await PlantToken.deploy(deployer.address, questNFTAddress);
    await plantToken.waitForDeployment();
    const plantTokenAddress = await plantToken.getAddress();
    console.log("✅ PlantToken deployed to:", plantTokenAddress);

    contracts.PlantToken = {
      address: plantTokenAddress,
      abi: JSON.parse(PlantToken.interface.formatJson()),
      deployedAt: timestamp
    };

    // 3. Deploy MockUSDT
    console.log("\n💰 Deploying MockUSDT...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy(deployer.address);
    await mockUSDT.waitForDeployment();
    const mockUSDTAddress = await mockUSDT.getAddress();
    console.log("✅ MockUSDT deployed to:", mockUSDTAddress);

    contracts.MockUSDT = {
      address: mockUSDTAddress,
      abi: JSON.parse(MockUSDT.interface.formatJson()),
      deployedAt: timestamp
    };

    // 4. Deploy NFTShop
    console.log("\n🛒 Deploying NFTShop...");
    const NFTShop = await ethers.getContractFactory("NFTShop");
    const nftShop = await NFTShop.deploy(mockUSDTAddress, questNFTAddress, plantTokenAddress, deployer.address);
    await nftShop.waitForDeployment();
    const nftShopAddress = await nftShop.getAddress();
    console.log("✅ NFTShop deployed to:", nftShopAddress);

    contracts.NFTShop = {
      address: nftShopAddress,
      abi: JSON.parse(NFTShop.interface.formatJson()),
      deployedAt: timestamp
    };

    // 5. Create test data first (while deployer is still owner)
    console.log("\n📋 Creating test data...");
    for (let i = 0; i < 3; i++) {
      await questNFT.createWeeklyPackage();
      console.log(`✅ Created weekly package #${i}`);
    }

    // 6. Transfer ownership to NFTShop for proper shop functionality
    console.log("\n🔐 Setting up contract permissions...");
    
    console.log("📋 Transferring QuestNFT ownership to NFTShop...");
    await questNFT.transferOwnership(nftShopAddress);
    console.log("✅ QuestNFT ownership transferred");
    
    console.log("📋 Transferring PlantToken ownership to NFTShop...");
    await plantToken.transferOwnership(nftShopAddress);
    console.log("✅ PlantToken ownership transferred");

    // 7. Save contracts to JSON file
    const frontendContractsPath = path.join(__dirname, "../frontend/src/contracts.json");
    
    // Ensure directory exists
    const frontendDir = path.dirname(frontendContractsPath);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
      console.log("📁 Created frontend/src directory");
    }

    // Write contracts JSON
    fs.writeFileSync(frontendContractsPath, JSON.stringify(contracts, null, 2));
    console.log("📄 Contract addresses and ABIs saved to frontend/src/contracts.json");

    // 8. Create backup in project root
    const backupPath = path.join(__dirname, "../contracts-backup.json");
    const backupData = {
      ...contracts,
      deployedBy: deployer.address,
      deployedAt: timestamp,
      network: "localhost",
      chainId: 31337
    };
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log("💾 Backup saved to contracts-backup.json");

    // 9. Display deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("📊 Deployment Summary:");
    console.log(`📅 Timestamp: ${timestamp}`);
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`🌐 Network: localhost (Chain ID: 31337)`);
    console.log("\n📋 Contract Addresses:");
    console.log(`🎮 QuestNFT: ${questNFTAddress}`);
    console.log(`🌱 PlantToken: ${plantTokenAddress}`);
    console.log(`💰 MockUSDT: ${mockUSDTAddress}`);
    console.log(`🛒 NFTShop: ${nftShopAddress}`);
    console.log("\n📄 Files Updated:");
    console.log(`✅ ${frontendContractsPath}`);
    console.log(`✅ ${backupPath}`);
    console.log("\n🔗 Next Steps:");
    console.log("1. Frontend will automatically detect new contract addresses");
    console.log("2. Backend API will serve latest addresses from contracts.json");
    console.log("3. No manual configuration required!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED!");
    console.error("Error:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("1. Make sure Hardhat node is running: npx hardhat node");
    console.error("2. Check if account has sufficient ETH");
    console.error("3. Verify contracts compile: npx hardhat compile");
    process.exit(1);
  }
}

// Handle script errors
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
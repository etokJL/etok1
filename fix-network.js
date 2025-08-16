const hre = require("hardhat");

async function main() {
  console.log("🔧 FIXING NETWORK CONNECTION");
  console.log("=" * 40);
  
  try {
    // Simple network test
    const [deployer] = await hre.ethers.getSigners();
    console.log(`✅ Connected to network`);
    console.log(`   Deployer: ${deployer.address}`);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`   Balance: ${hre.ethers.formatEther(balance)} ETH`);
    
    const network = await hre.ethers.provider.getNetwork();
    console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    console.log("\n📋 CONTRACT ADDRESSES:");
    console.log(`   QuestNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3`);
    console.log(`   PlantToken: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`);
    console.log(`   MockUSDT: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`);
    console.log(`   NFTShop: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`);
    
    console.log("\n🌐 METAMASK SETUP:");
    console.log("   Network Name: Hardhat Local");
    console.log("   RPC URL: http://localhost:8545");
    console.log("   Chain ID: 31337");
    console.log("   Currency: ETH");
    
    // Test contract connection
    const QuestNFT = await hre.ethers.getContractFactory("QuestNFT");
    const questNFT = QuestNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
    // Try to call a simple view function
    const name = await questNFT.name();
    console.log(`\n✅ Contract test successful: ${name}`);
    
    console.log("\n🎯 NEXT STEPS:");
    console.log("1. Open MetaMask");
    console.log("2. Go to Settings > Networks");
    console.log("3. Delete old 'Hardhat Local' network if exists");
    console.log("4. Add new network with above settings");
    console.log("5. Import account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    console.log("6. Switch to Hardhat Local network");
    console.log("7. Refresh browser");

  } catch (error) {
    console.error("❌ Network Error:", error.message);
    
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Make sure Hardhat node is running:");
    console.log("   npx hardhat node --port 8545");
    console.log("2. Redeploy contracts:");
    console.log("   npx hardhat run scripts/deploy.js --network localhost");
    console.log("3. Reset MetaMask network connection");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
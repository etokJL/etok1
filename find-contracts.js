const { ethers } = require("hardhat");

async function findContracts() {
  console.log("🔍 FINDING DEPLOYED CONTRACTS");
  console.log("=" * 50);
  
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deployer:", deployer.address);
    
    // Check if Hardhat network is running
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId, ")");
    
    // Check block number
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("📦 Latest Block:", blockNumber);
    
    // Check deployer balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Deployer Balance:", ethers.formatEther(balance), "ETH");
    
    // Try to find contracts by checking common addresses
    console.log("\n🔍 Checking common contract addresses...");
    
    const commonAddresses = [
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0x9fE46736679d2D9a65F0992F2272dE9c3C2f4960",
      "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      "0xDc64a140Aa3E981100a9becA4E685f962fCBc3c9",
      "0x202CCe504e04bEd6fC0521238dDf04Bc9E8E15aB"
    ];
    
    for (const addr of commonAddresses) {
      const code = await ethers.provider.getCode(addr);
      if (code !== "0x") {
        console.log("✅ Contract found at:", addr, "(Code length:", code.length, ")");
        
        // Try to identify contract type
        try {
          // Try MockUSDT
          const mockUSDT = new ethers.Contract(addr, ["function name() view returns (string)", "function symbol() view returns (string)"], ethers.provider);
          const name = await mockUSDT.name();
          const symbol = await mockUSDT.symbol();
          console.log("   📋 Type: MockUSDT -", name, "(", symbol, ")");
        } catch (e) {
          try {
            // Try QuestNFT
            const questNFT = new ethers.Contract(addr, ["function name() view returns (string)", "function symbol() view returns (string)"], ethers.provider);
            const name = await questNFT.name();
            const symbol = await questNFT.symbol();
            console.log("   📋 Type: QuestNFT -", name, "(", symbol, ")");
          } catch (e2) {
            try {
              // Try PlantToken
              const plantToken = new ethers.Contract(addr, ["function name() view returns (string)", "function symbol() view returns (string)"], ethers.provider);
              const name = await plantToken.name();
              const symbol = await plantToken.symbol();
              console.log("   📋 Type: PlantToken -", name, "(", symbol, ")");
            } catch (e3) {
              console.log("   📋 Type: Unknown contract");
            }
          }
        }
      } else {
        console.log("❌ No contract at:", addr);
      }
    }
    
    // Check if we need to deploy contracts
    console.log("\n🔍 Checking if contracts need to be deployed...");
    
    const mockUSDTFactory = await ethers.getContractFactory("MockUSDT");
    console.log("📋 MockUSDT Factory available");
    
    const questNFTFactory = await ethers.getContractFactory("QuestNFT");
    console.log("📋 QuestNFT Factory available");
    
    const plantTokenFactory = await ethers.getContractFactory("PlantToken");
    console.log("📋 PlantToken Factory available");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Contract search completed!");
}

findContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking network configuration...");
  
  // Check Hardhat network
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("\n🌐 HARDHAT NETWORK:");
  console.log("Chain ID:", Number(network.chainId));
  console.log("Network name:", network.name);
  console.log("Owner address:", owner.address);
  console.log("Owner balance:", ethers.formatEther(await ethers.provider.getBalance(owner.address)), "ETH");
  
  // Check contracts on Hardhat
  const questNFTAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const code = await ethers.provider.getCode(questNFTAddress);
  console.log("Contract code exists:", code !== "0x");
  
  if (code !== "0x") {
    const QuestNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
    const totalPackages = await QuestNFT.getTotalPackages();
    console.log("Contract works! Total packages:", Number(totalPackages));
  }
  
  // Check if user wallet exists on Hardhat
  const userWallet = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  const userBalance = await ethers.provider.getBalance(userWallet);
  console.log("\n👤 USER WALLET ON HARDHAT:");
  console.log("User address:", userWallet);
  console.log("User balance:", ethers.formatEther(userBalance), "ETH");
  
  if (Number(userBalance) === 0) {
    console.log("\n❌ User wallet has 0 ETH on Hardhat!");
    console.log("🔧 Frontend might be connected to wrong network!");
    console.log("📝 MetaMask should be connected to:");
    console.log("   Network: Hardhat Local");
    console.log("   RPC URL: http://localhost:8545");
    console.log("   Chain ID: 31337");
  }
}

main().catch(console.error);
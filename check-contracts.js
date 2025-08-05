const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking contract deployment status...");
  
  const questNFTAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const plantTokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  
  // Check if contracts exist at these addresses
  const provider = ethers.provider;
  
  console.log("\n📝 Checking QuestNFT...");
  const questCode = await provider.getCode(questNFTAddress);
  console.log("Code length:", questCode.length);
  console.log("Has code:", questCode !== "0x");
  
  console.log("\n🌱 Checking PlantToken...");
  const plantCode = await provider.getCode(plantTokenAddress);
  console.log("Code length:", plantCode.length);
  console.log("Has code:", plantCode !== "0x");
  
  if (questCode === "0x" || plantCode === "0x") {
    console.log("\n❌ Contracts not deployed! Need to redeploy.");
    return;
  }
  
  // Try to call contracts
  try {
    const QuestNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
    const totalPackages = await QuestNFT.getTotalPackages();
    console.log("\n✅ QuestNFT working, total packages:", Number(totalPackages));
    
    const totalSupply = await QuestNFT.totalSupply();
    console.log("✅ QuestNFT totalSupply:", Number(totalSupply));
  } catch (error) {
    console.log("\n❌ QuestNFT error:", error.message);
  }
  
  try {
    const PlantToken = await ethers.getContractAt("PlantToken", plantTokenAddress);
    const userWallet = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
    const tokens = await PlantToken.getOwnerTokens(userWallet);
    console.log("\n✅ PlantToken working, user tokens:", tokens.map(t => Number(t)));
  } catch (error) {
    console.log("\n❌ PlantToken error:", error.message);
  }
}

main().catch(console.error);
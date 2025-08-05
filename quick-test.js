const { ethers } = require("hardhat");

async function main() {
  const userWallet = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  const questNFTAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  console.log("🔍 Quick Contract Test");
  
  const QuestNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
  
  // Test the exact calls the frontend makes
  console.log("\n📦 PACKAGES TEST:");
  const totalPackages = await QuestNFT.getTotalPackages();
  console.log("Total packages:", Number(totalPackages));
  
  console.log("\n🎮 USER NFT TEST:");
  const balance = await QuestNFT.balanceOf(userWallet);
  console.log("User balance:", Number(balance));
  
  if (Number(balance) > 0) {
    const counts = await QuestNFT.getUserNFTCounts(userWallet);
    console.log("User counts:", counts.map(c => Number(c)));
    
    // Test total supply
    const totalSupply = await QuestNFT.totalSupply();
    console.log("Total supply:", Number(totalSupply));
    
    // Check specific tokens
    for (let tokenId = 1; tokenId <= Math.min(Number(totalSupply), 10); tokenId++) {
      try {
        const owner = await QuestNFT.ownerOf(tokenId);
        const nftType = await QuestNFT.getNFTType(tokenId);
        console.log(`Token ${tokenId}: Owner=${owner}, Type=${Number(nftType)}`);
      } catch (e) {
        console.log(`Token ${tokenId}: ERROR - ${e.message}`);
      }
    }
  }
  
  console.log("\n✅ All tests complete!");
}

main().catch(console.error);
// Check what NFT types are missing for plant creation
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔍 Checking NFT requirements for:", signer.address);

  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);

  // Check current NFT counts
  console.log("\n📊 Current NFT counts:");
  const nftCounts = await questNFT.getUserNFTCounts(signer.address);
  const missingTypes = [];
  
  for (let i = 0; i < 15; i++) {
    const count = Number(nftCounts[i] || 0);
    const hasType = count > 0;
    console.log(`  NFT Type ${i + 1}: ${count} ${hasType ? '✅' : '❌ MISSING'}`);
    
    if (!hasType) {
      missingTypes.push(i + 1);
    }
  }

  console.log("\n📝 Summary:");
  console.log("  Required for plant creation: 15 different NFT types");
  console.log("  Missing types:", missingTypes.length > 0 ? missingTypes : "None");
  console.log("  Can create plant:", missingTypes.length === 0);

  // Check what the contract says
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log("  Contract canCreatePlant():", canCreate);

  if (missingTypes.length > 0) {
    console.log("\n🛒 To fix, you need to purchase these missing NFT types:");
    missingTypes.forEach(type => {
      console.log(`  - Purchase NFT Type ${type}`);
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

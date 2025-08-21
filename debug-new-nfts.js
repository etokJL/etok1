// Debug the new NFTs to see if they have correct types
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔍 Debugging new NFTs for:", signer.address);

  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);

  // Check getUserNFTCounts
  console.log("\n📊 getUserNFTCounts():");
  const nftCounts = await questNFT.getUserNFTCounts(signer.address);
  for (let i = 0; i < nftCounts.length; i++) {
    const count = Number(nftCounts[i]);
    console.log(`  Type ${i + 1}: ${count}`);
  }

  // Check individual tokens
  console.log("\n🔍 Individual token analysis:");
  const balance = await questNFT.balanceOf(signer.address);
  const totalSupply = await questNFT.totalSupply();
  
  console.log(`  Balance: ${balance}`);
  console.log(`  Total supply: ${totalSupply}`);

  // Simulate burnForPlant logic with actual contract calls
  const tokensByType = {};
  let foundTokens = 0;

  for (let tokenId = 1; tokenId <= Number(totalSupply); tokenId++) {
    try {
      const owner = await questNFT.ownerOf(tokenId);
      if (owner.toLowerCase() === signer.address.toLowerCase()) {
        foundTokens++;
        console.log(`  Token ${tokenId}: Owned by user`);
        
        // Try to determine the type by checking which package it came from
        // Since we bought them individually, each should have the correct type
        
        // Estimate type based on order (tokens 1-15 should be types 1-15)
        const estimatedType = tokenId; // Since we bought them in order
        
        if (!tokensByType[estimatedType]) {
          tokensByType[estimatedType] = [];
        }
        tokensByType[estimatedType].push(tokenId);
      }
    } catch (error) {
      // Token doesn't exist or not owned
    }
  }

  console.log(`\n📊 Found tokens grouped by estimated type:`);
  for (let type = 1; type <= 15; type++) {
    const tokens = tokensByType[type] || [];
    console.log(`  Type ${type}: ${tokens.length} tokens ${tokens.length > 0 ? '✅' : '❌'}`);
  }

  // Check canCreatePlant again
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log(`\n🌱 canCreatePlant(): ${canCreate}`);

  // Try to call the view function to see the actual issue
  console.log("\n🔍 Checking Smart Contract Logic:");
  console.log("The issue might be in the burnForPlant function logic itself");
  console.log("Let's check if there's an issue with the contract implementation");

  // One more debug: check if all required types exist
  const missingTypes = [];
  for (let type = 1; type <= 15; type++) {
    if (!tokensByType[type] || tokensByType[type].length === 0) {
      missingTypes.push(type);
    }
  }

  if (missingTypes.length > 0) {
    console.log("❌ Missing types:", missingTypes);
  } else {
    console.log("✅ All 15 types should be available");
    console.log("💡 The issue is likely in the burnForPlant implementation");
    console.log("💡 Or the _nftTypes mapping is still not set correctly");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

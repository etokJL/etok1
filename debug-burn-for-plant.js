// Debug the burnForPlant function to see what's happening
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔍 Debugging burnForPlant for:", signer.address);

  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);

  // Get user's total balance
  const balance = await questNFT.balanceOf(signer.address);
  console.log("\n📊 User balance:", Number(balance), "NFTs");

  // Get total supply and start token ID
  const totalSupply = await questNFT.totalSupply();
  console.log("📊 Total supply:", Number(totalSupply));

  // Check some individual tokens
  console.log("\n🔍 Checking individual tokens:");
  const userTokens = [];
  
  try {
    // Try to check first few tokens
    for (let tokenId = 1; tokenId <= Math.min(50, Number(totalSupply)); tokenId++) {
      try {
        const exists = await questNFT._exists ? questNFT._exists(tokenId) : true;
        if (exists) {
          const owner = await questNFT.ownerOf(tokenId);
          if (owner.toLowerCase() === signer.address.toLowerCase()) {
            // Try to get NFT type - this might fail if mapping doesn't exist
            try {
              const nftType = await questNFT._nftTypes ? questNFT._nftTypes(tokenId) : 0;
              userTokens.push({ tokenId, nftType: Number(nftType) });
              console.log(`  Token ${tokenId}: Type ${Number(nftType)}`);
            } catch (error) {
              console.log(`  Token ${tokenId}: Error getting type -`, error.message);
            }
          }
        }
      } catch (error) {
        // Token doesn't exist or other error, skip
      }
    }
  } catch (error) {
    console.log("❌ Error checking tokens:", error.message);
  }

  console.log("\n📝 User's tokens summary:");
  console.log("  Total tokens found:", userTokens.length);
  
  // Group by type
  const typeGroups = {};
  userTokens.forEach(token => {
    if (!typeGroups[token.nftType]) {
      typeGroups[token.nftType] = [];
    }
    typeGroups[token.nftType].push(token.tokenId);
  });

  console.log("\n🎯 Tokens grouped by type:");
  for (let type = 1; type <= 15; type++) {
    const tokens = typeGroups[type] || [];
    console.log(`  Type ${type}: ${tokens.length} tokens ${tokens.length > 0 ? '✅' : '❌'} ${tokens.slice(0,3).join(', ')}${tokens.length > 3 ? '...' : ''}`);
  }

  // Check what types are missing
  const missingTypes = [];
  for (let type = 1; type <= 15; type++) {
    if (!typeGroups[type] || typeGroups[type].length === 0) {
      missingTypes.push(type);
    }
  }

  console.log("\n📊 Missing types for burnForPlant:", missingTypes.length > 0 ? missingTypes : "None");
  
  if (missingTypes.length > 0) {
    console.log("❌ This explains why burnForPlant fails!");
    console.log("💡 The NFT type mapping (_nftTypes) might not be set correctly");
    console.log("💡 Or the tokens were created without proper type assignment");
  } else {
    console.log("✅ All types should be available for burnForPlant");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

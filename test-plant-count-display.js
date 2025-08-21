// Test Plant Token creation and count display
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🧪 Testing Plant Token creation and count display for:", signer.address);

  const plantToken = await ethers.getContractAt("PlantToken", contracts.PlantToken.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);

  // Check current status
  console.log("\n📊 Before Plant Creation:");
  const beforeBalance = await questNFT.balanceOf(signer.address);
  const beforeCanCreate = await questNFT.canCreatePlant(signer.address);
  
  // Check how many plant tokens user has
  try {
    const userPlantTokens = await plantToken.getOwnerTokens(signer.address);
    console.log(`  Plant Tokens owned: ${userPlantTokens.length}`);
    console.log(`  NFT Balance: ${beforeBalance}`);
    console.log(`  Can create plant: ${beforeCanCreate}`);
  } catch (error) {
    console.log(`  Plant Tokens: Error getting tokens (${error.message})`);
  }

  if (!beforeCanCreate) {
    console.log("❌ Cannot create plant - missing requirements");
    return;
  }

  // Create a plant token
  const plantName = `TestPlant_${Date.now()}`;
  console.log(`\n🌱 Creating plant: "${plantName}"`);

  try {
    const createTx = await plantToken.createPlant(plantName);
    console.log("⏳ Transaction submitted:", createTx.hash);
    
    const receipt = await createTx.wait();
    console.log("✅ Plant created successfully in block:", receipt.blockNumber);

    // Check status after creation
    console.log("\n📊 After Plant Creation:");
    const afterBalance = await questNFT.balanceOf(signer.address);
    const afterCanCreate = await questNFT.canCreatePlant(signer.address);
    
    const userPlantTokensAfter = await plantToken.getOwnerTokens(signer.address);
    console.log(`  Plant Tokens owned: ${userPlantTokensAfter.length} (was ${userPlantTokens?.length || 0})`);
    console.log(`  NFT Balance: ${afterBalance} (was ${beforeBalance})`);
    console.log(`  Can create plant: ${afterCanCreate}`);

    // List plant tokens
    if (userPlantTokensAfter.length > 0) {
      console.log("\n🌱 Plant Tokens:");
      for (const tokenId of userPlantTokensAfter) {
        console.log(`  - Plant Token #${tokenId}`);
      }
    }

    console.log("\n✅ Test completed! Frontend should now show correct plant count.");

  } catch (error) {
    console.error("\n❌ Plant creation failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

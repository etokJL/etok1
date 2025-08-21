// Test calling PlantToken.createPlant directly (bypass NFTShop)
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🧪 Testing direct PlantToken.createPlant call:", signer.address);

  const plantToken = await ethers.getContractAt("PlantToken", contracts.PlantToken.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);

  // Check if user can create plant (should be true)
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log("📊 canCreatePlant(user):", canCreate);

  if (!canCreate) {
    console.log("❌ User cannot create plant");
    return;
  }

  // Try to call createPlant directly from user (this should reveal the real issue)
  const plantName = `DirectTest_${Date.now()}`;
  console.log(`\n🌱 Calling PlantToken.createPlant directly: "${plantName}"`);

  try {
    const createTx = await plantToken.createPlant(plantName);
    console.log("⏳ Transaction submitted:", createTx.hash);
    
    const receipt = await createTx.wait();
    console.log("✅ Direct plant creation successful! Block:", receipt.blockNumber);

    // Check if NFTs were burned
    const newBalance = await questNFT.balanceOf(signer.address);
    console.log("📊 NFTs after creation:", newBalance);

  } catch (error) {
    console.log("❌ Direct plant creation failed:", error.message);
    
    if (error.message.includes("Missing NFTs for Plant creation")) {
      console.log("💡 The issue is in canCreatePlant() check");
    } else if (error.message.includes("Failed to burn NFTs")) {
      console.log("💡 The issue is in burnForPlant() execution");
    } else {
      console.log("💡 Unknown issue:", error.message);
    }
  }

  // Also test what the NFTShop sees
  console.log("\n🛒 Testing what NFTShop would see:");
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  
  // The NFTShop contract doesn't have NFTs, so canCreatePlant should be false for it
  try {
    const shopCanCreate = await questNFT.canCreatePlant(contracts.NFTShop.address);
    console.log("📊 canCreatePlant(NFTShop):", shopCanCreate);
    
    if (!shopCanCreate) {
      console.log("❗ FOUND THE BUG!");
      console.log("   NFTShop contract cannot create plants because it has no NFTs");
      console.log("   But NFTShop calls PlantToken.createPlant() on behalf of user");
      console.log("   PlantToken checks canCreatePlant(msg.sender) where msg.sender = NFTShop");
      console.log("   Solution: Pass user address to PlantToken.createPlant()");
    }
  } catch (error) {
    console.log("Error checking NFTShop:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

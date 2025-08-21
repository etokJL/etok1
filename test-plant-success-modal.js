// Test Plant Token success modal and auto-refresh
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🧪 Testing Plant Token success modal for:", signer.address);

  const plantToken = await ethers.getContractAt("PlantToken", contracts.PlantToken.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Check current status
  console.log("\n📊 Current Status:");
  const balance = await questNFT.balanceOf(signer.address);
  const canCreate = await questNFT.canCreatePlant(signer.address);
  const userPlantTokens = await plantToken.getOwnerTokens(signer.address);
  
  console.log(`  NFT Balance: ${balance}`);
  console.log(`  Can create plant: ${canCreate}`);
  console.log(`  Plant Tokens: ${userPlantTokens.length}`);

  if (!canCreate) {
    console.log("\n🛒 Need to buy more NFTs first...");
    
    // Buy new complete set of NFTs (15 types)
    const singlePrice = await nftShop.singleQuestNFTPrice();
    const totalCost = singlePrice * BigInt(15);
    
    // Check USDT balance
    const usdtBalance = await mockUSDT.balanceOf(signer.address);
    console.log(`  USDT needed: ${ethers.formatUnits(totalCost, 6)} USDT`);
    console.log(`  USDT available: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
    
    if (usdtBalance < totalCost) {
      console.log("  Getting USDT from faucet...");
      const faucetTx = await mockUSDT.faucet();
      await faucetTx.wait();
    }
    
    // Approve USDT
    console.log("  Approving USDT...");
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalCost * BigInt(2));
    await approveTx.wait();
    
    // Buy 15 different NFT types
    console.log("  Buying 15 NFT types...");
    for (let nftType = 1; nftType <= 15; nftType++) {
      try {
        const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
        await purchaseTx.wait();
        console.log(`    ✅ Bought NFT Type ${nftType}`);
      } catch (error) {
        console.log(`    ❌ Failed to buy NFT Type ${nftType}: ${error.message}`);
      }
    }
    
    // Check if we can create now
    const canCreateNow = await questNFT.canCreatePlant(signer.address);
    if (!canCreateNow) {
      console.log("❌ Still cannot create plant after purchasing");
      return;
    }
    console.log("✅ Can now create plant!");
  }

  // Create a plant token
  const plantName = `SuccessTest_${Date.now()}`;
  console.log(`\n🌱 Creating plant: "${plantName}"`);

  try {
    const createTx = await plantToken.createPlant(plantName);
    console.log("⏳ Transaction submitted:", createTx.hash);
    
    const receipt = await createTx.wait();
    console.log("✅ Plant created successfully in block:", receipt.blockNumber);

    // Check final status
    console.log("\n📊 Final Status:");
    const finalBalance = await questNFT.balanceOf(signer.address);
    const finalPlantTokens = await plantToken.getOwnerTokens(signer.address);
    
    console.log(`  NFT Balance: ${finalBalance} (NFTs burned)`);
    console.log(`  Plant Tokens: ${finalPlantTokens.length} (was ${userPlantTokens.length})`);
    
    console.log("\n🎉 SUCCESS! Frontend should now show:");
    console.log("  ✅ Success modal with plant details");
    console.log("  ✅ Updated plant count in navigation");
    console.log("  ✅ New plant token in /plants page");

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

// Test if navigation count updates correctly
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🧪 Testing navigation count update for:", signer.address);

  const plantToken = await ethers.getContractAt("PlantToken", contracts.PlantToken.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Check current status
  console.log("\n📊 Current Status:");
  const beforeBalance = await questNFT.balanceOf(signer.address);
  const beforeCanCreate = await questNFT.canCreatePlant(signer.address);
  const beforePlantTokens = await plantToken.getOwnerTokens(signer.address);
  
  console.log(`  NFT Balance: ${beforeBalance}`);
  console.log(`  Can create plant: ${beforeCanCreate}`);
  console.log(`  Plant Tokens: ${beforePlantTokens.length}`);
  console.log(`  Plant Token IDs: [${beforePlantTokens.join(', ')}]`);

  if (!beforeCanCreate) {
    console.log("\n🛒 Need to buy NFTs first...");
    
    const singlePrice = await nftShop.singleQuestNFTPrice();
    const totalCost = singlePrice * BigInt(15);
    
    // Get USDT if needed
    const usdtBalance = await mockUSDT.balanceOf(signer.address);
    if (usdtBalance < totalCost) {
      console.log("  Getting USDT from faucet...");
      const faucetTx = await mockUSDT.faucet();
      await faucetTx.wait();
    }
    
    // Approve and buy
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalCost * BigInt(2));
    await approveTx.wait();
    
    for (let nftType = 1; nftType <= 15; nftType++) {
      const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
      await purchaseTx.wait();
      console.log(`    ✅ NFT Type ${nftType}`);
    }
    
    const canCreateNow = await questNFT.canCreatePlant(signer.address);
    if (!canCreateNow) {
      console.log("❌ Still cannot create plant");
      return;
    }
  }

  // Create a plant token
  const plantName = `NavigationTest_${Date.now()}`;
  console.log(`\n🌱 Creating plant: "${plantName}"`);

  const createTx = await plantToken.createPlant(plantName);
  console.log("⏳ Transaction submitted:", createTx.hash);
  
  const receipt = await createTx.wait();
  console.log("✅ Plant created successfully in block:", receipt.blockNumber);

  // Check status immediately after
  console.log("\n📊 Immediately After Creation:");
  const afterBalance = await questNFT.balanceOf(signer.address);
  const afterPlantTokens = await plantToken.getOwnerTokens(signer.address);
  
  console.log(`  NFT Balance: ${afterBalance} (NFTs burned)`);
  console.log(`  Plant Tokens: ${afterPlantTokens.length} (was ${beforePlantTokens.length})`);
  console.log(`  Plant Token IDs: [${afterPlantTokens.join(', ')}]`);

  // Check after 3 seconds (similar to frontend refresh timing)
  console.log("\n⏰ Waiting 3 seconds (simulating frontend refresh delay)...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const delayedPlantTokens = await plantToken.getOwnerTokens(signer.address);
  console.log(`\n📊 After 3 Second Delay:`);
  console.log(`  Plant Tokens: ${delayedPlantTokens.length}`);
  console.log(`  Plant Token IDs: [${delayedPlantTokens.join(', ')}]`);

  if (delayedPlantTokens.length > beforePlantTokens.length) {
    console.log("\n🎉 Navigation count should update to:", delayedPlantTokens.length);
    console.log("  ✅ Blockchain data is consistent");
    console.log("  ⚠️  If navigation doesn't update, it's a React state issue");
  } else {
    console.log("\n❌ Plant Token count didn't increase - blockchain issue");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

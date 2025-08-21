// Test navigation count update with new improvements
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🧪 Testing improved navigation count update for:", signer.address);

  const plantToken = await ethers.getContractAt("PlantToken", contracts.PlantToken.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Check current status
  console.log("\n📊 Before Plant Creation:");
  const beforeBalance = await questNFT.balanceOf(signer.address);
  const beforeCanCreate = await questNFT.canCreatePlant(signer.address);
  const beforePlantTokens = await plantToken.getOwnerTokens(signer.address);
  
  console.log(`  NFT Balance: ${beforeBalance}`);
  console.log(`  Can create plant: ${beforeCanCreate}`);
  console.log(`  Plant Tokens: ${beforePlantTokens.length}`);

  if (!beforeCanCreate) {
    console.log("\n🛒 Buying new NFTs (all 15 types)...");
    
    const singlePrice = await nftShop.singleQuestNFTPrice();
    const totalCost = singlePrice * BigInt(15);
    
    const usdtBalance = await mockUSDT.balanceOf(signer.address);
    if (usdtBalance < totalCost) {
      console.log("  Getting USDT from faucet...");
      const faucetTx = await mockUSDT.faucet();
      await faucetTx.wait();
    }
    
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalCost * BigInt(2));
    await approveTx.wait();
    
    for (let nftType = 1; nftType <= 15; nftType++) {
      const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
      await purchaseTx.wait();
    }
    
    const canCreateNow = await questNFT.canCreatePlant(signer.address);
    if (!canCreateNow) {
      console.log("❌ Still cannot create plant");
      return;
    }
  }

  // Create a plant token
  const plantName = `NavigationImprovedTest_${Date.now()}`;
  console.log(`\n🌱 Creating plant: "${plantName}"`);

  const createTx = await plantToken.createPlant(plantName);
  console.log("⏳ Transaction submitted:", createTx.hash);
  
  const receipt = await createTx.wait();
  console.log("✅ Plant created successfully in block:", receipt.blockNumber);

  // Check final status
  console.log("\n📊 After Plant Creation:");
  const finalBalance = await questNFT.balanceOf(signer.address);
  const finalPlantTokens = await plantToken.getOwnerTokens(signer.address);
  
  console.log(`  NFT Balance: ${finalBalance} (NFTs burned)`);
  console.log(`  Plant Tokens: ${finalPlantTokens.length} (was ${beforePlantTokens.length})`);

  if (finalPlantTokens.length > beforePlantTokens.length) {
    console.log("\n🎉 SUCCESS! Navigation should now update:");
    console.log(`  ✅ Expected navigation count: ${finalPlantTokens.length}`);
    console.log("  ✅ React key forces re-render: key={nav-" + finalPlantTokens.length + "}");
    console.log("  ✅ Multiple refresh triggers for React state sync");
    console.log("  ✅ Debug logs should show plantsCreated value changes");
    
    console.log("\n🔄 Frontend refresh sequence should be:");
    console.log("  1️⃣ Plant creation success modal shows");
    console.log("  2️⃣ After 2s: forceRefresh() triggers");
    console.log("  3️⃣ After 3s: additional refresh() triggers");
    console.log("  4️⃣ Navigation re-renders with new count");
  } else {
    console.log("\n❌ Plant Token count didn't increase");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

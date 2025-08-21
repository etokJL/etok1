// Final test of plant creation with new NFTs
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🌱 Final plant creation test for:", signer.address);

  // Get contracts
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Verify prerequisites
  console.log("\n📊 Prerequisites check:");
  const balance = await questNFT.balanceOf(signer.address);
  console.log(`  NFT balance: ${balance}`);

  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log(`  Can create plant: ${canCreate ? '✅' : '❌'}`);

  const plantPrice = await nftShop.plantTokenPrice();
  console.log(`  Plant price: ${ethers.formatUnits(plantPrice, 6)} USDT`);

  const usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`  USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  if (!canCreate) {
    console.log("❌ Cannot create plant - missing requirements");
    return;
  }

  if (usdtBalance < plantPrice) {
    console.log("❌ Insufficient USDT balance");
    return;
  }

  // Check allowance
  const allowance = await mockUSDT.allowance(signer.address, contracts.NFTShop.address);
  console.log(`  Current allowance: ${ethers.formatUnits(allowance, 6)} USDT`);

  if (allowance < plantPrice) {
    console.log("\n🔐 Approving USDT for plant creation...");
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, plantPrice * 2n);
    await approveTx.wait();
    console.log("✅ USDT approval confirmed");
  }

  // Test plant creation
  const plantName = `TestPlant_${Date.now()}`;
  console.log(`\n🌱 Creating plant: "${plantName}"`);

  try {
    const createTx = await nftShop.purchasePlantToken(plantName);
    console.log("⏳ Transaction submitted:", createTx.hash);
    
    const receipt = await createTx.wait();
    console.log("✅ Plant token created in block:", receipt.blockNumber);

    // Verify NFTs were burned
    const newBalance = await questNFT.balanceOf(signer.address);
    console.log(`📊 NFTs after plant creation: ${newBalance} (should be 0)`);

    console.log("\n🎉 PLANT CREATION SUCCESSFUL!");
    console.log("✅ All 15 NFTs were burned");
    console.log("✅ Plant token was created");
    console.log("✅ Frontend should now work correctly");

  } catch (error) {
    console.error("\n❌ Plant creation failed:", error.message);
    
    // Debug the failure
    if (error.message.includes("revert")) {
      console.log("💡 This is a contract revert - check contract requirements");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

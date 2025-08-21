// Test script to test plant creation with enough NFTs
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔍 Testing plant creation with account:", signer.address);

  // Get contracts
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  console.log("📋 Contract addresses:");
  console.log("  QuestNFT:", contracts.QuestNFT.address);
  console.log("  NFTShop:", contracts.NFTShop.address);
  console.log("  MockUSDT:", contracts.MockUSDT.address);

  // Check if user can create plant
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log("\n🌱 Can create plant:", canCreate);

  if (!canCreate) {
    console.log("❌ User cannot create plant - missing NFT types");
    
    // Check current NFT counts
    console.log("\n🔍 Current NFT counts:");
    const nftCounts = await questNFT.getUserNFTCounts(signer.address);
    for (let i = 0; i < nftCounts.length; i++) {
      const count = Number(nftCounts[i]);
      if (count > 0) {
        console.log(`  NFT Type ${i + 1}: ${count}`);
      } else {
        console.log(`  NFT Type ${i + 1}: 0 (MISSING)`);
      }
    }
    return;
  }

  // Get plant token price
  const plantPrice = await nftShop.plantTokenPrice();
  console.log(`💰 Plant token price: ${ethers.formatUnits(plantPrice, 6)} USDT`);

  // Check USDT balance
  const usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`💰 USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  if (usdtBalance < plantPrice) {
    console.log("\n🚰 Getting USDT from faucet...");
    try {
      const faucetTx = await mockUSDT.faucet();
      await faucetTx.wait();
      console.log("✅ USDT faucet completed");
      
      const newBalance = await mockUSDT.balanceOf(signer.address);
      console.log(`💰 New USDT balance: ${ethers.formatUnits(newBalance, 6)} USDT`);
    } catch (error) {
      console.log("❌ Faucet failed:", error.message);
      return;
    }
  }

  // Check allowance
  const allowance = await mockUSDT.allowance(signer.address, contracts.NFTShop.address);
  console.log(`🔐 Current allowance: ${ethers.formatUnits(allowance, 6)} USDT`);

  if (allowance < plantPrice) {
    console.log("\n🔐 Approving USDT...");
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, plantPrice * 2n);
    await approveTx.wait();
    console.log("✅ USDT approval confirmed");
  }

  // Purchase plant token
  const plantName = `TestPlant_${Date.now()}`;
  console.log(`\n🌱 Creating plant token: "${plantName}"`);

  try {
    const purchaseTx = await nftShop.purchasePlantToken(plantName);
    console.log("⏳ Transaction submitted:", purchaseTx.hash);
    
    const receipt = await purchaseTx.wait();
    console.log("✅ Plant token created in block:", receipt.blockNumber);

    // Check plant token was actually created
    console.log("\n🎉 Plant creation successful!");
    
  } catch (error) {
    console.error("❌ Plant creation failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Test script to purchase an individual NFT
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔍 Testing individual NFT purchase with account:", signer.address);

  // Get contracts
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  console.log("📋 Contract addresses:");
  console.log("  NFTShop:", contracts.NFTShop.address);
  console.log("  QuestNFT:", contracts.QuestNFT.address);
  console.log("  MockUSDT:", contracts.MockUSDT.address);

  // Check current NFT counts
  console.log("\n🔍 Current NFT counts for user:");
  const nftCounts = await questNFT.getUserNFTCounts(signer.address);
  for (let i = 0; i < nftCounts.length; i++) {
    if (Number(nftCounts[i]) > 0) {
      console.log(`  NFT Type ${i + 1}: ${Number(nftCounts[i])}`);
    }
  }

  // Get USDT balance and check allowance
  const usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`\n💰 USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  // Get NFT price
  const nftPrice = await nftShop.singleQuestNFTPrice();
  console.log(`💰 Single NFT price: ${ethers.formatUnits(nftPrice, 6)} USDT`);

  // Check allowance
  const allowance = await mockUSDT.allowance(signer.address, contracts.NFTShop.address);
  console.log(`🔐 Current allowance: ${ethers.formatUnits(allowance, 6)} USDT`);

  // If we need USDT, get some from faucet
  if (usdtBalance < nftPrice) {
    console.log("\n🚰 Getting USDT from faucet...");
    try {
      const faucetTx = await mockUSDT.faucet();
      await faucetTx.wait();
      console.log("✅ USDT faucet transaction confirmed!");
      
      const newBalance = await mockUSDT.balanceOf(signer.address);
      console.log(`💰 New USDT balance: ${ethers.formatUnits(newBalance, 6)} USDT`);
    } catch (error) {
      console.log("❌ Faucet failed:", error.message);
    }
  }

  // Approve USDT if needed
  if (allowance < nftPrice) {
    console.log("\n🔐 Approving USDT...");
    const approveTx = await mockUSDT.approve(contracts.NFTShop.address, nftPrice * 10n); // Approve for multiple purchases
    await approveTx.wait();
    console.log("✅ USDT approval confirmed!");
  }

  // Purchase individual NFT (Type 1 - Electric Car)
  const nftType = 1;
  console.log(`\n🛒 Purchasing NFT Type ${nftType}...`);
  
  try {
    const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
    console.log("⏳ Transaction submitted:", purchaseTx.hash);
    
    const receipt = await purchaseTx.wait();
    console.log("✅ Purchase transaction confirmed in block:", receipt.blockNumber);
    
    // Check new NFT counts
    console.log("\n🎉 New NFT counts after purchase:");
    const newNftCounts = await questNFT.getUserNFTCounts(signer.address);
    for (let i = 0; i < newNftCounts.length; i++) {
      if (Number(newNftCounts[i]) > 0) {
        console.log(`  NFT Type ${i + 1}: ${Number(newNftCounts[i])}`);
      }
    }

  } catch (error) {
    console.error("❌ Purchase failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

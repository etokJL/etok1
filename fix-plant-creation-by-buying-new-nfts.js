// Fix plant creation by purchasing new NFTs with correct types
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔧 Fixing plant creation by purchasing correct NFTs for:", signer.address);

  // Get contracts
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Get USDT for purchases
  console.log("\n💰 Getting USDT for NFT purchases...");
  try {
    const faucetTx = await mockUSDT.faucet();
    await faucetTx.wait();
    console.log("✅ USDT faucet completed");
  } catch (error) {
    console.log("ℹ️ Faucet might already be used:", error.message);
  }

  const usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`💰 USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  // Get NFT price
  const nftPrice = await nftShop.singleQuestNFTPrice();
  console.log(`💰 Single NFT price: ${ethers.formatUnits(nftPrice, 6)} USDT`);

  // Approve USDT for purchases
  const totalNeeded = nftPrice * 15n; // 15 NFTs
  console.log(`🔐 Approving ${ethers.formatUnits(totalNeeded, 6)} USDT...`);
  const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalNeeded);
  await approveTx.wait();
  console.log("✅ USDT approved");

  // Purchase one NFT of each type (1-15)
  console.log("\n🛒 Purchasing one NFT of each type (1-15):");
  for (let nftType = 1; nftType <= 15; nftType++) {
    try {
      console.log(`  Buying NFT Type ${nftType}...`);
      const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
      await purchaseTx.wait();
      console.log(`  ✅ NFT Type ${nftType} purchased`);
    } catch (error) {
      console.log(`  ❌ Failed to buy NFT Type ${nftType}:`, error.message);
    }
  }

  // Check new NFT counts
  console.log("\n📊 New NFT counts:");
  const newCounts = await questNFT.getUserNFTCounts(signer.address);
  for (let i = 0; i < newCounts.length; i++) {
    const count = Number(newCounts[i]);
    console.log(`  Type ${i + 1}: ${count} NFTs`);
  }

  // Check if plant creation is now possible
  console.log("\n🌱 Plant creation check:");
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log(`  canCreatePlant(): ${canCreate}`);

  if (canCreate) {
    console.log("\n🎉 Plant creation should now work!");
    console.log("  Try creating a plant token in the frontend");
  } else {
    console.log("\n❌ Plant creation still not possible");
    console.log("  There might be a deeper contract issue");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

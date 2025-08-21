// Fix NFT types by purchasing new NFTs with correct types
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔧 Fixing NFT types for plant creation:", signer.address);

  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  // Get current USDT balance
  let usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`💰 Current USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  // Get NFT price
  const nftPrice = await nftShop.singleQuestNFTPrice();
  console.log(`💰 Single NFT price: ${ethers.formatUnits(nftPrice, 6)} USDT`);

  // Calculate total cost for 15 NFTs
  const totalCost = nftPrice * 15n;
  console.log(`💰 Total cost for 15 NFTs: ${ethers.formatUnits(totalCost, 6)} USDT`);

  // Get more USDT if needed
  if (usdtBalance < totalCost) {
    console.log("\n🚰 Getting more USDT from faucet...");
    const faucetTx = await mockUSDT.faucet();
    await faucetTx.wait();
    
    usdtBalance = await mockUSDT.balanceOf(signer.address);
    console.log(`💰 New USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
  }

  // Approve USDT for purchases
  console.log("\n🔐 Approving USDT for NFT purchases...");
  const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalCost);
  await approveTx.wait();
  console.log("✅ USDT approval confirmed");

  // Purchase one NFT of each type (1-15)
  console.log("\n🛒 Purchasing NFTs with correct types...");
  
  for (let nftType = 1; nftType <= 15; nftType++) {
    try {
      console.log(`  🎯 Purchasing NFT Type ${nftType}...`);
      const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
      const receipt = await purchaseTx.wait();
      console.log(`  ✅ NFT Type ${nftType} purchased (Block: ${receipt.blockNumber})`);
    } catch (error) {
      console.log(`  ❌ Failed to purchase NFT Type ${nftType}:`, error.message);
    }
  }

  // Verify the new NFTs have correct types
  console.log("\n🔍 Verifying new NFT types...");
  const newBalance = await questNFT.balanceOf(signer.address);
  console.log(`📊 New total balance: ${Number(newBalance)} NFTs`);

  // Check if user can now create plant
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log(`🌱 Can create plant: ${canCreate}`);

  if (canCreate) {
    console.log("\n✅ SUCCESS: You should now be able to create a plant token!");
    console.log("💡 Try plant creation again in the frontend");
  } else {
    console.log("\n❌ Still cannot create plant. There might be another issue.");
  }

  // Show final NFT counts
  console.log("\n📊 Final NFT counts:");
  const nftCounts = await questNFT.getUserNFTCounts(signer.address);
  for (let i = 0; i < nftCounts.length; i++) {
    const count = Number(nftCounts[i]);
    if (count > 0) {
      console.log(`  NFT Type ${i + 1}: ${count}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function main() {
  const userWallet = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  const [owner] = await ethers.getSigners();
  
  console.log("🎯 Setting up user account for Hardhat Local (31337)...");
  console.log("👤 User wallet:", userWallet);
  console.log("🔑 Owner wallet:", owner.address);
  
  // 1. Give user ETH for gas
  console.log("\n💰 Funding user wallet with ETH...");
  const fundTx = await owner.sendTransaction({
    to: userWallet,
    value: ethers.parseEther("100") // 100 ETH for testing
  });
  await fundTx.wait();
  
  const userBalance = await ethers.provider.getBalance(userWallet);
  console.log("✅ User ETH balance:", ethers.formatEther(userBalance), "ETH");
  
  // 2. Setup contracts
  const questNFTAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const QuestNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
  
  // 3. Create packages if needed
  console.log("\n📦 Ensuring packages exist...");
  let totalPackages = await QuestNFT.getTotalPackages();
  console.log("Current packages:", Number(totalPackages));
  
  if (Number(totalPackages) < 3) {
    console.log("Creating additional packages...");
    for (let i = Number(totalPackages); i < 3; i++) {
      const tx = await QuestNFT.createWeeklyPackage();
      await tx.wait();
      console.log(`📦 Package ${i} created`);
    }
    totalPackages = await QuestNFT.getTotalPackages();
  }
  
  console.log("✅ Total packages available:", Number(totalPackages));
  
  // 4. Give user NFTs
  console.log("\n🎮 Minting NFTs for user...");
  
  // Impersonate user to buy packages
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [userWallet],
  });
  
  const userSigner = await ethers.getSigner(userWallet);
  const questNFTAsUser = QuestNFT.connect(userSigner);
  
  // Check current NFTs
  let currentBalance = await QuestNFT.balanceOf(userWallet);
  console.log("Current NFT balance:", Number(currentBalance));
  
  // Buy 2 packages for variety
  for (let packageId = 0; packageId < Math.min(2, Number(totalPackages)); packageId++) {
    try {
      console.log(`🛒 Purchasing package ${packageId}...`);
      const contents = await QuestNFT.getPackageContents(packageId);
      console.log(`Package ${packageId} contains NFT types:`, contents.map(c => Number(c)));
      
      const purchaseTx = await questNFTAsUser.purchasePackage(packageId);
      await purchaseTx.wait();
      console.log(`✅ Package ${packageId} purchased!`);
    } catch (error) {
      console.log(`⚠️ Error purchasing package ${packageId}:`, error.message);
    }
  }
  
  // Stop impersonating
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [userWallet],
  });
  
  // 5. Verify results
  console.log("\n🔍 Final verification:");
  const finalBalance = await QuestNFT.balanceOf(userWallet);
  console.log("Final NFT balance:", Number(finalBalance));
  
  if (Number(finalBalance) > 0) {
    const userCounts = await QuestNFT.getUserNFTCounts(userWallet);
    console.log("NFT counts by type:", userCounts.map(c => Number(c)));
    
    // Show individual NFTs
    const totalSupply = await QuestNFT.totalSupply();
    console.log("\n🎮 User's NFTs:");
    for (let tokenId = 1; tokenId <= Number(totalSupply); tokenId++) {
      try {
        const owner = await QuestNFT.ownerOf(tokenId);
        if (owner.toLowerCase() === userWallet.toLowerCase()) {
          const nftType = await QuestNFT.getNFTType(tokenId);
          console.log(`  Token #${tokenId}: Type ${Number(nftType)}`);
        }
      } catch {
        // Token doesn't exist
      }
    }
  }
  
  console.log("\n🎯 Setup complete!");
  console.log("👆 Now connect MetaMask to:");
  console.log("   Network: Hardhat Local");
  console.log("   Chain ID: 31337");
  console.log("   RPC URL: http://localhost:8545");
  console.log("   Your wallet:", userWallet);
  console.log("   You should see your NFTs in the frontend!");
}

main().catch(console.error);
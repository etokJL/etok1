const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Load user address and NFT types from environment
  const userAddress = process.env.AIRDROP_USER_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const nftTypes = process.env.AIRDROP_NFT_TYPES ? 
    process.env.AIRDROP_NFT_TYPES.split(',').map(type => parseInt(type.trim())) : 
    [1, 2, 3, 4, 5];

  console.log("🎁 CREATING AIRDROP VIA SHOP");
  console.log("============================");
  console.log(`User Address: ${userAddress}`);
  console.log(`NFT Types: ${nftTypes.join(', ')}`);

  try {
    // Load contract addresses from contracts.json
    const contractsPath = path.join(__dirname, "../frontend/src/contracts.json");
    const contractsData = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    
    const questNFTAddress = contractsData.QuestNFT.address;
    const nftShopAddress = contractsData.NFTShop.address;
    const mockUSDTAddress = contractsData.MockUSDT.address;
    
    console.log(`QuestNFT: ${questNFTAddress}`);
    console.log(`NFTShop: ${nftShopAddress}`);
    console.log(`MockUSDT: ${mockUSDTAddress}`);

    // Get contracts
    const questNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
    const nftShop = await ethers.getContractAt("NFTShop", nftShopAddress);
    const mockUSDT = await ethers.getContractAt("MockUSDT", mockUSDTAddress);
    
    // Get signers
    const signers = await ethers.getSigners();
    const deployerSigner = signers[0]; // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    
    console.log(`Deployer Signer: ${deployerSigner.address}`);
    
    // Check initial NFT balance
    const initialBalance = await questNFT.balanceOf(userAddress);
    console.log(`Initial NFT balance: ${initialBalance.toString()}`);
    
    // Method 1: Use shop functions by impersonating the user and giving them USDT
    console.log("\n💰 Funding user with USDT for purchases...");
    
    // Impersonate user if different from deployer
    let userSigner = deployerSigner;
    if (userAddress.toLowerCase() !== deployerSigner.address.toLowerCase()) {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],
      });
      
      // Fund user account for gas
      await deployerSigner.sendTransaction({
        to: userAddress,
        value: ethers.parseEther("1.0")
      });
      
      userSigner = await ethers.getSigner(userAddress);
    }
    
    // Give user USDT (as MockUSDT owner)
    const usdtAmount = ethers.parseUnits("1000", 6); // 1000 USDT
    await mockUSDT.connect(deployerSigner).transfer(userAddress, usdtAmount);
    console.log(`✅ Transferred 1000 USDT to user`);
    
    // Approve NFTShop to spend user's USDT
    const approveAmount = ethers.parseUnits("100", 6); // 100 USDT approval
    await mockUSDT.connect(userSigner).approve(nftShopAddress, approveAmount);
    console.log(`✅ Approved NFTShop to spend 100 USDT`);
    
    // Purchase NFTs for each type requested
    console.log(`\n🛒 Purchasing ${nftTypes.length} NFTs via shop...`);
    const purchaseTxs = [];
    
    for (let i = 0; i < nftTypes.length; i++) {
      const nftType = nftTypes[i];
      console.log(`   Purchasing NFT type ${nftType}...`);
      
      try {
        const purchaseTx = await nftShop.connect(userSigner).purchaseSingleQuestNFT(nftType);
        const receipt = await purchaseTx.wait();
        purchaseTxs.push(receipt.hash);
        console.log(`   ✅ NFT type ${nftType} purchased. Tx: ${receipt.hash}`);
      } catch (error) {
        console.log(`   ❌ Failed to purchase NFT type ${nftType}: ${error.message}`);
      }
    }
    
    // Stop impersonating if we were
    if (userAddress.toLowerCase() !== deployerSigner.address.toLowerCase()) {
      await network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [userAddress],
      });
    }
    
    // Check final NFT balance
    const finalBalance = await questNFT.balanceOf(userAddress);
    const newNFTs = finalBalance - initialBalance;
    
    console.log(`\n🔍 Airdrop Results:`);
    console.log(`   Initial balance: ${initialBalance.toString()}`);
    console.log(`   Final balance: ${finalBalance.toString()}`);
    console.log(`   New NFTs: ${newNFTs.toString()}`);
    console.log(`   Transactions: ${purchaseTxs.length}`);
    
    if (newNFTs > 0) {
      console.log("\n🎉 SUCCESS: Airdrop completed!");
      console.log("SUCCESS");
      
      // Output transaction info for PHP parsing
      console.log(`Package ID: ${await questNFT.currentPackageId() - 1n}`);
      console.log(`Purchase Tx: ${purchaseTxs[purchaseTxs.length - 1] || 'multiple'}`);
    } else {
      console.log("\n❌ No NFTs were transferred");
      console.log("FAILED");
    }

  } catch (error) {
    console.error("❌ FAILED:", error.message);
    console.error("FAILED");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

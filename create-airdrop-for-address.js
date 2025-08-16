const { ethers } = require("hardhat");

async function main() {
  const targetAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const nftTypes = [1, 2, 3, 4, 5]; // Maximum 5 types per package
  
  console.log("🎁 CREATING AIRDROP FOR SPECIFIC ADDRESS");
  console.log("=" * 50);
  console.log(`Target Address: ${targetAddress}`);
  console.log(`NFT Types: [${nftTypes.join(', ')}]`);
  
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Using deployer: ${deployer.address}`);
    
    // Get contract instances with fresh addresses
    const QuestNFT = await ethers.getContractFactory("QuestNFT");
    const questNFT = QuestNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
    console.log(`📋 QuestNFT Contract: ${questNFT.target}`);
    
    // Step 1: Create custom package
    console.log(`\n🎁 Step 1: Creating custom package...`);
    const createTx = await questNFT.connect(deployer).createCustomPackage(nftTypes);
    const createReceipt = await createTx.wait();
    
    console.log(`✅ Custom package created!`);
    console.log(`   Tx Hash: ${createTx.hash}`);
    console.log(`   Gas Used: ${createReceipt.gasUsed}`);
    
    // Step 2: Purchase package for target address
    console.log(`\n💰 Step 2: Purchasing package for target address...`);
    
    // Use package ID 3 (0,1,2 were created during deployment)
    const packageId = 3;
    console.log(`   Package ID: ${packageId}`);
    
    const purchaseTx = await questNFT.connect(deployer).purchasePackageFor(targetAddress, packageId);
    const purchaseReceipt = await purchaseTx.wait();
    
    console.log(`✅ Package purchased for target address!`);
    console.log(`   Tx Hash: ${purchaseTx.hash}`);
    console.log(`   Gas Used: ${purchaseReceipt.gasUsed}`);
    
    // Step 3: Verify the airdrop
    console.log(`\n🔍 Step 3: Verifying airdrop...`);
    
    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const balance = await questNFT.balanceOf(targetAddress);
      console.log(`   NFT Balance: ${balance.toString()}`);
      
      if (balance > 0) {
        console.log(`\n📊 NFT Breakdown:`);
        
        const nftCounts = await questNFT.getUserNFTCounts(targetAddress);
        let totalFound = 0;
        
        for (let i = 0; i < nftCounts.length; i++) {
          const count = Number(nftCounts[i]);
          if (count > 0) {
            console.log(`     Type ${i + 1}: ${count} NFTs`);
            totalFound += count;
          }
        }
        
        const uniqueTypes = nftCounts.filter(count => Number(count) > 0).length;
        console.log(`\n📈 Summary:`);
        console.log(`   Total NFTs: ${totalFound}`);
        console.log(`   Unique Types: ${uniqueTypes}/15`);
        
        // Check plant creation eligibility
        const canCreatePlant = await questNFT.canCreatePlant(targetAddress);
        console.log(`   Can Create Plant: ${canCreatePlant}`);
        
        if (canCreatePlant) {
          console.log(`\n🌱 SUCCESS: User can now create plants!`);
        } else {
          console.log(`\n⚠️ User needs ${15 - uniqueTypes} more unique types to create plants`);
        }
        
        console.log(`\n🎉 AIRDROP SUCCESSFUL!`);
        console.log(`   Address: ${targetAddress}`);
        console.log(`   Total NFTs: ${totalFound}`);
        console.log(`   Ready for frontend testing!`);
        
      } else {
        console.log(`❌ No NFTs found - airdrop may have failed`);
      }
      
    } catch (verifyError) {
      console.error(`❌ Verification failed: ${verifyError.message}`);
    }
    
  } catch (error) {
    console.error(`❌ Airdrop failed: ${error.message}`);
    
    if (error.message.includes("revert")) {
      console.log(`\n💡 Possible issues:`);
      console.log(`   - Package already purchased`);
      console.log(`   - Insufficient permissions`);
      console.log(`   - Invalid package configuration`);
    }
  }
  
  console.log(`\n${"=" * 50}`);
  console.log(`🏁 Airdrop process completed!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


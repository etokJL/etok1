const { ethers } = require("hardhat");

async function main() {
  const targetAddress = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  
  console.log(`🎯 Creating NFTs for: ${targetAddress}`);
  console.log("=" * 50);

  try {
    // Get deployer (owner)
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Using deployer: ${deployer.address}`);

    // Get QuestNFT contract
    const QuestNFT = await ethers.getContractFactory("QuestNFT");
    const questNFT = QuestNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Use existing package 0 (created during deployment)
    const packageId = 0;
    
    console.log(`\n💰 Purchasing package ${packageId} for target address...`);
    
    // Use purchasePackageFor as owner
    const purchaseTx = await questNFT.connect(deployer).purchasePackageFor(targetAddress, packageId);
    const receipt = await purchaseTx.wait();
    
    console.log(`✅ Purchase successful!`);
    console.log(`   Tx Hash: ${purchaseTx.hash}`);
    console.log(`   Gas Used: ${receipt.gasUsed}`);
    
    // Verify the purchase
    console.log(`\n🔍 Verifying NFTs...`);
    
    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const balance = await questNFT.balanceOf(targetAddress);
    console.log(`   NFT Balance: ${balance.toString()}`);
    
    if (balance > 0) {
      console.log(`✅ SUCCESS: ${targetAddress} now owns ${balance} NFTs!`);
      
      // Get breakdown by type
      const nftCounts = await questNFT.getUserNFTCounts(targetAddress);
      console.log("\n📊 NFT Types Breakdown:");
      
      for (let i = 0; i < nftCounts.length; i++) {
        const count = Number(nftCounts[i]);
        if (count > 0) {
          console.log(`   Type ${i + 1}: ${count} NFTs`);
        }
      }
      
      const uniqueTypes = nftCounts.filter(count => Number(count) > 0).length;
      console.log(`\n📈 Unique Types: ${uniqueTypes}`);
      
      const canCreatePlant = await questNFT.canCreatePlant(targetAddress);
      console.log(`🌱 Can Create Plant: ${canCreatePlant}`);
      
    } else {
      console.log(`❌ No NFTs found - purchase may have failed`);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("revert")) {
      console.log("\n💡 Possible Issues:");
      console.log("   - Package may be already purchased");
      console.log("   - Insufficient permissions");
      console.log("   - Invalid package ID");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


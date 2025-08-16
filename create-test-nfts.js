const hre = require("hardhat");

async function main() {
  const targetAddress = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  
  console.log(`🎯 Creating NFTs for address: ${targetAddress}`);
  console.log("=" * 50);

  try {
    // Get contract instances with new addresses
    const QuestNFT = await hre.ethers.getContractFactory("QuestNFT");
    const questNFT = QuestNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
    // Get deployer account to act as owner
    const [deployer] = await hre.ethers.getSigners();
    console.log(`📝 Using deployer: ${deployer.address}`);

    // Create custom package with multiple NFT types (for variety)
    const nftTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 10 different types
    
    console.log(`\n🎁 Creating custom package with types: [${nftTypes.join(', ')}]`);
    
    // Step 1: Create custom package
    const createTx = await questNFT.createCustomPackage(nftTypes);
    await createTx.wait();
    
    console.log(`✅ Custom package created. Tx: ${createTx.hash}`);
    
    // Get events to find the package ID
    const receipt = await createTx.wait();
    let packageId = 3; // Try next available ID (0,1,2 were created in deploy)
    
    console.log(`📦 Trying Package ID: ${packageId}`);
    
    // Step 2: Purchase package for specific address
    console.log(`\n💰 Purchasing package for: ${targetAddress}`);
    
    try {
      // Use purchasePackageFor since we're the owner
      const purchaseTx = await questNFT.purchasePackageFor(targetAddress, packageId);
      await purchaseTx.wait();
      console.log(`✅ Package purchased. Tx: ${purchaseTx.hash}`);
    } catch (error) {
      // If that fails, try package ID 4
      packageId = 4;
      console.log(`📦 Trying Package ID: ${packageId}`);
      const purchaseTx = await questNFT.purchasePackageFor(targetAddress, packageId);
      await purchaseTx.wait();
      console.log(`✅ Package purchased. Tx: ${purchaseTx.hash}`);
    }
    
    // Step 3: Verify NFTs were minted
    console.log(`\n🔍 Verifying NFTs...`);
    const balance = await questNFT.balanceOf(targetAddress);
    console.log(`   NFT Balance: ${balance}`);
    
    if (balance > 0) {
      const nftCounts = await questNFT.getUserNFTCounts(targetAddress);
      console.log(`   NFT Types owned:`);
      
      for (let i = 0; i < nftCounts.length; i++) {
        const count = Number(nftCounts[i]);
        if (count > 0) {
          console.log(`     Type ${i + 1}: ${count} NFTs`);
        }
      }
      
      const uniqueTypes = nftCounts.filter(count => Number(count) > 0).length;
      console.log(`   Unique Types: ${uniqueTypes}`);
      
      const canCreatePlant = await questNFT.canCreatePlant(targetAddress);
      console.log(`   Can Create Plant: ${canCreatePlant}`);
    }
    
    console.log(`\n🎉 SUCCESS: NFTs created for ${targetAddress}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

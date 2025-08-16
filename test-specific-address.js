const hre = require("hardhat");

async function main() {
  const testAddress = "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  
  console.log(`🔍 Testing blockchain data for address: ${testAddress}`);
  console.log("=" * 60);

  try {
    // Get contract instances
    const QuestNFT = await hre.ethers.getContractFactory("QuestNFT");
    const questNFT = QuestNFT.attach("0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2");
    
    const PlantToken = await hre.ethers.getContractFactory("PlantToken");
    const plantToken = PlantToken.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    // 1. Check NFT Balance
    console.log("\n📊 QUEST NFT DATA:");
    const nftBalance = await questNFT.balanceOf(testAddress);
    console.log(`   Balance: ${nftBalance} NFTs`);

    if (nftBalance > 0) {
      // 2. Get NFT counts by type
      console.log("\n📈 NFT TYPES BREAKDOWN:");
      const nftCounts = await questNFT.getUserNFTCounts(testAddress);
      
      for (let i = 0; i < nftCounts.length; i++) {
        const count = Number(nftCounts[i]);
        if (count > 0) {
          console.log(`   Type ${i + 1}: ${count} NFTs`);
        }
      }

      // 3. Check if can create plant
      console.log("\n🌱 PLANT CREATION STATUS:");
      const canCreate = await questNFT.canCreatePlant(testAddress);
      console.log(`   Can create plant: ${canCreate}`);
      
      if (canCreate) {
        console.log("   ✅ User has 15 unique NFT types!");
      } else {
        const uniqueTypes = nftCounts.filter(count => Number(count) > 0).length;
        console.log(`   ❌ User has only ${uniqueTypes}/15 unique types`);
      }
    }

    // 4. Check Plant Token Balance
    console.log("\n🌿 PLANT TOKEN DATA:");
    const plantBalance = await plantToken.balanceOf(testAddress, 1); // Plant type 1
    console.log(`   Plant Tokens: ${plantBalance}`);

    // 5. Raw contract calls simulation
    console.log("\n🔗 SIMULATING FRONTEND CALLS:");
    console.log("   useBlockchainNFTData would get:");
    console.log(`   - totalBalance: ${nftBalance}`);
    console.log(`   - nfts: ${nftBalance} individual NFT objects`);
    console.log(`   - uniqueTypes: ${nftCounts.filter(count => Number(count) > 0).length}`);
    
    console.log("\n🎯 FRONTEND CONSOLE LOGS SHOULD SHOW:");
    console.log(`   📊 Total NFTs: ${nftBalance}`);
    console.log(`   🎨 Unique Types: ${nftCounts.filter(count => Number(count) > 0).length}`);
    console.log(`   🌱 Can Create Plant: ${canCreate}`);

  } catch (error) {
    console.error("❌ Error testing address:", error.message);
  }

  console.log("\n" + "=" * 60);
  console.log("🏁 Test completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

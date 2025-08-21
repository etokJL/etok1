// Reset old NFTs and buy new ones with correct types
const { ethers } = require("hardhat");
const contracts = require("./frontend/src/contracts.json");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🔄 Resetting NFTs and buying new ones for:", signer.address);

  // Get contracts
  const questNFT = await ethers.getContractAt("QuestNFT", contracts.QuestNFT.address);
  const nftShop = await ethers.getContractAt("NFTShop", contracts.NFTShop.address);
  const mockUSDT = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address);

  console.log("📋 Contract addresses:");
  console.log("  QuestNFT:", contracts.QuestNFT.address);
  console.log("  NFTShop:", contracts.NFTShop.address);
  console.log("  MockUSDT:", contracts.MockUSDT.address);

  // Step 1: Check current situation
  const balance = await questNFT.balanceOf(signer.address);
  console.log(`\n📊 Current NFT balance: ${balance}`);

  if (Number(balance) > 0) {
    console.log("🗑️ Need to burn old NFTs first...");
    
    // For simplicity, let's redeploy contracts to start fresh
    console.log("💡 Redeploying contracts for clean start...");
    
    try {
      const { spawn } = require('child_process');
      const deploy = spawn('npx', ['hardhat', 'run', 'scripts/deploy.js', '--network', 'localhost'], {
        stdio: 'inherit'
      });

      await new Promise((resolve, reject) => {
        deploy.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Deploy failed with code ${code}`));
        });
      });

      console.log("✅ Contracts redeployed!");
      console.log("🔄 Please restart this script with new contract addresses");
      return;
    } catch (error) {
      console.log("❌ Auto-redeploy failed:", error.message);
      console.log("💡 Please run: npx hardhat run scripts/deploy.js --network localhost");
      return;
    }
  }

  // Step 2: Ensure we have enough USDT
  const singleNFTPrice = await nftShop.singleQuestNFTPrice();
  const totalNeeded = singleNFTPrice * BigInt(15); // 15 different types
  
  console.log(`\n💰 NFT Purchase Plan:`);
  console.log(`  Single NFT price: ${ethers.formatUnits(singleNFTPrice, 6)} USDT`);
  console.log(`  Total needed for 15 types: ${ethers.formatUnits(totalNeeded, 6)} USDT`);

  const usdtBalance = await mockUSDT.balanceOf(signer.address);
  console.log(`  Current USDT balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);

  if (usdtBalance < totalNeeded) {
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

  // Step 3: Approve USDT for all purchases
  console.log("\n🔐 Approving USDT for purchases...");
  const approveTx = await mockUSDT.approve(contracts.NFTShop.address, totalNeeded * BigInt(2));
  await approveTx.wait();
  console.log("✅ USDT approval confirmed");

  // Step 4: Buy one NFT of each type (1-15)
  console.log("\n🛒 Purchasing 15 different NFT types...");
  
  for (let nftType = 1; nftType <= 15; nftType++) {
    try {
      console.log(`  Buying NFT Type ${nftType}...`);
      const purchaseTx = await nftShop.purchaseSingleQuestNFT(nftType);
      const receipt = await purchaseTx.wait();
      console.log(`  ✅ NFT Type ${nftType} purchased (block ${receipt.blockNumber})`);
    } catch (error) {
      console.log(`  ❌ Failed to buy NFT Type ${nftType}:`, error.message);
    }
  }

  // Step 5: Verify the new NFTs
  console.log("\n📊 Verifying new NFTs:");
  const newBalance = await questNFT.balanceOf(signer.address);
  console.log(`  Total NFTs: ${newBalance}`);

  const nftCounts = await questNFT.getUserNFTCounts(signer.address);
  console.log("  NFT counts by type:");
  for (let i = 0; i < nftCounts.length; i++) {
    const count = Number(nftCounts[i]);
    console.log(`    Type ${i + 1}: ${count} ${count > 0 ? '✅' : '❌'}`);
  }

  // Step 6: Check if plant creation is now possible
  const canCreate = await questNFT.canCreatePlant(signer.address);
  console.log(`\n🌱 Can create plant: ${canCreate ? '✅' : '❌'}`);

  if (canCreate) {
    console.log("🎉 SUCCESS! Plant creation should now work!");
    console.log("💡 You can now test plant creation in the frontend");
  } else {
    console.log("❌ Plant creation still not possible");
    console.log("💡 Check if all 15 types were purchased successfully");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

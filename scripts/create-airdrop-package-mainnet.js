const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Mainnet-spezifische Konfiguration
  const userAddress = process.env.AIRDROP_USER_ADDRESS;
  const nftTypes = process.env.AIRDROP_NFT_TYPES ? 
    process.env.AIRDROP_NFT_TYPES.split(',').map(type => parseInt(type.trim())) : 
    [1, 2, 3, 4, 5];

  if (!userAddress) {
    console.error("ERROR: AIRDROP_USER_ADDRESS environment variable required");
    process.exit(1);
  }

  console.log("🌐 CREATING MAINNET AIRDROP PACKAGE");
  console.log("===================================");
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.config.chainId}`);
  console.log(`User Address: ${userAddress}`);
  console.log(`NFT Types: ${nftTypes.join(', ')}`);

  try {
    // WICHTIG: Für Mainnet müssen Contract-Adressen angepasst werden
    const questNFTAddress = process.env.QUEST_NFT_CONTRACT_ADDRESS;
    if (!questNFTAddress) {
      throw new Error("QUEST_NFT_CONTRACT_ADDRESS environment variable required for mainnet");
    }

    const questNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
    console.log(`Contract: ${questNFT.target}`);

    // Deployer-Account für Mainnet (benötigt Private Key)
    const deployer = await ethers.getSigner();
    console.log(`Deployer: ${deployer.address}`);

    // Check balance before transaction
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Deployer balance: ${ethers.formatEther(balance)} MATIC`);

    if (balance < ethers.parseEther("0.1")) {
      throw new Error("Insufficient MATIC balance for gas fees");
    }

    // Gas Estimation für Mainnet
    console.log("⛽ Estimating gas costs...");
    const createGasEstimate = await questNFT.createWeeklyPackage.estimateGas();
    const purchaseGasEstimate = await questNFT.purchasePackage.estimateGas(0);
    
    const gasPrice = await ethers.provider.getFeeData();
    const totalGasCost = (createGasEstimate + purchaseGasEstimate) * gasPrice.gasPrice;
    
    console.log(`Estimated gas: ${createGasEstimate + purchaseGasEstimate}`);
    console.log(`Gas price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
    console.log(`Total cost: ${ethers.formatEther(totalGasCost)} MATIC`);

    // Step 1: Create package (echte Kosten!)
    console.log("Step 1: Creating weekly package...");
    const createTx = await questNFT.createWeeklyPackage({
      gasLimit: createGasEstimate * 120n / 100n, // 20% buffer
    });
    
    console.log(`Transaction sent: ${createTx.hash}`);
    console.log("⏳ Waiting for confirmation...");
    
    const createReceipt = await createTx.wait();
    console.log(`✅ Package created! Block: ${createReceipt.blockNumber}`);
    console.log(`Gas used: ${createReceipt.gasUsed}`);
    console.log(`Gas cost: ${ethers.formatEther(createReceipt.gasUsed * createReceipt.gasPrice)} MATIC`);

    // Get package ID from events
    let packageId = 0;
    for (const log of createReceipt.logs) {
      try {
        const parsed = questNFT.interface.parseLog(log);
        if (parsed.name === 'PackageCreated') {
          packageId = parsed.args.packageId;
          break;
        }
      } catch (e) {
        // Ignore unparseable logs
      }
    }

    console.log(`Package ID: ${packageId}`);

    // Step 2: Purchase for user (Mainnet erfordert echte MATIC!)
    console.log("Step 2: Purchasing package for user...");
    
    // Für Mainnet: User muss selbst kaufen oder wir brauchen eine andere Strategie
    if (userAddress.toLowerCase() === deployer.address.toLowerCase()) {
      // Direct purchase by deployer
      const purchaseTx = await questNFT.purchasePackage(packageId, {
        gasLimit: purchaseGasEstimate * 120n / 100n,
      });
      
      console.log(`Purchase transaction sent: ${purchaseTx.hash}`);
      const purchaseReceipt = await purchaseTx.wait();
      
      console.log(`✅ Package purchased! Block: ${purchaseReceipt.blockNumber}`);
      console.log(`Gas used: ${purchaseReceipt.gasUsed}`);
      console.log(`Gas cost: ${ethers.formatEther(purchaseReceipt.gasUsed * purchaseReceipt.gasPrice)} MATIC`);
      
      console.log();
      console.log("🎉 SUCCESS: Mainnet airdrop package created!");
      console.log(`Package ID: ${packageId}`);
      console.log(`Create Tx: ${createReceipt.hash}`);
      console.log(`Purchase Tx: ${purchaseReceipt.hash}`);
      console.log("SUCCESS");
      
    } else {
      // Für anderen User: Erstelle Package, aber User muss selbst kaufen
      console.log(`⚠️ Package created but user ${userAddress} must purchase it themselves`);
      console.log(`Package ID to purchase: ${packageId}`);
      console.log("PACKAGE_CREATED_USER_MUST_PURCHASE");
    }

  } catch (error) {
    console.error("❌ MAINNET AIRDROP FAILED:", error.message);
    
    // Spezifische Mainnet Error Handling
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error("💰 Insufficient MATIC for gas fees");
    } else if (error.code === 'NETWORK_ERROR') {
      console.error("🌐 Network connection error");
    } else if (error.code === 'CALL_EXCEPTION') {
      console.error("📞 Contract call failed - check contract state");
    }
    
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

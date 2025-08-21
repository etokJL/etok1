const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Hardcoded for testing - in production, pass via environment variables
  const userAddress = process.env.AIRDROP_USER_ADDRESS || "0xd72EF037375c455Ca30ab03D5C97173b0c06719E";
  const nftTypes = process.env.AIRDROP_NFT_TYPES ? 
    process.env.AIRDROP_NFT_TYPES.split(',').map(type => parseInt(type.trim())) : 
    [1, 2, 3, 4, 5]; // Default NFT types

  console.log("🎁 CREATING AIRDROP PACKAGE");
  console.log("===========================");
  console.log(`User Address: ${userAddress}`);
  console.log(`NFT Types: ${nftTypes.join(', ')}`);

  try {
    // Load contract address dynamically from frontend contracts.json
    const contractsPath = path.join(__dirname, "../frontend/src/contracts.json");
    console.log(`Loading contracts from: ${contractsPath}`);
    
    if (!fs.existsSync(contractsPath)) {
      throw new Error(`Contracts file not found at: ${contractsPath}`);
    }
    
    const contractsData = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    
    if (!contractsData.QuestNFT || !contractsData.QuestNFT.address) {
      throw new Error("QuestNFT contract address not found in contracts.json");
    }
    
    const questNFTAddress = contractsData.QuestNFT.address;
    console.log(`Using QuestNFT address from contracts.json: ${questNFTAddress}`);
    
    // Get the deployed QuestNFT contract with dynamic address
    const questNFT = await ethers.getContractAt("QuestNFT", questNFTAddress);
    
    console.log(`Contract: ${questNFT.target}`);
    console.log();

    // Create a CUSTOM package with specific NFT types (NEW FEATURE!)
    console.log("Step 1: Creating custom package with specific NFT types...");
    console.log(`Requested NFT Types: [${nftTypes.join(', ')}]`);
    const createTx = await questNFT.createCustomPackage(nftTypes);
    const createReceipt = await createTx.wait();
    console.log(`✅ Custom package created. Tx: ${createReceipt.hash}`);

    // Get the package ID from events
    const packageCreatedEvent = createReceipt.logs.find(log => {
      try {
        const parsed = questNFT.interface.parseLog(log);
        return parsed.name === 'PackageCreated';
      } catch {
        return false;
      }
    });

    let packageId;
    if (packageCreatedEvent) {
      const parsed = questNFT.interface.parseLog(packageCreatedEvent);
      packageId = parsed.args.packageId;
      console.log(`✅ Package ${packageId} contains NFT types: [${parsed.args.nftTypes.join(', ')}]`);
      console.log(`✅ Matches requested types: ${JSON.stringify(nftTypes) === JSON.stringify(parsed.args.nftTypes.map(n => Number(n)))}`);
    } else {
      // Fallback: get current package ID - 1
      try {
        packageId = (await questNFT.currentPackageId()) - 1n;
        console.log(`Using fallback package ID: ${packageId}`);
      } catch {
        packageId = 0; // Fallback
        console.log(`Using emergency fallback package ID: ${packageId}`);
      }
    }

    console.log(`Package ID: ${packageId}`);

    // Purchase the package using the fixed payer address (0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
    console.log("Step 2: Purchasing package for user...");
    
    const payerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    console.log(`Using payer address: ${payerAddress}`);
    console.log(`Target user address: ${userAddress}`);
    
    // Get the payer signer (this address pays for gas)
    const [payerSigner] = await ethers.getSigners(); // This should be 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    console.log(`Payer signer address: ${payerSigner.address}`);
    
    if (payerSigner.address.toLowerCase() !== payerAddress.toLowerCase()) {
      console.log(`⚠️ Warning: Expected payer ${payerAddress}, but got ${payerSigner.address}`);
    }

    // Check payer balance
    const payerBalance = await ethers.provider.getBalance(payerAddress);
    console.log(`Payer balance: ${ethers.formatEther(payerBalance)} ETH`);
    
    if (payerBalance < ethers.parseEther("0.01")) {
      throw new Error(`Insufficient balance for payer ${payerAddress}`);
    }

    // Purchase the package (declare receipt variable outside if/else)
    let purchaseReceipt;
    
    // If user is different from payer, we need to impersonate the user for the purchase
    // But the payer (0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266) pays for gas
    if (userAddress.toLowerCase() !== payerAddress.toLowerCase()) {
      console.log("Impersonating user for package purchase...");
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],
      });

      // Fund the user account if needed (small amount for the transaction)
      const userBalance = await ethers.provider.getBalance(userAddress);
      if (userBalance < ethers.parseEther("0.01")) {
        console.log("Funding user account for transaction...");
        await payerSigner.sendTransaction({
          to: userAddress,
          value: ethers.parseEther("0.1")
        });
      }

      // Connect as user and purchase package
      const userSigner = await ethers.getSigner(userAddress);
      const questNFTAsUser = questNFT.connect(userSigner);
      const purchaseTx = await questNFTAsUser.purchasePackage(packageId);
      purchaseReceipt = await purchaseTx.wait();
      
      console.log(`✅ Package purchased by user. Tx: ${purchaseReceipt.hash}`);
      console.log(`Gas used: ${purchaseReceipt.gasUsed}`);

      // Stop impersonating
      await network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [userAddress],
      });
    } else {
      // User is the same as payer, direct purchase
      console.log("Direct purchase by payer...");
      const purchaseTx = await questNFT.connect(payerSigner).purchasePackage(packageId);
      purchaseReceipt = await purchaseTx.wait();
      
      console.log(`✅ Package purchased directly. Tx: ${purchaseReceipt.hash}`);
      console.log(`Gas used: ${purchaseReceipt.gasUsed}`);
    }

    console.log();
    console.log("🎉 SUCCESS: Airdrop package created and purchased!");
    console.log(`Package ID: ${packageId}`);
    console.log(`Create Tx: ${createReceipt.hash}`);
    console.log(`Purchase Tx: ${purchaseReceipt.hash}`);
    
    // Output success marker for PHP parsing
    console.log("SUCCESS");

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

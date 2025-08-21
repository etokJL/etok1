// Script to fund any wallet address with currencies on local Hardhat network
// Usage with environment variables:
// TARGET_ADDRESS=0x... AMOUNT=2500 CURRENCY=ETH npx hardhat run scripts/fund-wallet.js --network localhost
// TARGET_ADDRESS=0x... AMOUNT=5000 CURRENCY=USDT npx hardhat run scripts/fund-wallet.js --network localhost
// TARGET_ADDRESS=0x... AMOUNT=2500 CURRENCY=MATIC npx hardhat run scripts/fund-wallet.js --network localhost
// Supported currencies: ETH, MATIC, USDT

const { ethers } = require("hardhat");

// Load deployed contract addresses
const contracts = require("../frontend/src/contracts.json");

async function main() {
  // Get parameters from environment variables or use defaults
  const targetAddress = process.env.TARGET_ADDRESS || "0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F";
  const amount = process.env.AMOUNT || process.env.AMOUNT_ETH || "1000";
  const currency = (process.env.CURRENCY || "ETH").toUpperCase();
  
  console.log(`📝 Usage: TARGET_ADDRESS=0x... AMOUNT=500 CURRENCY=ETH npx hardhat run scripts/fund-wallet.js --network localhost`);
  console.log(`🪙 Supported currencies: ETH, MATIC, USDT`);

  // Validate address
  if (!ethers.isAddress(targetAddress)) {
    console.log(`❌ Invalid address: ${targetAddress}`);
    process.exit(1);
  }

  // Validate currency
  const supportedCurrencies = ['ETH', 'MATIC', 'USDT'];
  if (!supportedCurrencies.includes(currency)) {
    console.log(`❌ Unsupported currency: ${currency}`);
    console.log(`✅ Supported currencies: ${supportedCurrencies.join(', ')}`);
    process.exit(1);
  }

  console.log(`🚰 Funding address ${targetAddress} with ${amount} ${currency}...`);

  try {
    // Get the first signer (which has plenty of ETH and can mint tokens)
    const [signer] = await ethers.getSigners();
    console.log(`💰 Using funder address: ${signer.address}`);

    if (currency === 'ETH' || currency === 'MATIC') {
      // MATIC is an alias for ETH on local Hardhat network
      await fundETH(signer, targetAddress, amount, currency);
    } else if (currency === 'USDT') {
      await fundUSDT(signer, targetAddress, amount);
    }

    console.log(`🎉 Successfully funded ${targetAddress} with ${amount} ${currency}!`);

  } catch (error) {
    console.error("❌ Error during funding:", error.message);
    process.exit(1);
  }
}

// Function to fund ETH/MATIC (same currency on local network)
async function fundETH(signer, targetAddress, amount, currency = 'ETH') {
  const currencyName = currency === 'MATIC' ? 'MATIC' : 'ETH';
  const currencySymbol = currency === 'MATIC' ? '🔺' : '💎';
  
  console.log(`${currencySymbol} Funding ${currencyName}...`);
  
  // Check funder balance
  const funderBalance = await ethers.provider.getBalance(signer.address);
  console.log(`💸 Funder ${currencyName} balance: ${ethers.formatEther(funderBalance)} ${currencyName}`);

  // Check if funder has enough balance
  const requiredAmount = ethers.parseEther(amount);
  if (funderBalance < requiredAmount) {
    throw new Error(`Insufficient ${currencyName}! Required: ${amount} ${currencyName}, Available: ${ethers.formatEther(funderBalance)} ${currencyName}`);
  }

  // Check target balance before
  const balanceBefore = await ethers.provider.getBalance(targetAddress);
  console.log(`📊 Target ${currencyName} balance before: ${ethers.formatEther(balanceBefore)} ${currencyName}`);

  // Send native currency
  const tx = await signer.sendTransaction({
    to: targetAddress,
    value: requiredAmount
  });

  console.log(`⏳ ${currencyName} transaction submitted: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`✅ ${currencyName} transaction confirmed in block ${receipt.blockNumber}!`);

  // Check target balance after
  const balanceAfter = await ethers.provider.getBalance(targetAddress);
  console.log(`📊 Target ${currencyName} balance after: ${ethers.formatEther(balanceAfter)} ${currencyName}`);

  const actualIncrease = balanceAfter - balanceBefore;
  console.log(`📈 ${currencyName} balance increase: ${ethers.formatEther(actualIncrease)} ${currencyName}`);
}

// Function to fund USDT
async function fundUSDT(signer, targetAddress, amount) {
  console.log(`💵 Funding USDT...`);
  
  if (!contracts.MockUSDT) {
    throw new Error("MockUSDT contract not found! Make sure contracts are deployed.");
  }

  // Get USDT contract
  const usdtContract = await ethers.getContractAt("MockUSDT", contracts.MockUSDT.address, signer);
  console.log(`📍 USDT Contract: ${contracts.MockUSDT.address}`);

  // USDT has 6 decimals
  const requiredAmount = ethers.parseUnits(amount, 6);

  // Check target balance before
  const balanceBefore = await usdtContract.balanceOf(targetAddress);
  console.log(`📊 Target USDT balance before: ${ethers.formatUnits(balanceBefore, 6)} USDT`);

  // Check if signer has enough USDT, if not use faucet to mint
  const signerBalance = await usdtContract.balanceOf(signer.address);
  console.log(`💸 Funder USDT balance: ${ethers.formatUnits(signerBalance, 6)} USDT`);

  if (signerBalance < requiredAmount) {
    console.log(`🚰 Insufficient USDT, using faucet to mint more...`);
    
    // Use faucet multiple times if needed
    const faucetAmount = ethers.parseUnits("1000", 6); // Faucet gives 1000 USDT
    const timesNeeded = Math.ceil(Number(requiredAmount - signerBalance) / 1000);
    
    for (let i = 0; i < timesNeeded; i++) {
      console.log(`🚰 Faucet call ${i + 1}/${timesNeeded}...`);
      const faucetTx = await usdtContract.faucet();
      await faucetTx.wait();
    }
    
    const newBalance = await usdtContract.balanceOf(signer.address);
    console.log(`💸 New funder USDT balance: ${ethers.formatUnits(newBalance, 6)} USDT`);
  }

  // Transfer USDT
  const tx = await usdtContract.transfer(targetAddress, requiredAmount);
  console.log(`⏳ USDT transaction submitted: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`✅ USDT transaction confirmed in block ${receipt.blockNumber}!`);

  // Check target balance after
  const balanceAfter = await usdtContract.balanceOf(targetAddress);
  console.log(`📊 Target USDT balance after: ${ethers.formatUnits(balanceAfter, 6)} USDT`);

  const actualIncrease = balanceAfter - balanceBefore;
  console.log(`📈 USDT balance increase: ${ethers.formatUnits(actualIncrease, 6)} USDT`);
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script error:", error);
    process.exit(1);
  });

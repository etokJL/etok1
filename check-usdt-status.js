const { ethers } = require("hardhat");

async function checkUSDTStatus() {
  console.log("🔍 CHECKING USDT STATUS");
  console.log("=" * 50);
  
  try {
    // USDT Contract Address
    const usdtAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    console.log("🔍 USDT Contract Address:", usdtAddress);
    
    // MockUSDT Contract laden
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = MockUSDT.attach(usdtAddress);
    
    // Contract-Details abrufen
    const name = await usdt.name();
    const symbol = await usdt.symbol();
    const decimals = await usdt.decimals();
    
    console.log("📋 Contract Details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    
    // Deployer Account
    const [deployer] = await ethers.getSigners();
    console.log("\n👤 Deployer Account:", deployer.address);
    
    // Deployer USDT-Saldo
    const deployerBalance = await usdt.balanceOf(deployer.address);
    console.log("💰 Deployer USDT Balance:", ethers.formatUnits(deployerBalance, decimals));
    
    // Total Supply
    const totalSupply = await usdt.totalSupply();
    console.log("📊 Total USDT Supply:", ethers.formatUnits(totalSupply, decimals));
    
    // Faucet-Limit überprüfen (falls verfügbar)
    try {
      const faucetLimit = await usdt.faucetLimit();
      console.log("🚰 Faucet Limit:", ethers.formatUnits(faucetLimit, decimals));
    } catch (e) {
      console.log("🚰 Faucet Limit: Function not available");
    }
    
    // Faucet-Status überprüfen
    try {
      const canUseFaucet = await usdt.canUseFaucet(deployer.address);
      console.log("✅ Can use faucet:", canUseFaucet);
    } catch (e) {
      console.log("✅ Can use faucet: Function not available");
    }
    
    // Andere Accounts testen
    console.log("\n🔍 Testing other accounts...");
    
    // Account 1
    const accounts = await ethers.getSigners();
    if (accounts.length > 1) {
      const account1 = accounts[1];
      const account1Balance = await usdt.balanceOf(account1.address);
      console.log("👤 Account 1:", account1.address);
      console.log("💰 Account 1 USDT Balance:", ethers.formatUnits(account1Balance, decimals));
      
      // Faucet für Account 1 testen
      try {
        console.log("🚰 Testing faucet for Account 1...");
        const faucetTx = await usdt.connect(account1).faucet();
        console.log("   Transaction hash:", faucetTx.hash);
        
        const receipt = await faucetTx.wait();
        console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
        
        // Neuen Saldo überprüfen
        const newBalance = await usdt.balanceOf(account1.address);
        console.log("💰 New Account 1 Balance:", ethers.formatUnits(newBalance, decimals));
        
        const difference = newBalance.sub(account1Balance);
        console.log("📈 Added:", ethers.formatUnits(difference, decimals), "USDT");
        
      } catch (faucetError) {
        console.log("❌ Faucet failed for Account 1:", faucetError.message);
      }
    }
    
    // Contract-Code überprüfen
    console.log("\n🔍 Contract Code Analysis:");
    const code = await ethers.provider.getCode(usdtAddress);
    console.log("   Code Length:", code.length, "bytes");
    
    if (code.length > 100) {
      console.log("   ✅ Contract is properly deployed");
    } else {
      console.log("   ❌ Contract may not be properly deployed");
    }
    
  } catch (error) {
    console.error("❌ Check failed:", error.message);
    console.error("Stack:", error.stack);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Status check completed!");
}

checkUSDTStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function testNewUSDTFaucet() {
  console.log("🔍 TESTING NEW USDT FAUCET");
  console.log("=" * 50);
  
  try {
    // NEUE USDT Contract Address (nach dem Re-Deploy)
    const usdtAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    console.log("🔍 NEW USDT Contract Address:", usdtAddress);
    
    // Account-Adresse
    const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    console.log("🎯 Target Account:", account);
    
    // MockUSDT Contract laden
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = MockUSDT.attach(usdtAddress);
    
    // Contract-Status überprüfen
    const code = await ethers.provider.getCode(usdtAddress);
    console.log("📋 Contract Code Length:", code.length);
    
    if (code === "0x") {
      console.log("❌ Contract not deployed at this address!");
      return;
    }
    
    // Contract-Details abrufen
    const name = await usdt.name();
    const symbol = await usdt.symbol();
    const decimals = await usdt.decimals();
    
    console.log("📋 Contract Details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    
    // Aktueller USDT-Saldo des Accounts
    console.log("\n💰 Checking current USDT balance...");
    const currentBalance = await usdt.balanceOf(account);
    console.log("   Current Balance:", ethers.formatUnits(currentBalance, decimals));
    
    // Faucet-Funktion testen
    console.log("\n🚰 Testing USDT faucet...");
    
    // Deployer Account holen
    const [deployer] = await ethers.getSigners();
    console.log("   Deployer:", deployer.address);
    
    // Faucet aufrufen
    console.log("   Calling faucet function...");
    const faucetTx = await usdt.connect(deployer).faucet();
    console.log("   Transaction hash:", faucetTx.hash);
    
    // Auf Bestätigung warten
    console.log("   Waiting for confirmation...");
    const receipt = await faucetTx.wait();
    console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
    
    // Neuen Saldo überprüfen
    console.log("\n🔍 Checking new USDT balance...");
    const newBalance = await usdt.balanceOf(account);
    console.log("   New Balance:", ethers.formatUnits(newBalance, decimals));
    
    // Differenz berechnen
    const difference = newBalance.sub(currentBalance);
    console.log("   Difference:", ethers.formatUnits(difference, decimals));
    
    if (difference.gt(0)) {
      console.log("\n✅ SUCCESS: USDT faucet worked!");
      console.log("   Added:", ethers.formatUnits(difference, decimals), "USDT");
      
      // Zusätzliche Verifikation
      console.log("\n🔍 Additional verification:");
      const totalSupply = await usdt.totalSupply();
      console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals));
      
      const deployerBalance = await usdt.balanceOf(deployer.address);
      console.log("   Deployer Balance:", ethers.formatUnits(deployerBalance, decimals));
      
      console.log("\n🎉 USDT Faucet is now working correctly!");
      
    } else {
      console.log("\n❌ FAILED: No USDT was added");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Test completed!");
}

testNewUSDTFaucet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

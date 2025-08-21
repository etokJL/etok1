const { ethers } = require("hardhat");

async function resetUSDTBalance() {
  console.log("🔄 RESETTING USDT BALANCE");
  console.log("=" * 50);
  
  try {
    // USDT Contract Address
    const usdtAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    console.log("🔍 USDT Contract Address:", usdtAddress);
    
    // MockUSDT Contract laden
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = MockUSDT.attach(usdtAddress);
    
    // Deployer Account
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer Account:", deployer.address);
    
    // Aktueller USDT-Saldo
    const currentBalance = await usdt.balanceOf(deployer.address);
    console.log("💰 Current USDT Balance:", ethers.formatUnits(currentBalance, 6));
    
    if (currentBalance > 0) {
      console.log("\n🔄 Resetting USDT balance...");
      
      // USDT an den Zero-Address senden (verbrennen)
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      console.log("🔥 Burning USDT to zero address...");
      
      const burnTx = await usdt.connect(deployer).transfer(zeroAddress, currentBalance);
      console.log("   Transaction hash:", burnTx.hash);
      
      const receipt = await burnTx.wait();
      console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
      
      // Neuen Saldo überprüfen
      const newBalance = await usdt.balanceOf(deployer.address);
      console.log("💰 New USDT Balance:", ethers.formatUnits(newBalance, 6));
      
      if (newBalance.eq(0)) {
        console.log("✅ SUCCESS: USDT balance reset to 0!");
      } else {
        console.log("❌ FAILED: Balance not reset properly");
      }
      
    } else {
      console.log("✅ USDT balance is already 0");
    }
    
    // Jetzt den Faucet testen
    console.log("\n🚰 Testing USDT faucet after reset...");
    
    try {
      const faucetTx = await usdt.connect(deployer).faucet();
      console.log("   Transaction hash:", faucetTx.hash);
      
      const receipt = await faucetTx.wait();
      console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
      
      // Neuen Saldo überprüfen
      const finalBalance = await usdt.balanceOf(deployer.address);
      console.log("💰 Final USDT Balance:", ethers.formatUnits(finalBalance, 6));
      
      if (finalBalance > 0) {
        console.log("🎉 SUCCESS: USDT faucet now works!");
        console.log("   Added:", ethers.formatUnits(finalBalance, 6), "USDT");
      } else {
        console.log("❌ FAILED: Faucet still not working");
      }
      
    } catch (faucetError) {
      console.log("❌ Faucet failed:", faucetError.message);
    }
    
  } catch (error) {
    console.error("❌ Reset failed:", error.message);
    console.error("Stack:", error.stack);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Reset completed!");
}

resetUSDTBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

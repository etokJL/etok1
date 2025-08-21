const { ethers } = require("hardhat");

async function testFaucetFinal() {
  console.log("🚰 FINAL USDT FAUCET TEST");
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
    
    // Faucet testen
    console.log("\n🚰 Testing USDT faucet...");
    
    try {
      const faucetTx = await usdt.connect(deployer).faucet();
      console.log("   Transaction hash:", faucetTx.hash);
      
      const receipt = await faucetTx.wait();
      console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
      
      // Neuen Saldo überprüfen
      const newBalance = await usdt.balanceOf(deployer.address);
      console.log("💰 New USDT Balance:", ethers.formatUnits(newBalance, 6));
      
      const difference = newBalance.sub(currentBalance);
      console.log("📈 Added:", ethers.formatUnits(difference, 6), "USDT");
      
      if (difference.gt(0)) {
        console.log("\n🎉 SUCCESS: USDT faucet is working!");
        console.log("   Deployer now has:", ethers.formatUnits(newBalance, 6), "USDT");
        
        // Zusätzliche Verifikation
        console.log("\n🔍 Additional verification:");
        const totalSupply = await usdt.totalSupply();
        console.log("   Total Supply:", ethers.formatUnits(totalSupply, 6));
        
        // Alle Account-Salden anzeigen
        const accounts = await ethers.getSigners();
        console.log("\n📊 All Account Balances:");
        for (let i = 0; i < Math.min(accounts.length, 5); i++) {
          const acc = accounts[i];
          const balance = await usdt.balanceOf(acc.address);
          console.log(`   Account ${i}: ${acc.address} - ${ethers.formatUnits(balance, 6)} USDT`);
        }
        
        console.log("\n✅ USDT Faucet is now fully functional!");
        console.log("   You can now use it in the frontend!");
        
      } else {
        console.log("\n❌ FAILED: No USDT was added");
      }
      
    } catch (faucetError) {
      console.log("❌ Faucet failed:", faucetError.message);
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Final test completed!");
}

testFaucetFinal()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function transferUSDTBalance() {
  console.log("💸 TRANSFERRING USDT BALANCE");
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
      console.log("\n💸 Transferring USDT balance...");
      
      // USDT an Account 1 senden
      const accounts = await ethers.getSigners();
      const recipient = accounts[1];
      console.log("👤 Recipient Account:", recipient.address);
      
      const transferTx = await usdt.connect(deployer).transfer(recipient.address, currentBalance);
      console.log("   Transaction hash:", transferTx.hash);
      
      const receipt = await transferTx.wait();
      console.log("   Transaction confirmed! Gas used:", receipt.gasUsed.toString());
      
      // Neuen Saldo überprüfen
      const newBalance = await usdt.balanceOf(deployer.address);
      console.log("💰 New Deployer USDT Balance:", ethers.formatUnits(newBalance, 6));
      
      const recipientBalance = await usdt.balanceOf(recipient.address);
      console.log("💰 Recipient USDT Balance:", ethers.formatUnits(recipientBalance, 6));
      
      if (newBalance.eq(0)) {
        console.log("✅ SUCCESS: USDT balance transferred!");
      } else {
        console.log("❌ FAILED: Balance not transferred properly");
      }
      
    } else {
      console.log("✅ USDT balance is already 0");
    }
    
    // Jetzt den Faucet testen
    console.log("\n🚰 Testing USDT faucet after transfer...");
    
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
    console.error("❌ Transfer failed:", error.message);
    console.error("Stack:", error.stack);
  }
  
  console.log("\n" + "=" * 50);
  console.log("🏁 Transfer completed!");
}

transferUSDTBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

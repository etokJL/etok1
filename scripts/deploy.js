const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  console.log("\nDeploying QuestNFT...");
  const QuestNFT = await ethers.getContractFactory("QuestNFT");
  const questNFT = await QuestNFT.deploy(deployer.address);
  await questNFT.waitForDeployment();
  const questNFTAddress = await questNFT.getAddress();
  console.log("QuestNFT deployed to:", questNFTAddress);

  console.log("\nDeploying PlantToken...");
  const PlantToken = await ethers.getContractFactory("PlantToken");
  const plantToken = await PlantToken.deploy(deployer.address, questNFTAddress);
  await plantToken.waitForDeployment();
  const plantTokenAddress = await plantToken.getAddress();
  console.log("PlantToken deployed to:", plantTokenAddress);

  // Create test data
  console.log("\nCreating test data...");
  for (let i = 0; i < 3; i++) {
    await questNFT.createWeeklyPackage();
    console.log(`Created weekly package #${i}`);
  }

  // Save contract addresses and ABIs for frontend
  const contractData = {
    QuestNFT: {
      address: questNFTAddress,
      abi: JSON.parse(QuestNFT.interface.formatJson())
    },
    PlantToken: {
      address: plantTokenAddress,
      abi: JSON.parse(PlantToken.interface.formatJson())
    }
  };

  const contractsPath = path.join(__dirname, '../frontend/src/contracts.json');
  fs.writeFileSync(contractsPath, JSON.stringify(contractData, null, 2));

  console.log("\nDeployment completed!");
  console.log("Contracts deployed:");
  console.log("QuestNFT:", questNFTAddress);
  console.log("PlantToken:", plantTokenAddress);
  console.log("Contract addresses and ABIs saved to frontend/src/contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
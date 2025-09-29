const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  
  // Deploy NFT Collection
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(
    "AbayNFT", // name
    "ABY", // symbol
    deployer.address // initial owner
  );
  
  await nftCollection.waitForDeployment();
  const contractAddress = await nftCollection.getAddress();
  
  console.log("NFTCollection deployed to:", contractAddress);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './frontend/src/contracts/deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to frontend/src/contracts/deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
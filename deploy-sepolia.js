const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying NFT Collection to Sepolia Testnet...\n");
  
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Details:");
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. You may need more Sepolia ETH from a faucet.");
  }
  
 
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  if (network.chainId !== 11155111n) {
    throw new Error("❌ Not connected to Sepolia testnet. Please check your network configuration.");
  }
  
  console.log("\n🔨 Deploying NFTCollection contract...");
  
  // Deploy NFT Collection
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(
    "AbayNFT", // here is Collection name
    "ABY",     // here is Symbol
    deployer.address // here is initial owner
  );
  
  console.log("⏳ Waiting for deployment confirmation...");
  await nftCollection.waitForDeployment();
  
  const contractAddress = await nftCollection.getAddress();
  
  console.log("\n✅ Deployment Successful!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: network.name,
    chainId: network.chainId.toString(),
    deployedAt: new Date().toISOString(),
    etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`
  };
  
  // Ensure frontend contracts directory exists
  const contractsDir = './frontend/src/contracts';
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    `${contractsDir}/deployment.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to frontend/src/contracts/deployment.json");
  
  // Get contract info
  console.log("\n📊 Contract Information:");
  const mintPrice = await nftCollection.mintPrice();
  const maxSupply = await nftCollection.maxSupply();
  const mintingEnabled = await nftCollection.mintingEnabled();
  
  console.log("Mint Price:", ethers.formatEther(mintPrice), "ETH");
  console.log("Max Supply:", maxSupply.toString());
  console.log("Minting Enabled:", mintingEnabled);
  
  console.log("\n🎉 Ready to mint NFTs!");
  console.log("📱 Start the frontend with: cd frontend && npm start");
  console.log("🌐 Make sure MetaMask is connected to Sepolia testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
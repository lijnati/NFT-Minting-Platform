const { ethers } = require("hardhat");
const deploymentInfo = require('./frontend/src/contracts/deployment.json');

async function main() {
  console.log("🔍 Verifying NFT Contract Deployment on Sepolia\n");
  
  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  
  console.log("📋 Deployment Information:");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("Network:", deploymentInfo.network);
  console.log("Deployed At:", deploymentInfo.deployedAt);
  console.log("Etherscan URL:", `https://sepolia.etherscan.io/address/${deploymentInfo.contractAddress}`);
  
  // Get contract instance
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const contract = NFTCollection.attach(deploymentInfo.contractAddress).connect(provider);
  
  try {
    console.log("\n📊 Contract Status:");
    
    // Get contract info
    const name = await contract.name();
    const symbol = await contract.symbol();
    const mintPrice = await contract.mintPrice();
    const maxSupply = await contract.maxSupply();
    const totalSupply = await contract.totalSupply();
    const mintingEnabled = await contract.mintingEnabled();
    
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Mint Price:", ethers.formatEther(mintPrice), "ETH");
    console.log("Total Supply:", totalSupply.toString());
    console.log("Max Supply:", maxSupply.toString());
    console.log("Minting Enabled:", mintingEnabled);
    console.log("Available to Mint:", (maxSupply - totalSupply).toString());
    
    console.log("\n✅ Contract is live and ready for minting!");
    console.log("🌐 Frontend URL: http://localhost:3000");
    console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${deploymentInfo.contractAddress}`);
    
  } catch (error) {
    console.error("❌ Error reading contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
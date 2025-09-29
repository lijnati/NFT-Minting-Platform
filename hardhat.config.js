require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Validate environment variables for Sepolia deployment
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SEPOLIA_URL && process.argv.includes('sepolia')) {
  console.error("❌ SEPOLIA_URL is not set in .env file");
  console.error("Please add: SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
  process.exit(1);
}

if (!PRIVATE_KEY && process.argv.includes('sepolia')) {
  console.error("❌ PRIVATE_KEY is not set in .env file");
  console.error("Please add your MetaMask private key to .env file");
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
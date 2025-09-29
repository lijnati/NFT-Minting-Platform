# NFT Minting Platform - AbayNFT Collection

A complete NFT minting platform built with React, Ethereum smart contracts, and IPFS storage via Pinata. This platform allows users to create, upload, and mint ERC-721 NFTs with metadata stored on IPFS.

## 🚀 Live Deployment

**Contract Address:** `0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E`  
**Network:** Sepolia Testnet  
**Etherscan:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E)  
**Collection:** AbayNFT (ABY)

## Features

- **ERC-721 Smart Contract** - Built with OpenZeppelin v5 for security and standards compliance
- **IPFS Storage** - Metadata and images stored on IPFS via Pinata
- **React Frontend** - Modern, responsive UI for minting NFTs
- **Enhanced MetaMask Integration** - Robust wallet connection with error handling
- **Real-time Stats** - Live contract information and minting progress
- **Attribute Support** - Add custom traits and properties to NFTs
- **Configurable Pricing** - Owner-controlled mint price and supply limits
- **Advanced Error Handling** - Circuit breaker recovery and network validation
- **Troubleshooting Guide** - Built-in help for connection issues

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Pinata account for IPFS storage

## Quick Start (Using Live Deployment)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd NFT-Minting-Platform

# Install main project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure MetaMask for Sepolia

1. **Add Sepolia Network to MetaMask:**
   - Network Name: Sepolia Test Network
   - RPC URL: https://sepolia.infura.io/v3/
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

2. **Get Sepolia Test ETH:**
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Chainlink Faucet](https://faucets.chain.link/)

### 3. Start the Frontend

```bash
cd frontend
npm start
```

The React app will open at `http://localhost:3000` and connect to the live contract on Sepolia.

## Development Setup (Local Deployment)

### 1. Environment Configuration

Create a `.env` file in the project root:

```env
# Deployment Configuration
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. Configure Pinata IPFS

Update `frontend/.env` with your Pinata credentials:

```env
REACT_APP_PINATA_API_KEY=your_api_key
REACT_APP_PINATA_SECRET_KEY=your_secret_key
REACT_APP_PINATA_JWT=your_jwt_token
REACT_APP_NETWORK_NAME=sepolia
REACT_APP_NETWORK_ID=11155111
```

### 3. Deploy to Sepolia

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### 4. Local Development

For local blockchain development:

```bash
# Start Hardhat local network
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

<!-- ## Smart Contract Features

### NFTCollection.sol (AbayNFT - ABY)

- **ERC-721 Compliant** - Standard NFT functionality with OpenZeppelin v5
- **URI Storage** - Metadata stored on IPFS via Pinata
- **Mint Controls** - Price (0.01 ETH), supply (10,000), and per-address limits (5)
- **Owner Functions** - Administrative controls for contract owner
- **Events** - Comprehensive event logging
- **Gas Optimized** - Removed deprecated Counters library for efficiency

**Contract Details:**
- **Address:** `0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E`
- **Network:** Sepolia Testnet
- **Mint Price:** 0.01 ETH
- **Max Supply:** 10,000 NFTs
- **Max per Address:** 5 NFTs

 **Key Functions:**
- `mint(address to, string memory uri)` - Public minting function
- `ownerMint(address to, string memory uri)` - Owner-only minting
- `setMintPrice(uint256 _mintPrice)` - Update mint price
- `toggleMinting()` - Enable/disable minting
- `withdraw()` - Withdraw contract funds
- `totalSupply()` - Get current supply

## Frontend Components

### WalletConnection
- Enhanced MetaMask connection interface
- Automatic network detection and switching to Sepolia
- Circuit breaker error recovery
- Built-in troubleshooting guide

### ContractInfo
- Real-time contract statistics
- Minting progress and availability
- Network status display
- Refresh functionality

### MintingInterface
- NFT creation form with validation
- Drag-and-drop image upload
- Custom attribute management
- IPFS upload progress tracking
- Transaction handling with error recovery

### TroubleshootingGuide
- Step-by-step connection troubleshooting
- MetaMask reset instructions
- Network configuration help
- Common issue solutions

## IPFS Integration

The platform uses Pinata for IPFS storage:

1. **Image Upload** - Images are uploaded to IPFS first
2. **Metadata Creation** - JSON metadata is created with IPFS image URL
3. **Metadata Upload** - Metadata is uploaded to IPFS
4. **NFT Minting** - Token is minted with IPFS metadata URL

### Metadata Format

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://gateway.pinata.cloud/ipfs/QmHash",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    }
  ]
}
``` -->
<!-- 
## Deployment Information

### Current Live Deployment

The NFT collection is already deployed and live on Sepolia testnet:

- **Contract:** AbayNFT (ABY)
- **Address:** `0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E`
- **Deployer:** `0xdB3E14879897939cCFD0B22Da16f178463aE6020`
- **Deployed:** 2025-09-29T06:55:59.364Z
- **Etherscan:** [View Contract](https://sepolia.etherscan.io/address/0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E)

### Deploy Your Own Contract

1. **Set up environment variables** in `.env`:
```bash
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. **Get Sepolia ETH** from faucets:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Chainlink Faucet](https://faucets.chain.link/)

3. **Deploy to Sepolia:**
```bash
npm run deploy:sepolia
```

4. **Verify contract (optional):**
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS "AbayNFT" "ABY" "DEPLOYER_ADDRESS"
```

## Security Considerations

- ✅ **OpenZeppelin v5** - Latest security-audited contracts
- ✅ **Owner-only functions** - Administrative controls restricted to deployer
- ✅ **Reentrancy protection** - Built into OpenZeppelin contracts
- ✅ **Input validation** - Comprehensive error handling and validation
- ✅ **Event logging** - Full transparency with event emissions
- ✅ **Gas optimization** - Removed deprecated libraries for efficiency
- ✅ **Network validation** - Automatic network switching and validation
- ✅ **Error recovery** - Robust error handling for MetaMask issues

### Contract Security Features

- **Mint limits** - Maximum 5 NFTs per address
- **Supply cap** - Hard limit of 10,000 total NFTs
- **Owner controls** - Price adjustment and minting toggle
- **Withdrawal protection** - Only owner can withdraw funds
- **URI immutability** - Token URIs stored on IPFS for permanence -->






<!-- # Verify deployed contract
npx hardhat verify --network sepolia CONTRACT_ADDRESS "AbayNFT" "ABY" "DEPLOYER_ADDRESS" 
```


## Project Structure

```
NFT-Minting-Platform/
├── contracts/
│   └── NFTCollection.sol           # Main ERC-721 contract
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnection.js # Enhanced wallet connection
│   │   │   ├── ContractInfo.js     # Contract statistics
│   │   │   ├── MintingInterface.js # NFT creation form
│   │   │   └── TroubleshootingGuide.js # Help component
│   │   ├── services/
│   │   │   ├── web3.js            # Enhanced Web3 integration
│   │   │   └── ipfs.js            # Pinata IPFS service
│   │   └── contracts/
│   │       ├── NFTCollection.json  # Contract ABI
│   │       └── deployment.json     # Deployment info
├── scripts/
│   ├── deploy.js                   # Basic deployment script
│   └── deploy-sepolia.js          # Enhanced Sepolia deployment
├── test/
│   └── NFTCollection.test.js      # Contract tests
├── .env                           # Environment variables
├── hardhat.config.js              # Hardhat configuration
└── README.md
``` -->



🚀 **Live on Sepolia:** [0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E](https://sepolia.etherscan.io/address/0x71C7b5ba984A5f1011c1196a56a8130A8DB40e5E)
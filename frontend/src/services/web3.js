import { ethers } from 'ethers';
import NFTCollectionABI from '../contracts/NFTCollection.json';
import deploymentInfo from '../contracts/deployment.json';

let provider;
let signer;
let contract;

// Helper function to wait and retry
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectWallet = async (retryCount = 0) => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      // Clear any existing provider state
      provider = null;
      signer = null;
      contract = null;
      
      // Add delay for circuit breaker recovery
      if (retryCount > 0) {
        console.log(`Retrying connection (attempt ${retryCount + 1})...`);
        await delay(2000 * retryCount); // Exponential backoff
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }
      
      // Create provider with retry logic
      provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get network with timeout
      const networkPromise = provider.getNetwork();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network request timeout')), 10000)
      );
      
      const network = await Promise.race([networkPromise, timeoutPromise]);
      const expectedChainId = process.env.REACT_APP_NETWORK_ID || '11155111'; // Sepolia
      
      console.log('Current network:', network.chainId.toString(), 'Expected:', expectedChainId);
      
      if (network.chainId.toString() !== expectedChainId) {
        console.log('Switching to Sepolia network...');
        
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(expectedChainId).toString(16)}` }],
          });
          
          // Wait for network switch to complete
          await delay(1000);
          
        } catch (switchError) {
          console.log('Switch error:', switchError.code);
          
          if (switchError.code === 4902) {
            // Network not added, add Sepolia
            console.log('Adding Sepolia network...');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${parseInt(expectedChainId).toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
            
            await delay(1000);
          } else if (switchError.code === 4001) {
            throw new Error('Please switch to Sepolia network in MetaMask to continue.');
          } else {
            throw switchError;
          }
        }
        
        // Refresh provider after network operations
        provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      // Get signer with timeout
      const signerPromise = provider.getSigner();
      const signerTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signer request timeout')), 10000)
      );
      
      signer = await Promise.race([signerPromise, signerTimeoutPromise]);
      
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      
      // Initialize contract
      contract = new ethers.Contract(
        deploymentInfo.contractAddress,
        NFTCollectionABI.abi,
        signer
      );
      
      // Test contract connection
      try {
        await contract.name();
      } catch (contractError) {
        console.warn('Contract connection test failed:', contractError.message);
      }
      
      return {
        success: true,
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        chainId: network.chainId.toString()
      };
      
    } else {
      return {
        success: false,
        error: 'MetaMask not found. Please install MetaMask extension.'
      };
    }
  } catch (error) {
    console.error('Connection error:', error);
    
    // Handle specific MetaMask errors
    if (error.message.includes('circuit breaker') || error.code === -32603) {
      if (retryCount < 3) {
        console.log('Circuit breaker detected, retrying...');
        return connectWallet(retryCount + 1);
      } else {
        return {
          success: false,
          error: 'MetaMask is temporarily unavailable. Please try refreshing the page or restarting MetaMask.'
        };
      }
    }
    
    if (error.code === 4001) {
      return {
        success: false,
        error: 'Connection rejected. Please approve the connection in MetaMask.'
      };
    }
    
    if (error.message.includes('timeout')) {
      return {
        success: false,
        error: 'Connection timeout. Please check your internet connection and try again.'
      };
    }
    
    return {
      success: false,
      error: `Connection failed: ${error.message}`
    };
  }
};

export const getContractInfo = async () => {
  try {
    if (!contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }
    
    const mintPrice = await contract.mintPrice();
    const totalSupply = await contract.totalSupply();
    const maxSupply = await contract.maxSupply();
    const mintingEnabled = await contract.mintingEnabled();
    
    return {
      success: true,
      mintPrice: ethers.formatEther(mintPrice),
      totalSupply: totalSupply.toString(),
      maxSupply: maxSupply.toString(),
      mintingEnabled
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const mintNFT = async (tokenURI, mintPrice) => {
  try {
    if (!contract || !signer) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }
    
    const address = await signer.getAddress();
    const tx = await contract.mint(address, tokenURI, {
      value: ethers.parseEther(mintPrice)
    });
    
    const receipt = await tx.wait();
    
    // Find the NFTMinted event
    const mintEvent = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'NFTMinted';
      } catch {
        return false;
      }
    });
    
    let tokenId = null;
    if (mintEvent) {
      const parsed = contract.interface.parseLog(mintEvent);
      tokenId = parsed.args.tokenId.toString();
    }
    
    return {
      success: true,
      transactionHash: tx.hash,
      tokenId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getUserMintedCount = async (address) => {
  try {
    if (!contract) {
      throw new Error('Contract not initialized.');
    }
    
    const count = await contract.mintedCount(address);
    return {
      success: true,
      count: count.toString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to check network status
export const checkNetworkStatus = async () => {
  try {
    if (!window.ethereum) {
      return { success: false, error: 'MetaMask not found' };
    }
    
    const tempProvider = new ethers.BrowserProvider(window.ethereum);
    const network = await tempProvider.getNetwork();
    const expectedChainId = process.env.REACT_APP_NETWORK_ID || '11155111';
    
    return {
      success: true,
      currentChainId: network.chainId.toString(),
      expectedChainId,
      isCorrectNetwork: network.chainId.toString() === expectedChainId,
      networkName: network.name
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to reset connection
export const resetConnection = () => {
  provider = null;
  signer = null;
  contract = null;
};
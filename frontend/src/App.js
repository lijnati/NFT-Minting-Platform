import React, { useState, useEffect } from 'react';
import './App.css';
import WalletConnection from './components/WalletConnection';
import MintingInterface from './components/MintingInterface';
import ContractInfo from './components/ContractInfo';
import { connectWallet, getContractInfo, checkNetworkStatus, resetConnection } from './services/web3';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkInfo, setNetworkInfo] = useState(null);

  const handleWalletConnect = async (isRetry = false) => {
    setLoading(true);
    setError('');
    
    if (isRetry) {
      resetConnection();
    }
    
    const result = await connectWallet();
    
    if (result.success) {
      setWalletConnected(true);
      setWalletAddress(result.address);
      setWalletBalance(result.balance);
      setNetworkInfo({
        name: result.network,
        chainId: result.chainId
      });
      
      // Load contract info
      const contractResult = await getContractInfo();
      if (contractResult.success) {
        setContractInfo(contractResult);
      } else {
        setError(`Contract connection failed: ${contractResult.error}`);
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRetry = () => {
    handleWalletConnect(true);
  };

  const refreshContractInfo = async () => {
    if (walletConnected) {
      const contractResult = await getContractInfo();
      if (contractResult.success) {
        setContractInfo(contractResult);
      }
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          handleWalletConnect();
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Abay NFT Minting Platform</h1>
        <p>Create and mint your unique NFTs on the blockchain</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button className="button" onClick={handleRetry}>
              Try Again
            </button>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <p><strong>Troubleshooting Tips:</strong></p>
              <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                <li>Make sure MetaMask is unlocked</li>
                <li>Try refreshing the page</li>
                <li>Reset MetaMask account (Settings → Advanced → Reset Account)</li>
                <li>Switch to Sepolia testnet manually in MetaMask</li>
                <li>Disable other wallet extensions temporarily</li>
              </ul>
            </div>
          </div>
        )}
        
        {!walletConnected && !error ? (
          <WalletConnection 
            onConnect={handleWalletConnect}
            loading={loading}
          />
        ) : walletConnected ? (
          <div className="connected-interface">
            <div className="wallet-info">
              <h3>Wallet Connected</h3>
              <p><strong>Address:</strong> {walletAddress}</p>
              <p><strong>Balance:</strong> {parseFloat(walletBalance).toFixed(4)} ETH</p>
              {networkInfo && (
                <p><strong>Network:</strong> {networkInfo.name} (Chain ID: {networkInfo.chainId})</p>
              )}
            </div>

            {contractInfo && (
              <ContractInfo 
                contractInfo={contractInfo}
                onRefresh={refreshContractInfo}
              />
            )}

            <MintingInterface 
              walletAddress={walletAddress}
              contractInfo={contractInfo}
              onMintSuccess={refreshContractInfo}
            />
          </div>
        ) : null}
      </main>

      <footer className="App-footer">
        <p>Built with React, Ethereum, and IPFS</p>
      </footer>
    </div>
  );
}

export default App;
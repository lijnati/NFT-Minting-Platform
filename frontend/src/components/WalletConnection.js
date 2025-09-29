import React from 'react';
import TroubleshootingGuide from './TroubleshootingGuide';

const WalletConnection = ({ onConnect, loading, showTroubleshooting = false }) => {
  return (
    <>
      <div className="card">
        <h2>Connect Your Wallet</h2>
        <p>Connect your MetaMask wallet to start minting NFTs on Sepolia testnet</p>
        
        <div style={{ margin: '2rem 0' }}>
          <button 
            className="button" 
            onClick={onConnect}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Connecting...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </button>
        </div>
        
        <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
          <p><strong>Network:</strong> Sepolia Testnet (Chain ID: 11155111)</p>
          <p>Make sure you have MetaMask installed and Sepolia testnet ETH.</p>
          <p>Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b6b' }}>Download here</a></p>
          <p>Need testnet ETH? <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b6b' }}>Get from faucet</a></p>
        </div>
      </div>
      
      {showTroubleshooting && (
        <TroubleshootingGuide onRetry={onConnect} />
      )}
    </>
  );
};

export default WalletConnection;
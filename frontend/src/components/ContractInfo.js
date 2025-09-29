import React from 'react';

const ContractInfo = ({ contractInfo, onRefresh }) => {
  if (!contractInfo) return null;

  const { mintPrice, totalSupply, maxSupply, mintingEnabled } = contractInfo;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Collection Info</h3>
        <button className="button secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{mintPrice} ETH</div>
          <div className="stat-label">Mint Price</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{totalSupply} / {maxSupply}</div>
          <div className="stat-label">Minted / Total Supply</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value" style={{ color: mintingEnabled ? '#2ecc71' : '#e74c3c' }}>
            {mintingEnabled ? 'Active' : 'Paused'}
          </div>
          <div className="stat-label">Minting Status</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {((parseInt(totalSupply) / parseInt(maxSupply)) * 100).toFixed(1)}%
          </div>
          <div className="stat-label">Progress</div>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
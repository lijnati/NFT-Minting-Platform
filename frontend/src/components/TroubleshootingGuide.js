import React, { useState } from 'react';

const TroubleshootingGuide = ({ onRetry }) => {
    const [showGuide, setShowGuide] = useState(false);

    const troubleshootingSteps = [
        {
            title: "Reset MetaMask Account",
            description: "Clear transaction history and cache",
            steps: [
                "Open MetaMask extension",
                "Go to Settings → Advanced",
                "Click 'Reset Account'",
                "Confirm the reset"
            ]
        },
        {
            title: "Switch to Sepolia Network",
            description: "Manually switch to the correct network",
            steps: [
                "Open MetaMask",
                "Click the network dropdown (top center)",
                "Select 'Sepolia test network'",
                "If not available, add it manually with Chain ID: 11155111"
            ]
        },
        {
            title: "Check Browser Extensions",
            description: "Disable conflicting wallet extensions",
            steps: [
                "Go to browser extensions page",
                "Temporarily disable other wallet extensions",
                "Keep only MetaMask enabled",
                "Refresh the page"
            ]
        },
        {
            title: "Clear Browser Cache",
            description: "Clear cached data that might cause conflicts",
            steps: [
                "Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)",
                "Select 'Cached images and files'",
                "Click 'Clear data'",
                "Refresh the page"
            ]
        }
    ];

    return (
        <div className="card">
            <h3>🔧 Connection Troubleshooting</h3>

            <div style={{ margin: '1rem 0' }}>
                <button className="button" onClick={onRetry}>
                    🔄 Try Connecting Again
                </button>

                <button
                    className="button secondary"
                    onClick={() => setShowGuide(!showGuide)}
                    style={{ marginLeft: '1rem' }}
                >
                    {showGuide ? 'Hide' : 'Show'} Troubleshooting Guide
                </button>
            </div>

            {showGuide && (
                <div style={{ textAlign: 'left', marginTop: '2rem' }}>
                    <h4>Common Solutions:</h4>

                    {troubleshootingSteps.map((step, index) => (
                        <div key={index} className="troubleshooting-step">
                            <h5 style={{ color: '#ff6b6b', margin: '0 0 0.5rem 0' }}>
                                {index + 1}. {step.title}
                            </h5>
                            <p style={{ margin: '0 0 1rem 0', opacity: '0.8' }}>
                                {step.description}
                            </p>
                            <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
                                {step.steps.map((stepItem, stepIndex) => (
                                    <li key={stepIndex} style={{ margin: '0.25rem 0' }}>
                                        {stepItem}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}

                    <div className="troubleshooting-help">
                        <h5 style={{ color: '#ff6b6b', margin: '0 0 0.5rem 0' }}>
                            Still Having Issues?
                        </h5>
                        <p style={{ margin: '0' }}>
                            Make sure you have Sepolia testnet ETH in your wallet.
                            Get free testnet ETH from: <br />
                            • <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b6b' }}>
                                Sepolia Faucet
                            </a><br />
                            • <a href="https://faucets.chain.link/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b6b' }}>
                                Chainlink Faucet
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TroubleshootingGuide;
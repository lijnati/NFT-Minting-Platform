import React, { useState } from 'react';
import { uploadImageToPinata, uploadMetadataToPinata, createNFTMetadata } from '../services/ipfs';
import { mintNFT } from '../services/web3';

const MintingInterface = ({ walletAddress, contractInfo, onMintSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        attributes: []
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [dragOver, setDragOver] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setMessage({ type: 'error', text: 'Please select a valid image file.' });
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const addAttribute = () => {
        setFormData(prev => ({
            ...prev,
            attributes: [...prev.attributes, { trait_type: '', value: '' }]
        }));
    };

    const updateAttribute = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            )
        }));
    };

    const removeAttribute = (index) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }));
    };

    const handleMint = async () => {
        if (!formData.name || !formData.description || !formData.image) {
            setMessage({ type: 'error', text: 'Please fill in all required fields and select an image.' });
            return;
        }

        if (!contractInfo?.mintingEnabled) {
            setMessage({ type: 'error', text: 'Minting is currently disabled.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Step 1: Upload image to IPFS
            setMessage({ type: 'info', text: 'Uploading image to IPFS...' });
            const imageResult = await uploadImageToPinata(formData.image);

            if (!imageResult.success) {
                throw new Error(`Image upload failed: ${imageResult.error}`);
            }

            // Step 2: Create and upload metadata to IPFS
            setMessage({ type: 'info', text: 'Creating metadata and uploading to IPFS...' });
            const metadata = createNFTMetadata(
                formData.name,
                formData.description,
                imageResult.url,
                formData.attributes.filter(attr => attr.trait_type && attr.value)
            );

            const metadataResult = await uploadMetadataToPinata(metadata);

            if (!metadataResult.success) {
                throw new Error(`Metadata upload failed: ${metadataResult.error}`);
            }

            // Step 3: Mint NFT
            setMessage({ type: 'info', text: 'Minting NFT on blockchain...' });
            const mintResult = await mintNFT(metadataResult.url, contractInfo.mintPrice);

            if (!mintResult.success) {
                throw new Error(`Minting failed: ${mintResult.error}`);
            }

            // Success!
            setMessage({
                type: 'success',
                text: `NFT minted successfully! Token ID: ${mintResult.tokenId}. Transaction: ${mintResult.transactionHash}`
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                image: null,
                attributes: []
            });
            setImagePreview(null);

            // Refresh contract info
            if (onMintSuccess) {
                onMintSuccess();
            }

        } catch (error) {
            console.error('Minting error:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>Mint Your NFT</h3>

            {message.text && (
                <div className={`${message.type}-message`}>
                    {message.text}
                </div>
            )}

            <div className="form-group">
                <label>NFT Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter NFT name"
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your NFT"
                    rows="4"
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label>Image *</label>
                <div
                    className={`file-upload ${dragOver ? 'dragover' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    {imagePreview ? (
                        <div>
                            <img src={imagePreview} alt="Preview" className="preview-image" />
                            <p>Click or drag to change image</p>
                        </div>
                    ) : (
                        <div>
                            <p>📁 Click or drag image here</p>
                            <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>
                                Supports JPG, PNG, GIF (Max 10MB)
                            </p>
                        </div>
                    )}
                </div>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Attributes (Optional)</label>
                    <button
                        type="button"
                        className="button secondary"
                        onClick={addAttribute}
                        disabled={loading}
                    >
                        Add Attribute
                    </button>
                </div>

                {formData.attributes.map((attr, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
                        <input
                            type="text"
                            placeholder="Trait type (e.g., Color)"
                            value={attr.trait_type}
                            onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="text"
                            placeholder="Value (e.g., Blue)"
                            value={attr.value}
                            onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            style={{ background: '#e74c3c', padding: '8px 12px', border: 'none', borderRadius: '4px', color: 'white' }}
                            disabled={loading}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {contractInfo && (
                <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    <p><strong>Mint Price:</strong> {contractInfo.mintPrice} ETH</p>
                    <p><strong>Available:</strong> {parseInt(contractInfo.maxSupply) - parseInt(contractInfo.totalSupply)} / {contractInfo.maxSupply}</p>
                </div>
            )}

            <button
                className="button"
                onClick={handleMint}
                disabled={loading || !contractInfo?.mintingEnabled}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            >
                {loading ? (
                    <>
                        <span className="loading"></span>
                        Processing...
                    </>
                ) : (
                    `Mint NFT (${contractInfo?.mintPrice || '0'} ETH)`
                )}
            </button>
        </div>
    );
};

export default MintingInterface;
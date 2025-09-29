import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

const pinataAxios = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY,
    'Authorization': `Bearer ${PINATA_JWT}`
  }
});

export const uploadImageToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'nft-image'
      }
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
    
    const response = await pinataAxios.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading image to Pinata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const uploadMetadataToPinata = async (metadata) => {
  try {
    const response = await pinataAxios.post('/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const createNFTMetadata = (name, description, imageUrl, attributes = []) => {
  return {
    name,
    description,
    image: imageUrl,
    attributes,
    external_url: "",
    background_color: ""
  };
};
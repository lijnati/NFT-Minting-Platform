// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    uint256 public mintPrice = 0.01 ether;
    uint256 public maxSupply = 10000;
    bool public mintingEnabled = true;

    mapping(address => uint256) public mintedCount;
    uint256 public maxMintsPerAddress = 5;

    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    event MintPriceUpdated(uint256 newPrice);
    event MintingToggled(bool enabled);

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {}

    function mint(address to, string memory uri) public payable {
        require(mintingEnabled, "Minting is currently disabled");
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(
            mintedCount[to] < maxMintsPerAddress,
            "Max mints per address reached"
        );

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        mintedCount[to]++;

        emit NFTMinted(to, tokenId, uri);
    }

    function ownerMint(address to, string memory uri) public onlyOwner {
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId, uri);
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
        emit MintPriceUpdated(_mintPrice);
    }

    function setMaxMintsPerAddress(uint256 _maxMints) public onlyOwner {
        maxMintsPerAddress = _maxMints;
    }

    function toggleMinting() public onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

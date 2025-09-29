const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTCollection", function () {
  let nftCollection;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    nftCollection = await NFTCollection.deploy(
      "Test NFT Collection",
      "TNC",
      owner.address
    );
    await nftCollection.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftCollection.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await nftCollection.name()).to.equal("Test NFT Collection");
      expect(await nftCollection.symbol()).to.equal("TNC");
    });

    it("Should have correct initial values", async function () {
      expect(await nftCollection.mintPrice()).to.equal(ethers.parseEther("0.01"));
      expect(await nftCollection.maxSupply()).to.equal(10000);
      expect(await nftCollection.mintingEnabled()).to.equal(true);
      expect(await nftCollection.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT with correct payment", async function () {
      const mintPrice = await nftCollection.mintPrice();
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTest";

      await expect(
        nftCollection.connect(addr1).mint(addr1.address, tokenURI, {
          value: mintPrice
        })
      ).to.emit(nftCollection, "NFTMinted")
        .withArgs(addr1.address, 0, tokenURI);

      expect(await nftCollection.totalSupply()).to.equal(1);
      expect(await nftCollection.tokenURI(0)).to.equal(tokenURI);
      expect(await nftCollection.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should fail with insufficient payment", async function () {
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTest";

      await expect(
        nftCollection.connect(addr1).mint(addr1.address, tokenURI, {
          value: ethers.parseEther("0.005")
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail when minting is disabled", async function () {
      await nftCollection.toggleMinting();
      const mintPrice = await nftCollection.mintPrice();
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTest";

      await expect(
        nftCollection.connect(addr1).mint(addr1.address, tokenURI, {
          value: mintPrice
        })
      ).to.be.revertedWith("Minting is currently disabled");
    });
  });

  describe("Owner functions", function () {
    it("Should allow owner to mint without payment", async function () {
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTest";

      await expect(
        nftCollection.ownerMint(addr1.address, tokenURI)
      ).to.emit(nftCollection, "NFTMinted")
        .withArgs(addr1.address, 0, tokenURI);

      expect(await nftCollection.totalSupply()).to.equal(1);
    });

    it("Should allow owner to update mint price", async function () {
      const newPrice = ethers.parseEther("0.02");

      await expect(
        nftCollection.setMintPrice(newPrice)
      ).to.emit(nftCollection, "MintPriceUpdated")
        .withArgs(newPrice);

      expect(await nftCollection.mintPrice()).to.equal(newPrice);
    });

    it("Should allow owner to withdraw funds", async function () {
      const mintPrice = await nftCollection.mintPrice();
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTest";

      // Mint an NFT to add funds to contract
      await nftCollection.connect(addr1).mint(addr1.address, tokenURI, {
        value: mintPrice
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await nftCollection.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.equal(initialBalance + mintPrice - gasUsed);
    });

    it("Should not allow non-owner to call owner functions", async function () {
      await expect(
        nftCollection.connect(addr1).setMintPrice(ethers.parseEther("0.02"))
      ).to.be.revertedWithCustomError(nftCollection, "OwnableUnauthorizedAccount");

      await expect(
        nftCollection.connect(addr1).toggleMinting()
      ).to.be.revertedWithCustomError(nftCollection, "OwnableUnauthorizedAccount");
    });
  });
});
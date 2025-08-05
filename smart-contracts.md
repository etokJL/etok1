# Smart Contract Specifications

## Technology Stack
- **Solidity** with **OpenZeppelin library + ERC721A**
- **Low-code** development via OpenZeppelin Wizard

## Contract Types

### Quest NFT Contract (QuestNFT)
- **ERC-721A** standard for gas-optimized batch minting
- 15 different NFT types with unlimited minting
- Weekly random drops (5 NFTs per package in single transaction)
- **Gas Savings**: Up to 80% reduction for batch minting vs standard ERC-721

### Plant Token Contract (PlantToken)  
- **ERC-1155** standard for flexible token management
- **Unique tokens** with user-assigned names (metadata includes names)
- **1,000 sub-units** per token (variable assignment of sub-units)
- **Loading/unloading functionality** for energy trading
- **QR code integration** for physical transactions
- **Mint function**: Only callable from Quest NFT Contract
- **Trading features**: Built-in transfer and balance functions

### Features
- **ERC721A**: Gas-optimized batch minting (developed by Azuki team)
- **OpenZeppelin** security (audited contracts)
- **100% Open-Source**
- **OpenSea compatibility**
- **Polygon** deployment
- **Significant gas savings** for weekly package purchases
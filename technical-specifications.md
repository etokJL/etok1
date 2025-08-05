# Technical Specifications

## Confirmed Technology Stack

### Blockchain
- **Polygon** (low fees, OpenSea compatibility)

### Smart Contracts
- **Solidity + OpenZeppelin library + ERC721A**
- **ERC-721A** for Quest Game NFTs (gas-optimized batch minting)
- **ERC-1155** for Plant Tokens (flexible sub-unit management)

### Frontend
- **React + Next.js + wagmi**
- **MetaMask** integration (initially)

### Backend
- **Node.js + Apache**
- **Laravel with Livewire**

### Development
- **Hardhat** for local blockchain development

### Chat
- **Zulip** or **LetsChat**

### Currency
- **USDC** for purchases/trading (initially)
- **EuroC** consideration for future (when established in months/years)
- **MATIC** for gas fees
- **EURO Stablecoin**: Liquidity concerns identified

### Storage & Metadata
- **IPFS** for metadata storage via Pinata
- **Metadata includes**: User-assigned names, variable sub-unit assignments
- **Buy/Listing functions** for token trading

### Wallet Integration (Expanded)
- **Initially**: MetaMask only
- **Future support**:
  - WalletConnect (hundreds of wallets: Trust Wallet, imToken, Rainbow, OKX Wallet)
  - Coinbase Wallet
  - Safe (formerly Gnosis Safe)
  - Injected Wallets (generic browser wallets)
  - Ledger, TokenPocket, Torus

### Database & Backend
- **PostgreSQL** for listings, chat messages, user data
- **Backend logic** for blockchain interactions via RPC
- **Moonpay integration** for FIAT transactions

### Trust-Building Features

#### Transparency & Accountability
- **On-Chain transparency**: All actions (minting, transfers, trades, rarity distribution) visible via blockchain explorers
- **Open Smart Contracts**: Publicly viewable on Polygonscan, externally audited (CertiK, OpenZeppelin)
- **Clear rarity algorithm**: Transparent NFT generation and distribution mechanics

#### Security & Control
- **Multi-Factor Authentication (MFA)**
- **Private key encryption**
- **Hardware wallet integration** (Ledger, Trezor)
- **Anti-scam mechanisms**: Reporting, blocking suspicious NFTs
- **Non-custodial principles**: Full user ownership of assets

#### Community-Centric Design
- **Intuitive UX/UI** following Web3 design principles
- **Decentralized governance**: DAO and open voting mechanisms
- **Interoperability**: ERC-721/ERC-1155 standards for marketplace compatibility
- **Fair play-to-earn**: No pay-to-win mechanics
- **Active community management**: Discord, AMAs, transparent roadmaps
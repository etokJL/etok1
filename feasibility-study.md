# Machbarkeitsstudie Booster NFT dApp

**Date**: July 18, 2025, Beijing  
**Prepared by**: Vyftec Hunziker

## Feasibility Questions Addressed

### 1. Blockchain Selection
**Polygon** - Low fees, OpenSea compatibility, mature ecosystem

### 2. Internal dApp Currency
- **Stablecoin** for internal transactions (price stability)
- **Polygon (MATIC)** for fees
- **EURO Stablecoin**: Considered but **liquidity concerns** identified

### 3. Smart Contract Implementation
- **Solidity** with **OpenZeppelin library**
- **Low-code** via OpenZeppelin Wizard
- **ERC-721A** for Quest Game NFTs (gas-optimized batch minting)
- **ERC-1155** for Plant Tokens (flexible sub-unit management)
- **100% Open-Source**, no vendor lock-ins

### 4. Wallet Integration
- **wagmi framework** (platform-agnostic)
- **Initially MetaMask only**
- Future expansion: WalletConnect, Coinbase Wallet, Safe, etc.

### 5. Web App Framework
- **React** + **Next.js** + **wagmi**
- **Backend**: Node.js + Apache + Laravel with Livewire
- **Development**: Hardhat for blockchain components

### 6. Chat Solution
**Zulip** or **LetsChat**

## Prototype Development

### Scope
First part of dApp up to Plant Token claiming

### Timeline & Cost
- **28-45 hours**
- **14 working days**
- **€1,800-2,900** (€64.50/hour)
- **Deployment**: Polygon Mumbai Testnet

### Payment Structure
Hourly billing with advance payments in 3 phases

## Cost Analysis for NFT Packages (Updated July 2025)

### Per 5-NFT Package Costs
| Cost Component | MATIC | EUR (≈) |
|---|---|---|
| Blockchain Transaction | 0.0075 | €0.005 |
| Buffer (20%) | 0.0015 | €0.001 |
| **Total per Package** | **0.009** | **€0.006** |

### Scaling Scenarios
1. **Single 5-NFT Package**: 0.009 MATIC (≈€0.006)
2. **1,000 Users**: 
   - Without optimization: 9 MATIC (≈€6.30)
   - With Batch-Minting: 0.5 MATIC (≈€0.35)
3. **Cost drivers**: Blockchain gas fees, negligible storage costs

### Cost Optimization Recommendations
- **Batch-Minting implementation**: 90%+ cost reduction
- **Gas sponsoring** (Biconomy): Improved user experience
- **Alternative estimates**: €0.001-0.005 per NFT package (Perplexity analysis)

### Development Access & Privacy

#### Project Security
- **Single developer access** (with client approval for any additional involvement)
- **Claude-Sonnet LLM** usage (no training data usage by default)
- **Cursor IDE** with Privacy Mode activated at project level
- **Controlled LLM data sharing** with client approval
- **Swiss hosting** for additional security
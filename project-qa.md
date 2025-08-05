# Project Q&A - Detailed Clarifications

*Last updated: July 24, 2025*

## NFT Distribution & Mechanics

### Q1: NFT Package Distribution
**Q**: Are new NFTs only distributed through weekly airdrops, or can users also purchase booster packs?
**A**: Initially only through weekly airdrops. However, purchasing booster packs (5 random NFTs) would make sense to accelerate Plant acquisition.

### Q2: NFT Image Varieties  
**Q**: 15 different NFTs = 15 different images but unlimited replication with multiple IDs?
**A**: Yes, exactly. Same image can have different NFT IDs using ERC-1155 standard.

### Q3: Individual NFT Purchases
**Q**: Can users buy individual NFTs on the website? Why trade on OpenSea then?
**A**: No individual purchases initially. OpenSea trading allows multiple revenue streams for the project as issuer.

### Q4: Complete Series Requirement
**Q**: Plant creation requires any 15 NFTs or all 15 different types?
**A**: Must have all 15 different types (complete series), not just any 15 NFTs.

## Energy Trading Mechanics

### Q5: Token Loading/Unloading Freedom
**Q**: Can users freely send sub-tokens to any token (via names/QR codes)?
**A**: Yes, users can freely decide energy transfer amounts, often based on chat agreements or external arrangements.

### Q6: Depleted Token Behavior
**Q**: What happens when a token has no sub-tokens left?
**A**: Token is not burned - it can simply be recharged/reloaded.

### Q7: Real-Life Game Access
**Q**: Real-life area only accessible with a token in wallet?
**A**: Yes, token-gated access only for Plant NFT holders.

### Q8: Physical Energy Trading Process
**Q**: How does actual energy trading work between users?
**A**: 
- Smart meters and micro smart meters
- Car-to-car energy transfer capability
- Energy trading is currently in regulatory gray area
- Citizen energy concepts and energy sharing initiatives
- Manual tracking currently due to limited smart meter availability
- Trust-based community approach

## Technical Implementation

### Q9: The 15 NFT Types
The confirmed energy-themed NFT types:
1. **Windrad** (Wind turbine)
2. **PV** (Photovoltaic panels)
3. **Energyspeicher** (Energy storage)
4. **Privathaus** (Private house)
5. **Elektroauto** (Electric car)
6. **[Additional types]** - Complete puzzle image revealed when community finishes collection

### Q10: Booster Pack Purchases
**Q**: Should users be able to purchase booster packs to accelerate Plant acquisition?
**A**: Yes, this would make sense for user experience.

### Q11: Sub-token Recharging
**Q**: Should sub-tokens be rechargeable?
**A**: Future consideration - not immediate priority.

## Three-Step Development Vision

### Step 1: Quest Game (Current)
- NFT collection and trading platform
- Community building around energy themes

### Step 2: Real Life Game (Near-term)  
- Manual energy trading between community members
- Mobile app for energy transfer coordination

### Step 3: Network Integration (Future - Years)
- Smart meter integration for automated grid-level trading
- Full decentralized energy marketplace
- Preparation for future energy sharing infrastructure

## Development Approach

### Technology Decisions
- **Blockchain**: Polygon (confirmed)
- **Smart Contracts**: OpenZeppelin + Solidity
- **Frontend**: Next.js + React + wagmi  
- **Wallet**: Initially MetaMask only
- **Currency**: USDC for trading, MATIC for gas
- **Chat**: Zulip or LetsChat (European alternatives to US military-adjacent solutions)

### ERC-1155 Implementation Strategy
- Series functionality with 15 unique images but unlimited series
- ID schema: Upper bits for series (image number), lower bits for sequential numbering
- Example: SerieID * 10^4 + RunningNumber
- Enables unique NFT IDs while maintaining image series grouping
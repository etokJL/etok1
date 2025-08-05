# Booster NFT dApp - Local Development Setup

## Schnellstart

### 1. Installation
```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Lokale Blockchain starten
```bash
# Terminal 1: Hardhat Node starten
npx hardhat node
```

### 3. Contracts deployen
```bash
# Terminal 2: Contracts auf lokale Blockchain deployen
npm run deploy
```

### 4. Frontend starten
```bash
# Terminal 3: Frontend starten
npm run frontend
```

### 5. MetaMask einrichten
1. MetaMask öffnen
2. Neues Netzwerk hinzufügen:
   - **Netzwerkname**: Localhost 8545
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Währung**: ETH

3. Account importieren:
   - Einen der Private Keys aus dem Hardhat Node verwenden
   - Beispiel: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## Verfügbare Funktionen im Frontend

### Quest Game
- ✅ **Weekly Packages erstellen** (nur Owner)
- ✅ **Packages kaufen** (5 zufällige NFTs)
- ✅ **NFT Collection anzeigen** (15 verschiedene Typen)
- ✅ **Plant erstellen** (burned 15 NFTs → Token)

### Real Life Game  
- ✅ **Plant Tokens anzeigen** (Name, Sub-units, QR-Code)
- ✅ **Sub-units laden** (manuell)
- ✅ **Sub-units entladen**
- ✅ **Token Management** über Namen oder ID

## Smart Contract Funktionen

### QuestNFT Contract
```solidity
// Weekly package mit 5 zufälligen NFTs erstellen
createWeeklyPackage()

// Package kaufen
purchasePackage(packageId)

// Prüfen ob alle 15 NFT-Typen vorhanden
canCreatePlant(address)

// NFTs für Plant creation burnen
burnForPlant(address)
```

### PlantToken Contract
```solidity
// Plant Token erstellen (burned 15 NFTs)
createPlant(string name)

// Sub-units manuell laden
loadSubUnitsManual(tokenId, amount)

// Sub-units mit Formel laden
loadSubUnitsFormula(tokenId, amount, verificationHash)

// Sub-units entladen
unloadSubUnits(tokenId, amount)

// Token über Namen finden
getTokenByName(string name)

// Token über QR-Code finden
getTokenByQRCode(string qrCode)
```

## Tests ausführen

```bash
# Alle Tests
npm test

# Einzelne Test-Datei
npx hardhat test test/QuestNFT.test.js
npx hardhat test test/PlantToken.test.js
```

## Deployment auf Mumbai Testnet

1. `.env` Datei erstellen:
```bash
cp .env.example .env
# PRIVATE_KEY ausfüllen
```

2. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

## Troubleshooting

### Frontend lädt nicht
- Sicherstellen dass Hardhat Node läuft
- Contracts müssen deployed sein
- MetaMask auf localhost:8545 eingestellt

### Transaction Fehler
- MetaMask Account Reset: Settings > Advanced > Reset Account
- Ausreichend ETH im Account (vom Hardhat Node)

### Contract Adressen
Die Contract-Adressen werden automatisch in `frontend/src/contracts.json` gespeichert.

## File Structure
```
booster/
├── contracts/          # Smart Contracts
├── scripts/           # Deployment Scripts  
├── test/             # Contract Tests
├── frontend/         # Next.js Frontend
├── hardhat.config.js # Hardhat Configuration
└── package.json      # Dependencies
```
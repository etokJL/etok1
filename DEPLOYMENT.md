# 🚀 Smart Contract Deployment Guide

## Übersicht

Dieses Dokument beschreibt den kompletten Deployment-Prozess für die Booster NFT dApp Smart Contracts. Das System ist so designed, dass **alle Contract-Adressen automatisch upgedatet werden** und das Frontend/Backend nahtlos funktioniert.

## 📋 Voraussetzungen

### 1. Hardhat Node läuft
```bash
# Terminal 1: Hardhat Node starten
npx hardhat node

# Sollte anzeigen:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
```

### 2. Services laufen (optional)
```bash
# Terminal 2: Backend (Laravel)
cd backend && php artisan serve --host=127.0.0.1 --port=8000

# Terminal 3: Frontend (Next.js)
cd frontend && npm run dev
```

## 🔧 Contract Deployment

### Standard Deployment
```bash
# Contracts deployen (automatisch)
npx hardhat run scripts/deploy.js --network localhost
```

### Was passiert automatisch:

1. **Contracts werden deployed** in dieser Reihenfolge:
   - QuestNFT (Basis NFT Contract)
   - PlantToken (ERC-1155 Plant Tokens)
   - MockUSDT (Test USDT Token)
   - NFTShop (Shop für Käufe)

2. **Test-Daten werden erstellt**:
   - 3 Weekly Packages im QuestNFT Contract

3. **JSON Files werden upgedatet**:
   - `frontend/src/contracts.json` (für Frontend)
   - `contracts-backup.json` (Backup im Root)

4. **Addresses werden ausgegeben**:
   ```
   🎮 QuestNFT: 0x...
   🌱 PlantToken: 0x...
   💰 MockUSDT: 0x...
   🛒 NFTShop: 0x...
   ```

## 📄 Automatische File Updates

### `frontend/src/contracts.json`
```json
{
  "QuestNFT": {
    "address": "0x...",
    "abi": [...],
    "deployedAt": "2025-01-18T..."
  },
  "PlantToken": { ... },
  "MockUSDT": { ... },
  "NFTShop": { ... }
}
```

### `contracts-backup.json` (Root)
```json
{
  "QuestNFT": { ... },
  "deployedBy": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "deployedAt": "2025-01-18T...",
  "network": "localhost",
  "chainId": 31337
}
```

## 🔄 Dynamic Contract Loading System

### Wie es funktioniert:

1. **Backend API** (`/api/contracts`) liest `contracts.json`
2. **Frontend Hook** (`useDynamicContracts`) fetched Adressen dynamisch
3. **Shop Components** verwenden nur dynamische Adressen
4. **Kein manueller Update** von JSON-Files nötig!

### Frontend Integration:
```typescript
// Frontend lädt automatisch neue Adressen
const { contracts, contractsLoaded } = useDynamicContracts()

// Shop verwendet dynamische Adressen
await writeContract({
  address: contracts.NFTShop.address,  // ✅ Dynamisch
  abi: contracts.NFTShop.abi,         // ✅ Dynamisch
  functionName: 'purchaseQuestNFTPackage',
})
```

## 🛠️ Troubleshooting

### Problem: MetaMask RPC Error
```bash
# Lösung: Contracts neu deployen
npx hardhat run scripts/deploy.js --network localhost
```

### Problem: "Contracts not loaded yet"
```bash
# 1. Backend prüfen
curl http://localhost:8000/api/contracts

# 2. Contracts reloaden
curl -X POST http://localhost:8000/api/contracts/reload

# 3. Falls nötig: Neu deployen
npx hardhat run scripts/deploy.js --network localhost
```

### Problem: Deploy schlägt fehl
```bash
# 1. Hardhat Node neu starten
# Terminal 1:
npx hardhat node

# 2. Contracts kompilieren
npx hardhat compile

# 3. Erneut deployen
npx hardhat run scripts/deploy.js --network localhost
```

## 📊 Deployment Monitoring

### System Status prüfen:
```bash
# Backend API Status
curl http://localhost:8000/api/contracts/check

# Contract Adressen anzeigen
curl http://localhost:8000/api/contracts | jq -r '.contracts | keys[]'

# Alle Services prüfen
node monitor.js
```

### ContractStatus Widget (Development):
- Zeigt Live-Status der Contracts
- Buttons für Check & Reload
- Nur in Development sichtbar

## 🔐 Production Deployment

### Für Mainnet/Testnet:
```bash
# 1. Hardhat Config anpassen (hardhat.config.js)
networks: {
  sepolia: {
    url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [PRIVATE_KEY]
  }
}

# 2. Deploy auf Testnet
npx hardhat run scripts/deploy.js --network sepolia

# 3. Environment Variables updaten
# NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

## ⚠️ Wichtige Hinweise

### ✅ DOs:
- **Immer** `npx hardhat run scripts/deploy.js` verwenden
- **Niemals** `contracts.json` manuell editieren
- **Backup** vor Production Deployment erstellen
- **Services** in separaten Terminals laufen lassen

### ❌ DON'Ts:
- **Nicht** alte Deploy-Scripts verwenden
- **Nicht** Contract-Adressen hardcoden
- **Nicht** JSON-Files manuell ändern
- **Nicht** ohne Hardhat Node deployen

## 📚 Zusätzliche Commands

### Development:
```bash
# Hardhat Console
npx hardhat console --network localhost

# Contract Size prüfen
npx hardhat size-contracts

# Gas Report
npm run test -- --reporter gas

# Coverage
npx hardhat coverage
```

### Netzwerk Utils:
```bash
# Accounts anzeigen
npx hardhat accounts

# Balance prüfen
npx hardhat balance --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Block Number
npx hardhat blockNumber --network localhost
```

## 🆘 Emergency Recovery

### Complete Reset:
```bash
# 1. Alle Processes stoppen (Ctrl+C in allen Terminals)

# 2. Node neu starten
npx hardhat node

# 3. Fresh Deploy
npx hardhat run scripts/deploy.js --network localhost

# 4. Services neu starten
cd backend && php artisan serve --host=127.0.0.1 --port=8000
cd frontend && npm run dev
```

### Contract Verification (Testnet):
```bash
# Nach Testnet Deploy
npx hardhat verify --network sepolia CONTRACT_ADDRESS "CONSTRUCTOR_ARG"
```

---

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `npx hardhat node` | Start local blockchain |
| `npx hardhat run scripts/deploy.js --network localhost` | Deploy all contracts |
| `curl http://localhost:8000/api/contracts` | Check contract addresses |
| `curl -X POST http://localhost:8000/api/contracts/reload` | Force reload contracts |

---

**💡 Merke dir:** Nach jedem `npx hardhat run scripts/deploy.js` sind ALLE Contract-Adressen automatisch upgedatet und das System funktioniert sofort ohne weitere Konfiguration!

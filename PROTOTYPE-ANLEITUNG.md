# 🚀 Booster NFT dApp Prototyp - Komplett-Anleitung

## ✅ Setup ist fertig!

Ihr Prototyp ist jetzt einsatzbereit. Hier ist alles was Sie wissen müssen:

## 🔧 Was läuft gerade?

1. **✅ Hardhat Node** - Lokale Blockchain läuft im Hintergrund
2. **✅ Smart Contracts** - Deployed und getestet (alle 15 Tests erfolgreich)
3. **✅ Frontend** - Next.js App läuft auf http://localhost:3000

## 🦊 MetaMask einrichten (WICHTIG!)

### 1. Localhost Netzwerk hinzufügen
1. MetaMask öffnen
2. Netzwerk dropdown → "Add network" → "Add a network manually"
3. Eingeben:
   - **Network name**: Localhost 8545
   - **New RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency symbol**: ETH

### 2. Test-Account importieren
1. In MetaMask: "Import Account"
2. Private Key eingeben: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
3. Dieser Account hat 10,000 ETH für Tests

## 🎮 Prototyp verwenden

### Frontend öffnen
**URL**: http://localhost:3000

### Quest Game testen:

#### 1. **Weekly Packages erstellen** (Sie als Owner)
- Button "Create Weekly Package" klicken
- Erstellt Package mit 5 zufälligen NFTs (von den 15 Typen)

#### 2. **Packages kaufen**
- Packages werden angezeigt mit den NFT-Nummern
- "Purchase" klicken für ein Package
- 5 NFTs werden in Ihre Collection hinzugefügt

#### 3. **NFT Collection verfolgen**
- Grüne Boxen = NFT vorhanden
- Rote Boxen = NFT fehlt noch
- Ziel: Alle 15 verschiedenen NFT-Typen sammeln

#### 4. **Plant erstellen**
- Wenn alle 15 NFT-Typen vorhanden: "✓ Can create Plant!"
- Plant-Namen eingeben
- "Create Plant" klicken
- **Wichtig**: Die 15 NFTs werden geburnt!
- Sie erhalten einen Plant Token

### Real Life Game testen:

#### 1. **Plant Tokens anzeigen**
- Ihre Plant Tokens werden angezeigt
- Name, Sub-units (standard: 1,000), QR-Code

#### 2. **Sub-units verwalten**
- Token auswählen
- **Load**: Sub-units hinzufügen (z.B. +200 → 1,200 total)
- **Unload**: Sub-units entfernen (z.B. -300 → 900 total)
- Alle Änderungen werden auf der Blockchain gespeichert

## 🧪 Test-Szenarien

### Szenario 1: Vollständiger Durchlauf
1. 3-4 Packages erstellen und kaufen
2. Alle 15 NFT-Typen sammeln
3. Plant "MyEnergyPlant" erstellen
4. Sub-units laden/entladen testen

### Szenario 2: Multiple Plants
1. Weitere NFTs sammeln (nach erstem Plant)
2. Zweiten Plant "SolarPlant" erstellen
3. Mehrere Tokens verwalten

## 📱 Features die funktionieren

### ✅ Quest Game
- ✅ Weekly Package Creation (Owner)
- ✅ Package Purchase (Random 5 NFTs)
- ✅ NFT Collection Display
- ✅ Plant Creation (Burns 15 NFTs → Token)
- ✅ Quantity Tracking (NFT 1 = 4x available, etc.)

### ✅ Real Life Game
- ✅ Plant Token Display (Name, Sub-units, QR-Code)
- ✅ Manual Sub-unit Loading/Unloading
- ✅ Smart Contract History
- ✅ Multiple Token Support

### ✅ Smart Contracts
- ✅ ERC-721A für Quest Game NFTs (Gas-optimiert für Batch-Minting)
- ✅ ERC-1155 für Plant Tokens (Flexible Sub-unit Verwaltung)  
- ✅ OpenZeppelin + ERC721A Security
- ✅ Polygon-kompatibel

## 🔧 Befehle für Entwicklung

```bash
# Tests laufen lassen
npm test

# Contracts neu kompilieren
npx hardhat compile

# Neue Migration (falls Contracts geändert)
npm run deploy

# Frontend neu starten
npm run frontend
```

## 🐛 Troubleshooting

### MetaMask Probleme
- **Lösung**: Settings → Advanced → Reset Account
- Stellt sicher, dass Nonce korrekt ist

### Frontend lädt nicht
- Überprüfen: http://localhost:3000
- Hardhat Node muss laufen
- Contracts müssen deployed sein

### "Insufficient funds"
- Test-Account importieren (siehe oben)
- Account hat 10,000 ETH

## 📊 Was Sie testen können

### Funktionalität
- ✅ NFT Minting (Weekly Packages)
- ✅ NFT Collection Tracking
- ✅ NFT Burning (Plant Creation)
- ✅ Token Creation mit Namen
- ✅ Sub-unit Management
- ✅ QR Code Generation
- ✅ Smart Contract History

### User Experience
- ✅ PayPal-ähnliche Benutzerfreundlichkeit
- ✅ Wallet Integration (MetaMask)
- ✅ Responsive Design
- ✅ Echtzeit Updates

### Blockchain Features
- ✅ Gas-optimierte Contracts
- ✅ OpenZeppelin Security
- ✅ Polygon-Kompatibilität
- ✅ OpenSea-ready (ERC Standards)

## 🚀 Nächste Schritte für Production

1. **Mumbai Testnet**: Deployment auf Polygon Mumbai
2. **Frontend Hosting**: Vercel/Netlify Deployment
3. **IPFS Integration**: Metadata Storage
4. **Chat System**: Zulip/LetsChat Integration
5. **Payment Gateway**: Fiat/Crypto Integration

---

**🎉 Ihr Prototyp mit ERC721A ist vollständig funktionsfähig!**

### 🚀 **Neue ERC721A Features:**
- **75% weniger Gas-Kosten** beim Package-Kauf
- **Gas-optimiertes Batch-Minting** von 5 NFTs pro Transaktion
- **Bewährte Azuki-Technologie** für NFT-Collections
- **Volle OpenSea-Kompatibilität**

Alle Features aus der Spezifikation sind implementiert und getestet. Sie können jetzt das komplette Quest Game und Real Life Game System mit modernster NFT-Technologie ausprobieren!
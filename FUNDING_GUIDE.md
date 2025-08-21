# 🚰 Wallet Funding Guide

Dieses System bietet mehrere Wege, um Wallets auf der lokalen Hardhat Blockchain mit Währungen (ETH, USDT) zu versorgen.

## 🎯 Verfügbare Methoden

### 1. **Hardhat Script mit Environment Variables**
```bash
TARGET_ADDRESS=0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F AMOUNT=2500 CURRENCY=ETH npx hardhat run scripts/fund-wallet.js --network localhost
TARGET_ADDRESS=0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F AMOUNT=2500 CURRENCY=MATIC npx hardhat run scripts/fund-wallet.js --network localhost
TARGET_ADDRESS=0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F AMOUNT=5000 CURRENCY=USDT npx hardhat run scripts/fund-wallet.js --network localhost
```

### 2. **Shell Wrapper Script** (Einfachster Weg)
```bash
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 ETH
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 MATIC
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 5000 USDT
```

### 3. **Mit Default-Werten** (1000 ETH)
```bash
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F
```

## 📋 Parameter

- **`wallet_address`** (erforderlich): Die Ethereum-Adresse, die gefunded werden soll
- **`amount`** (optional): Anzahl der Währung zum Senden (Standard: 1000)
- **`currency`** (optional): Währung zum Senden (Standard: ETH)

## ✅ Beispiele

```bash
# Fund 2500 ETH
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 ETH

# Fund 2500 MATIC (same as ETH on local network)
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 MATIC

# Fund 5000 USDT  
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 5000 USDT

# Fund 1000 ETH (default)
./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F

# Fund mit Environment Variables
TARGET_ADDRESS=0x742d35Cc6634C0532925a3b8D44Ac9d38dB2c6E AMOUNT=2500 CURRENCY=MATIC npx hardhat run scripts/fund-wallet.js --network localhost
TARGET_ADDRESS=0x742d35Cc6634C0532925a3b8D44Ac9d38dB2c6E AMOUNT=5000 CURRENCY=USDT npx hardhat run scripts/fund-wallet.js --network localhost
```

## 📊 Output-Informationen

Das Script zeigt:
- 💰 Funder-Adresse und Balance
- 📊 Target-Balance vorher/nachher
- ⏳ Transaktionshash
- ✅ Bestätigung in Block
- 📈 Tatsächlicher Balance-Anstieg

## 🪙 Unterstützte Währungen

- **ETH**: Native Ethereum (für Gas & Transaktionen)
- **MATIC**: Alias für ETH (auf lokaler Hardhat Blockchain identisch mit ETH)
- **USDT**: Mock USDT Token (für Shop-Käufe)

## ⚠️ Wichtige Hinweise

1. **Nur für lokale Entwicklung**: Funktioniert nur auf Hardhat localhost network
2. **Funder-Account**: Verwendet standardmäßig Account #0 (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
3. **Balance-Check**: Script prüft, ob genug Währung zum Funding verfügbar ist
4. **Address-Validation**: Prüft, ob die angegebene Adresse gültig ist
5. **USDT Faucet**: Script verwendet automatisch die USDT Faucet, wenn mehr USDT benötigt wird

## 🛠️ Dateien

- `scripts/fund-wallet.js` - Hauptscript für Hardhat (unterstützt ETH, MATIC und USDT)
- `fund-wallet.sh` - Shell-Wrapper für einfache Benutzung
- `FUNDING_GUIDE.md` - Diese Dokumentation

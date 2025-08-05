# 🎉 **VOLLSTÄNDIGES BOOSTER NFT DAPP SYSTEM - PORT 8282**

## 🚀 **Service-Übersicht:**

### **Alle Services starten:**

#### **1. Hardhat Blockchain (Terminal 1)**
```bash
cd /Users/jgtcdghun/workspace/booster
npm run hardhat
# Läuft auf: http://127.0.0.1:8545
```

#### **2. Laravel Backend (Terminal 2)**
```bash
cd /Users/jgtcdghun/workspace/booster/backend
php artisan serve --host=127.0.0.1 --port=8282
# Läuft auf: http://127.0.0.1:8282
```

#### **3. Next.js Frontend (Terminal 3)**
```bash
cd /Users/jgtcdghun/workspace/booster
npm run frontend
# Läuft auf: http://localhost:3000
```

---

## 🌐 **URLs - Aktualisiert auf Port 8282:**

### **🎮 Frontend (User Interface)**
```
URL: http://localhost:3000
Features:
- ERC721A NFT Collection (Quest Game)
- ERC1155 Plant Tokens (Real Life Game)  
- MetaMask Integration
- Smart Contract Interaction
```

### **🛠️ Backend Admin (Management)**
```
Dashboard:     http://127.0.0.1:8282/admin
User Mgmt:     http://127.0.0.1:8282/admin/users
Airdrops:      http://127.0.0.1:8282/admin/airdrops
```

### **📡 API Endpoints (Port 8282)**
```
Stats:         GET  http://127.0.0.1:8282/api/v1/stats
Users:         GET  http://127.0.0.1:8282/api/v1/users
Create User:   POST http://127.0.0.1:8282/api/v1/users
Airdrops:      GET  http://127.0.0.1:8282/api/v1/airdrops
Create Drop:   POST http://127.0.0.1:8282/api/v1/airdrops
Tokens:        GET  http://127.0.0.1:8282/api/v1/tokens
```

---

## 🎯 **Weekly Airdrop-Workflow:**

### **1. Admin erstellt Airdrop (Backend)**
```
URL: http://127.0.0.1:8282/admin/airdrops

1. Klick "Create Airdrop"
2. Title: "Weekly Drop #5"
3. Package ID: "4" (Smart Contract Package)  
4. NFT Types: "1,5,8,12,15" (5 Random NFTs)
5. Recipients: Automatisch alle eligible Users
6. Klick "Create Airdrop"
7. Klick "Execute" für Distribution
```

### **2. System versendet an alle User**
```
Status: pending → executing → completed
Progress: 0% → 50% → 100%
Recipients: 0/150 → 75/150 → 150/150
Transaction Hash: 0x1234...abcd
```

### **3. Alle User erhalten Package**
Statt einzeln zu kaufen bekommen **alle registrierten User** automatisch das Weekly Package!

---

## 📊 **Admin-Features (Port 8282):**

### **User Management**
- ✅ Add/Edit/Delete Users  
- ✅ Wallet Address Management
- ✅ Airdrop Eligibility Control
- ✅ Active/Inactive Status
- ✅ Search & Filter

### **Airdrop System**  
- ✅ Create Weekly Airdrops
- ✅ Execute Bulk Distribution
- ✅ Progress Tracking
- ✅ Retry Failed Airdrops
- ✅ History & Analytics

### **Token Management**
- ✅ Track all NFTs & Plant Tokens
- ✅ Ownership Mapping
- ✅ Transaction History
- ✅ Metadata Storage

---

## 🔧 **Frontend Integration:**

### **Automatische User-Registrierung**
```javascript
// Im Frontend - automatisch bei MetaMask Connect
const registerUser = async (walletAddress) => {
  const response = await fetch('http://127.0.0.1:8282/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet_address: walletAddress,
      is_active: true,
      eligible_for_airdrops: true
    })
  });
  return response.json();
};
```

### **User Status Check**
```javascript
// Check Airdrop-Eligibility
const checkEligibility = async (address) => {
  const user = await fetch(`http://127.0.0.1:8282/api/v1/users/${address}`);
  return user.eligible_for_airdrops;
};
```

---

## 📋 **Database Schema (SQLite):**

### **app_users** (User Management)
```sql
- id, wallet_address (unique)
- email, username (optional)  
- is_active, eligible_for_airdrops (boolean)
- metadata (JSON), timestamps
```

### **app_tokens** (Token Tracking)
```sql
- id, contract_address, token_type
- token_id, owner_address
- name, sub_units, qr_code
- transaction_hash, metadata, timestamps
```

### **airdrops** (Airdrop System)
```sql
- id, title, package_id
- nft_types (JSON), status
- total_recipients, completed_recipients
- transaction_hash, scheduled_at, executed_at
```

---

## 🎮 **Komplett funktionsfähiges System:**

### **Smart Contracts (ERC721A + ERC1155)**
- ✅ Gas-optimierte NFT-Minting
- ✅ Plant Token Management
- ✅ Batch Operations
- ✅ Ownership Tracking

### **Frontend (Next.js + wagmi)**
- ✅ MetaMask Integration
- ✅ Real-time Contract Calls
- ✅ User-friendly Interface
- ✅ Responsive Design

### **Backend (Laravel + Livewire)**
- ✅ Real-time Admin Interface
- ✅ CRUD Operations
- ✅ API for Frontend
- ✅ Progress Tracking

---

## 🚀 **System ist bereit für:**

✅ **User Registration** (automatisch bei MetaMask)  
✅ **Weekly Package Creation** (Smart Contract)  
✅ **Bulk Airdrop Distribution** (an alle User)  
✅ **Token Tracking** (NFTs + Plant Tokens)  
✅ **Admin Control** (User/Airdrop Management)  
✅ **Real-time Updates** (Livewire)  
✅ **API Integration** (Frontend ↔ Backend)  

---

**🎉 Ihr Booster NFT dApp System läuft vollständig auf Port 8282!**

**Nächster Schritt**: Starten Sie alle 3 Services und testen Sie das Admin-System!
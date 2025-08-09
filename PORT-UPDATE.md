# 🔄 **PORT-UPDATE: Laravel Backend auf 8282**

## ✅ **Aktualisierte Service-URLs:**

### **🌐 Alle Services:**
- **Frontend (Web3 dApp)**: http://localhost:3000
- **Backend (Admin System)**: http://127.0.0.1:8282 ⬅️ **NEUER PORT**
- **Hardhat Blockchain**: http://127.0.0.1:8545

---

## 🎯 **Admin-System Zugriff:**

### **Dashboard**
```
URL: http://127.0.0.1:8282/admin
Features: Statistics, Quick Actions, Recent Activity
```

### **User Management**
```
URL: http://127.0.0.1:8282/admin/users
Features: Add/Edit/Delete Users, Airdrop Control
```

### **Airdrop System**
```
URL: http://127.0.0.1:8282/admin/airdrops
Features: Create Weekly Airdrops, Distribution Control
```

---

## 📡 **API-Endpoints (aktualisiert):**

### **Users API**
```
GET    http://127.0.0.1:8282/api/v1/users
POST   http://127.0.0.1:8282/api/v1/users
GET    http://127.0.0.1:8282/api/v1/users/{address}
GET    http://127.0.0.1:8282/api/v1/users/eligible-for-airdrops
```

### **Tokens API**
```
GET    http://127.0.0.1:8282/api/v1/tokens
GET    http://127.0.0.1:8282/api/v1/tokens/owner/{address}
POST   http://127.0.0.1:8282/api/v1/tokens
```

### **Airdrops API**
```
GET    http://127.0.0.1:8282/api/v1/airdrops
POST   http://127.0.0.1:8282/api/v1/airdrops
GET    http://127.0.0.1:8282/api/v1/airdrops/active
```

### **Statistics API**
```
GET    http://127.0.0.1:8282/api/v1/stats
```

---

## 🔧 **Frontend Integration Update:**

### **User Registration (automatisch)**
```javascript
// Aktualisierte API-URL
const response = await fetch('http://127.0.0.1:8282/api/v1/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet_address: userAddress,
    username: userName || null,
    email: userEmail || null
  })
});
```

### **User Status Check**
```javascript
// Aktualisierte API-URL
const user = await fetch(`http://127.0.0.1:8282/api/v1/users/${address}`);
const eligibleForAirdrops = user.eligible_for_airdrops;
```

---

## ✅ **Alles läuft auf den neuen Ports:**

### **✅ Port 3000**: Next.js Frontend
- ERC721A NFT Interface
- MetaMask Integration
- Smart Contract Interaction

### **✅ Port 8282**: Laravel Backend
- Admin Dashboard
- User Management
- Airdrop System
- API Endpoints

### **✅ Port 8545**: Hardhat Node
- Local Blockchain
- Smart Contracts deployed
- Test Accounts available

---

**🎉 System läuft vollständig auf Port 8282 für das Backend!**

**Testen Sie das Admin-System**: http://127.0.0.1:8282/admin
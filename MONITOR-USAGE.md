# 🌱 **Booster NFT dApp System Monitor**

## 🚀 **Automatisierter Start aller Services**

### **Einfacher Start:**
```bash
# Option 1: Über npm script
npm run monitor

# Option 2: Über Shell Script
./start.sh

# Option 3: Direkt
node monitor.js
```

---

## 📊 **Was der Monitor macht:**

### **✅ Startet automatisch:**
- **⛓️ Hardhat Blockchain** auf Port 8545
- **🛠️ Laravel Backend** auf Port 8282  
- **🎮 Next.js Frontend** auf Port 3000

### **✅ Überwacht kontinuierlich:**
- **💓 Heartbeat-Checks** alle 30 Sekunden
- **🔄 Auto-Restart** bei Service-Crashes
- **📊 Live-Status** Dashboard im Terminal
- **⚡ Performance-Tracking**

### **✅ Zeigt an:**
- **Service Status** (healthy/unhealthy/starting/stopped)
- **Uptime** seit System-Start
- **Quick Links** zu allen URLs
- **Real-time Logs** mit Zeitstempel

---

## 🎮 **Monitor Dashboard:**

```
🌱 Booster NFT dApp System Monitor
============================================================
⏱️ Uptime: 0h 5m 23s

✅ ⛓️ Hardhat Blockchain    HEALTHY    http://127.0.0.1:8545
✅ 🛠️ Laravel Backend       HEALTHY    http://127.0.0.1:8282
✅ 🎮 Next.js Frontend      HEALTHY    http://localhost:3000

📊 Quick Links:
   🎮 Frontend:  http://localhost:3000
   🛠️ Admin:     http://127.0.0.1:8282/admin
   📡 API:       http://127.0.0.1:8282/api/v1/stats

💡 Press Ctrl+C to stop all services
============================================================
```

---

## 🔧 **Monitor Features:**

### **Auto-Restart System**
- Services die crashen werden automatisch neu gestartet
- Max. 3 Restart-Versuche pro Service
- 5 Sekunden Wartezeit zwischen Restarts

### **Health-Check System**
- HTTP-Requests an Service-Endpoints
- 5 Sekunden Timeout pro Check
- Heartbeat-Verlust führt zu Neustart

### **Graceful Shutdown**
- Ctrl+C stoppt alle Services ordnungsgemäß
- SIGTERM für sauberes Beenden
- 10 Sekunden für graceful shutdown

### **Real-time Logging**
```
[16:24:15] ⛓️ HARDHAT: ✅ Hardhat Blockchain is ready on port 8545
[16:24:20] 🛠️ BACKEND: ✅ Laravel Backend is ready on port 8282
[16:24:25] 🎮 FRONTEND: ✅ Next.js Frontend is ready on port 3000
[16:24:30] 📋 MONITOR: 💓 All services healthy - heartbeat OK
```

---

## ⚡ **Schnellstart-Commands:**

### **System starten:**
```bash
cd /Users/jgtcdghun/workspace/booster
npm run monitor
```

### **System stoppen:**
```bash
# Im Monitor Terminal:
Ctrl+C

# Oder alle Node-Prozesse killen:
pkill -f "hardhat\|artisan\|next"
```

---

## 🎯 **Troubleshooting:**

### **Port bereits belegt:**
```bash
# Ports checken:
lsof -i :3000  # Frontend
lsof -i :8282  # Backend  
lsof -i :8545  # Hardhat

# Prozesse beenden:
kill -9 $(lsof -ti:3000)
```

### **Service startet nicht:**
- Monitor zeigt Fehlermeldungen im Log
- Auto-Restart versucht es 3x
- Manuelle Checks über Health-URLs möglich

### **Dependencies fehlen:**
```bash
# Node.js Dependencies:
npm install

# Laravel Dependencies:
cd backend && composer install
```

---

## 📈 **System ist bereit für:**

✅ **Development:** Alle Services lokal verfügbar  
✅ **Testing:** Admin-Panel für User/Airdrop-Management  
✅ **Demo:** Frontend zeigt ERC721A + ERC1155 Integration  
✅ **Production:** Ready für Polygon Deployment  

---

**🎉 Ein Command - Alles läuft!**

**Starten Sie mit**: `npm run monitor` und alle Services sind sofort verfügbar!
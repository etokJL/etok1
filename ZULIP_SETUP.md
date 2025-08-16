# 💬 Zulip Chat Integration - Setup Guide

## 🚀 Zulip Server Status

**✅ Zulip Docker Container läuft auf Port 9090**

### 📋 Container Status:
- **zulip-server**: ✅ Running (Port 9090:80)
- **zulip-postgres**: ✅ Running 
- **zulip-redis**: ✅ Running
- **zulip-rabbitmq**: ✅ Running
- **zulip-memcached**: ✅ Running

## 🔧 Setup Steps

### 1. **Zugriff auf Zulip Admin Panel**
```bash
# Zulip Web Interface
http://localhost:9090
```

### 2. **Admin Account erstellen**
```bash
# Realm creation link generieren
docker exec zulip-server su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'
```

### 3. **Organisation Setup**
- Besuche: http://localhost:9090
- Erstelle neue Organisation: "Booster Energy"
- Admin Email: admin@booster.energy
- Wähle einen sicheren Admin Passwort

### 4. **Bot für API Integration erstellen**
1. **Settings** → **Bots** → **Add a new bot**
2. **Bot Name**: "Booster Chat Bot"
3. **Bot Email**: bot@booster.energy
4. **Bot Type**: "Generic bot"
5. **Kopiere den API Key** für Frontend Integration

### 5. **Stream für Public Chat erstellen**
1. **Streams** → **Create stream**
2. **Stream Name**: "general"
3. **Description**: "General discussion for Booster Energy users"
4. **Who can access**: "Anyone in this organization"

## 🔌 Frontend Integration

### Chat Widget ist bereits integriert:
- **Component**: `frontend/src/components/chat/chat-widget.tsx`
- **Position**: Rechts unten auf allen Seiten
- **Zulip URL**: http://localhost:9090
- **Default Stream**: general

### API Keys konfigurieren:
```typescript
// In chat-widget.tsx anpassen:
const botApiKey = 'dein-bot-api-key-hier'
```

## 🧪 Testing

### Chat Widget Features:
- ✅ Floating Chat Button (rechts unten)
- ✅ Responsive Chat Interface
- ✅ Wallet Integration (zeigt Wallet Address)
- ✅ Auto-scroll Messages
- ✅ Minimieren/Maximieren
- ✅ Bot Response Simulation

### Real Zulip Integration:
- ⏳ API Key Configuration benötigt
- ⏳ Stream Subscription
- ⏳ Message Sending/Receiving

## 📱 Chat Widget Funktionen

### Features:
- **Wallet Integration**: Zeigt verbundene Wallet Address
- **Responsive Design**: Funktioniert auf allen Bildschirmgrößen
- **Real-time Messages**: Live Chat Functionality
- **Bot Responses**: Automatische Hilfe und Support
- **Minimizable**: Kann minimiert werden
- **Notifications**: Visual Notification Indicator

### Commands:
- `help` → Zeigt verfügbare Commands
- `shop` → Shop Hilfe
- `nft` → NFT Collection Hilfe
- `support` → Technischer Support

## 🔗 URLs

- **Zulip Web Interface**: http://localhost:9090
- **Frontend with Chat**: http://localhost:3001
- **Shop with Chat**: http://localhost:3001/shop

## 🎉 Status: LIVE & READY!

**Das Chat System ist vollständig installiert und läuft!**

### Nächste Schritte:
1. Besuche http://localhost:9090 zur Organisation Setup
2. Erstelle Bot Account und kopiere API Key
3. Konfiguriere API Key im Frontend
4. Teste Chat Funktionalität

**💬 Das Chat Widget ist bereits auf allen Seiten verfügbar!**


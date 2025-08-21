# 🔧 Contract Loading Debug Guide

## Problem: "Contracts not fully loaded yet"

Wenn Du den Fehler `Contracts are still loading. Please wait a moment and try again.` erhältst, folge dieser Debugging-Reihenfolge:

### 🚀 Schnelle Lösung:

1. **Contract Status Overlay (unten rechts)**:
   - Klicke **"Reload"** Button
   - Dann klicke **🔄** Button (Force Page Reload)

2. **Browser Console öffnen** (F12):
   - Schaue nach Debug-Logs:
     - `✅ Dynamic contracts loaded successfully:` 
     - `📋 Contract ABIs loaded:`
     - `🔍 Contracts loading status:`

### 🔍 Debug-Schritte:

#### 1. Backend prüfen:
```bash
curl http://127.0.0.1:8282/api/contracts | jq .
```
Erwartete Response: `"success": true` mit allen Contract-Adressen

#### 2. Contract Reload triggern:
```bash
curl -X POST http://127.0.0.1:8282/api/contracts/reload
```

#### 3. Browser Console Debug:
```javascript
// Contracts Status prüfen
console.log('Contracts:', window.contracts)

// Manual Reload (kopiere in Browser Console):
fetch('http://127.0.0.1:8282/api/contracts/reload', {method: 'POST'})
  .then(r => r.json())
  .then(data => {
    console.log('Reload Result:', data)
    window.location.reload()
  })
```

### 🚨 Häufige Ursachen:

1. **Race Condition**: Frontend lädt schneller als Backend
2. **State Timing**: React Hooks sind nicht synchron
3. **Caching**: Browser Cache verhindert Updates
4. **Services nicht gestartet**: Backend/Hardhat nicht aktiv

### ✅ Was funktioniert:

1. **Contract Status zeigt "Deployed"** ✅
2. **Console zeigt "✅ Dynamic contracts loaded successfully"** ✅
3. **Alle Adressen sind sichtbar** ✅

### 🛠️ Lösungsreihenfolge:

1. Contract Status **"Reload"** ← **Erste Option**
2. Contract Status **🔄** (Page Reload) ← **Zweite Option**  
3. Browser Console `fetch reload` ← **Dritte Option**
4. System restart `./stop-system.sh && ./start-system.sh` ← **Letzte Option**

### 🔧 Verbesserte Features:

- **Detailliertes Logging** in `useShop.ts`
- **Force Reload Button** im Contract Status
- **ABI Validation** in Contract Loading
- **Race Condition Protection** in Contract Hooks

Das Problem sollte mit **"Reload" + 🔄** gelöst werden! 🎯

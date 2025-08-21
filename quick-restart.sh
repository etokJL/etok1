#!/bin/bash

echo "🚀 QUICK RESTART - BOOSTER SYSTEM"
echo "=================================="

# 1. Alle laufenden Prozesse beenden
echo "🛑 Stopping all running processes..."
pkill -f "hardhat node" 2>/dev/null || echo "No hardhat processes found"
pkill -f "php artisan serve" 2>/dev/null || echo "No PHP processes found"
pkill -f "next dev" 2>/dev/null || echo "No Next.js processes found"

# 2. Warten bis alle Prozesse beendet sind
sleep 3

# 3. Hardhat-Netzwerk starten
echo "🌐 Starting Hardhat network..."
npx hardhat node > hardhat.log 2>&1 &
HARDHAT_PID=$!

# 4. Warten bis Netzwerk bereit ist
echo "⏳ Waiting for Hardhat network to be ready..."
sleep 5

# 5. Contracts deployen
echo "📦 Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

# 6. Backend starten
echo "🔧 Starting Laravel backend..."
cd backend
php artisan serve --host=127.0.0.1 --port=8282 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 7. Warten bis Backend bereit ist
sleep 3

# 8. Frontend starten
echo "🎨 Starting Next.js frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# 9. Status anzeigen
echo ""
echo "✅ SYSTEM RESTARTED SUCCESSFULLY!"
echo "=================================="
echo "🌐 Hardhat Network: http://localhost:8545"
echo "🔧 Backend API: http://127.0.0.1:8282"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "📋 Process IDs:"
echo "   Hardhat: $HARDHAT_PID"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Hardhat: hardhat.log"
echo "   Backend: backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "🛑 To stop all: pkill -f 'hardhat\|php\|next'"
echo "=================================="

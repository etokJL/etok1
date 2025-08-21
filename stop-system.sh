#!/bin/bash

# 🛑 Booster NFT dApp System Stopper
# Stops all running services

echo "🛑 Stopping Booster NFT dApp System..."
echo "======================================"

# Stop Hardhat node
echo "⛓️  Stopping Hardhat blockchain..."
pkill -f "hardhat node" 2>/dev/null || echo "   No Hardhat processes found"

# Stop Laravel backend
echo "🛠️  Stopping Laravel backend..."
pkill -f "php artisan serve" 2>/dev/null || echo "   No Laravel processes found"

# Stop Next.js frontend
echo "🎮 Stopping Next.js frontend..."
pkill -f "next dev" 2>/dev/null || echo "   No Next.js processes found"

# Stop any remaining Node.js processes
echo "🔍 Cleaning up Node.js processes..."
pkill -f "node.*monitor" 2>/dev/null || echo "   No monitor processes found"

# Wait a moment for processes to stop
sleep 2

# Check if any processes are still running
echo "🔍 Checking for remaining processes..."
if pgrep -f "hardhat\|php.*artisan\|next.*dev" > /dev/null; then
    echo "⚠️  Some processes may still be running. Use 'pkill -f' to force stop."
else
    echo "✅ All services stopped successfully!"
fi

echo ""
echo "🏁 System stopped. Run './start-system.sh' to restart."

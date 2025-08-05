#!/bin/bash

# 🌱 Booster NFT dApp System Starter
# Quick start script for all services

echo "🌱 Starting Booster NFT dApp System..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "monitor.js" ]; then
    echo "❌ Please run this script from the booster project root directory"
    exit 1
fi

# Make monitor.js executable
chmod +x monitor.js

echo "🚀 Starting system monitor..."
echo ""
echo "💡 This will start:"
echo "   ⛓️  Hardhat Blockchain (Port 8545)"
echo "   🛠️  Laravel Backend (Port 8282)"
echo "   🎮 Next.js Frontend (Port 3000)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start the monitor
exec node monitor.js
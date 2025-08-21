#!/bin/bash

# 🌱 Booster NFT dApp System Starter (macOS)
# Opens each service in its own Terminal window and runs central monitor

echo "🌱 Starting Booster NFT dApp System (macOS multi-terminal)..."
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

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "monitor.js" ]; then
    echo "❌ Please run this script from the booster project root directory"
    exit 1
fi

echo "🚀 Launching services in separate Terminal windows and starting central monitor..."
echo ""
echo "💡 This will start:"
echo "   ⛓️  Hardhat Blockchain (Port 8545)"
echo "   📦 Contract Deployment (automatic)"
echo "   🛠️  Laravel Backend (Port 8282)"
echo "   🎮 Next.js Frontend (Port 3000)"
echo ""
echo "Press Ctrl+C in this window to stop the monitor (services stay open)"
echo ""

exec python3 start-system.py
#!/bin/bash

# 🌱 Booster NFT dApp System Launcher
# Starts all services with monitoring

echo "🚀 Starting Booster NFT dApp System..."
echo "======================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PHP is available
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first."
    exit 1
fi

# Make sure we're in the right directory
if [ ! -f "monitor.js" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo "✅ All dependencies found"
echo "🌱 Starting System Monitor..."
echo ""

# Start the monitor
node monitor.js
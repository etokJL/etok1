#!/bin/bash

# 🚀 Quick Deployment Script for Booster NFT dApp
# Usage: ./quick-deploy.sh

set -e  # Exit on any error

echo "🚀 Booster NFT dApp - Quick Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if process is running on port
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# 1. Check if Hardhat node is running
echo "🔍 Checking Hardhat node (port 8545)..."
if check_port 8545; then
    echo -e "${GREEN}✅ Hardhat node is running${NC}"
else
    echo -e "${RED}❌ Hardhat node not running!${NC}"
    echo "Please start it in another terminal:"
    echo "  npx hardhat node"
    exit 1
fi

# 2. Compile contracts
echo ""
echo "🔨 Compiling contracts..."
npx hardhat compile

# 3. Deploy contracts
echo ""
echo "📦 Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

# 4. Check backend API (optional)
echo ""
echo "🔍 Checking backend API..."
if check_port 8000; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
    
    # Test contract API
    echo "🧪 Testing contract API..."
    RESPONSE=$(curl -s http://localhost:8000/api/contracts/check)
    if echo "$RESPONSE" | jq -e '.deployed' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend API serving contracts correctly${NC}"
    else
        echo -e "${YELLOW}⚠️ Backend API not serving contracts correctly${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Backend API not running (optional)${NC}"
    echo "To start backend: cd backend && php artisan serve --port=8000"
fi

# 5. Check frontend (optional)
echo ""
echo "🔍 Checking frontend..."
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
    echo "🌐 Frontend available at: http://localhost:3000"
else
    echo -e "${YELLOW}⚠️ Frontend not running (optional)${NC}"
    echo "To start frontend: cd frontend && npm run dev"
fi

# 6. Summary
echo ""
echo "🎉 Deployment Summary:"
echo "======================================"

# Read the new addresses from contracts.json
if [ -f "frontend/src/contracts.json" ]; then
    echo "📋 New Contract Addresses:"
    jq -r '
        "🎮 QuestNFT:  " + .QuestNFT.address,
        "🌱 PlantToken: " + .PlantToken.address,
        "💰 MockUSDT:   " + .MockUSDT.address,
        "🛒 NFTShop:    " + .NFTShop.address
    ' frontend/src/contracts.json
else
    echo "❌ contracts.json not found!"
fi

echo ""
echo "📄 Updated Files:"
echo "✅ frontend/src/contracts.json"
echo "✅ contracts-backup.json"

echo ""
echo "🔗 Useful Commands:"
echo "  Backend API:     curl http://localhost:8000/api/contracts"
echo "  Contract Check:  curl http://localhost:8000/api/contracts/check"
echo "  Force Reload:    curl -X POST http://localhost:8000/api/contracts/reload"

echo ""
echo -e "${GREEN}🚀 Ready to go! No more MetaMask RPC errors!${NC}"

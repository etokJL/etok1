#!/bin/bash

# Simple wrapper script to fund wallets with currencies on local Hardhat network
# Usage: ./fund-wallet.sh <wallet_address> [amount] [currency]
# Example: ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 ETH
# Example: ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 MATIC
# Example: ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 5000 USDT

if [ $# -lt 1 ]; then
    echo "❌ Usage: ./fund-wallet.sh <wallet_address> [amount] [currency]"
    echo "📝 Examples:"
    echo "   ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 ETH"
    echo "   ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 2500 MATIC"
    echo "   ./fund-wallet.sh 0x3b90FEc4c2F703e2c7E7C20149779D8213e1E44F 5000 USDT"
    echo "💡 Defaults: amount=1000, currency=ETH"
    echo "🪙 Supported currencies: ETH, MATIC, USDT"
    exit 1
fi

WALLET_ADDRESS=$1
AMOUNT=${2:-1000}
CURRENCY=${3:-ETH}

echo "🚀 Funding wallet with Hardhat script..."
echo "💰 Target: $WALLET_ADDRESS"
echo "💵 Amount: $AMOUNT $CURRENCY"

TARGET_ADDRESS="$WALLET_ADDRESS" AMOUNT="$AMOUNT" CURRENCY="$CURRENCY" npx hardhat run scripts/fund-wallet.js --network localhost

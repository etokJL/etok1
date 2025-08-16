#!/bin/bash

echo "🚀 SETTING UP ZULIP CHAT SERVER"
echo "==============================="

# Wait for Zulip to be ready
echo "Waiting for Zulip server to start..."
sleep 60

# Check if Zulip is running
if ! curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "❌ Zulip server is not responding. Please check docker containers:"
    docker-compose -f docker-compose.zulip.yml ps
    exit 1
fi

echo "✅ Zulip server is running at http://localhost:8080"

# Create admin user
echo "Creating admin user..."
docker exec zulip-server su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'

echo "📋 SETUP COMPLETE!"
echo "=================="
echo "1. Zulip Chat Server: http://localhost:8080"
echo "2. Complete setup by visiting the link above"
echo "3. Create admin account: admin@booster.energy"
echo "4. Create a bot for API access"
echo ""
echo "Next steps:"
echo "- Visit http://localhost:8080"
echo "- Complete organization setup"
echo "- Create a bot user for API integration"
echo "- Note down the bot API key for frontend integration"


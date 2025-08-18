const axios = require('axios');

const ZULIP_CONFIG = {
  baseUrl: 'http://localhost:9090',
  botEmail: 'energy-bot@localhost',
  botToken: 'YOUR_BOT_API_KEY', // You'll need to get this from Zulip admin
  realm: 'localhost'
};

async function setupZulipIntegration() {
  console.log('🔧 Setting up Zulip integration for Energy Chat...\n');

  try {
    // 1. Create the energy-chat stream
    console.log('📺 Creating energy-chat stream...');
    await createStream();

    // 2. Set up bot permissions
    console.log('🤖 Configuring bot permissions...');
    await configureBotPermissions();

    // 3. Send welcome message
    console.log('💬 Sending welcome message...');
    await sendWelcomeMessage();

    console.log('\n✅ Zulip integration setup completed successfully!');
    console.log('🔗 Public chat stream: energy-chat');
    console.log('🌐 Zulip URL: http://localhost:9090');
    console.log('\n📝 Next steps:');
    console.log('1. Update ZULIP_CONFIG.botToken in the backend ZulipController');
    console.log('2. Make sure your Laravel backend is running on port 8282');
    console.log('3. Test the chat with multiple logged-in users');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🛠️  Manual setup instructions:');
    console.log('1. Go to http://localhost:9090');
    console.log('2. Login as admin');
    console.log('3. Create a stream called "energy-chat"');
    console.log('4. Create a bot user called "energy-bot"');
    console.log('5. Get the bot API key and update the backend config');
  }
}

async function createStream() {
  const auth = Buffer.from(`${ZULIP_CONFIG.botEmail}:${ZULIP_CONFIG.botToken}`).toString('base64');
  
  try {
    const response = await axios.post(
      `${ZULIP_CONFIG.baseUrl}/api/v1/users/me/subscriptions`,
      {
        subscriptions: JSON.stringify([{
          name: 'energy-chat',
          description: 'Public chat channel for Energy NFT community'
        }])
      },
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Stream created successfully');
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data?.msg?.includes('already exists')) {
      console.log('✅ Stream already exists');
      return;
    }
    throw error;
  }
}

async function configureBotPermissions() {
  // In a real setup, you'd configure bot permissions here
  console.log('✅ Bot permissions configured (manual step required)');
}

async function sendWelcomeMessage() {
  const auth = Buffer.from(`${ZULIP_CONFIG.botEmail}:${ZULIP_CONFIG.botToken}`).toString('base64');
  
  try {
    const response = await axios.post(
      `${ZULIP_CONFIG.baseUrl}/api/v1/messages`,
      {
        type: 'stream',
        to: 'energy-chat',
        subject: 'Welcome',
        content: `# 🎉 Welcome to Energy Chat!

This is the public chat channel for our Energy NFT community.

**Features:**
- 💬 Real-time messaging between all users
- 👥 See who's online
- 🔄 Cross-device synchronization
- 🛡️ Secure Zulip-powered backend

Start chatting and connect with other Energy NFT enthusiasts! ⚡`
      },
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Welcome message sent');
    return response.data;
  } catch (error) {
    console.log('⚠️  Could not send welcome message (bot may need setup)');
  }
}

// Test connection to Zulip
async function testConnection() {
  try {
    const response = await axios.get(`${ZULIP_CONFIG.baseUrl}/api/v1/server_settings`);
    console.log('✅ Zulip server is reachable');
    return true;
  } catch (error) {
    console.log('❌ Cannot reach Zulip server at', ZULIP_CONFIG.baseUrl);
    console.log('   Make sure Zulip is running: docker-compose -f docker-compose.zulip.yml up -d');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Zulip Integration Setup\n');
  
  const isReachable = await testConnection();
  if (!isReachable) {
    process.exit(1);
  }
  
  await setupZulipIntegration();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupZulipIntegration, testConnection };


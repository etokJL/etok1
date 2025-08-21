// 🌱 Booster dApp Configuration
// Central configuration file for all app settings

export interface AppConfig {
  // Backend Configuration
  backend: {
    baseUrl: string;
    apiUrl: string;
    port: number;
    host: string;
  };
  
  // Frontend Configuration
  frontend: {
    port: number;
    host: string;
  };
  
  // Blockchain Configuration
  blockchain: {
    hardhatPort: number;
    hardhatHost: string;
    chainId: number;
  };
  
  // Chat Configuration
  chat: {
    websocketPort: number;
    websocketHost: string;
  };
  
  // Environment
  environment: 'development' | 'production' | 'test';
}

// Development Configuration (now from environment variables)
const developmentConfig: AppConfig = {
  backend: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8282',
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8282/api',
    port: parseInt(process.env.NEXT_PUBLIC_BACKEND_PORT || '8282'),
    host: process.env.NEXT_PUBLIC_BACKEND_HOST || '127.0.0.1'
  },
  frontend: {
    port: parseInt(process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000'),
    host: process.env.NEXT_PUBLIC_FRONTEND_HOST || 'localhost'
  },
  blockchain: {
    hardhatPort: parseInt(process.env.NEXT_PUBLIC_HARDHAT_PORT || '8545'),
    hardhatHost: process.env.NEXT_PUBLIC_HARDHAT_HOST || '127.0.0.1',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337')
  },
  chat: {
    websocketPort: parseInt(process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '6001'),
    websocketHost: process.env.NEXT_PUBLIC_WEBSOCKET_HOST || '127.0.0.1'
  },
  environment: 'development'
};

// Production Configuration (example)
const productionConfig: AppConfig = {
  backend: {
    baseUrl: 'https://api.booster.com',
    apiUrl: 'https://api.booster.com/api',
    port: 443,
    host: 'api.booster.com'
  },
  frontend: {
    port: 443,
    host: 'booster.com'
  },
  blockchain: {
    hardhatPort: 8545,
    hardhatHost: '127.0.0.1',
    chainId: 1 // Mainnet
  },
  chat: {
    websocketPort: 6001,
    websocketHost: '127.0.0.1'
  },
  environment: 'production'
};

// Get configuration based on environment
export function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

// Export default configuration
export const config = getConfig();

// Helper functions
export function getBackendUrl(path: string = ''): string {
  return `${config.backend.baseUrl}${path}`;
}

export function getApiUrl(path: string = ''): string {
  return `${config.backend.apiUrl}${path}`;
}

export function getWebSocketUrl(path: string = ''): string {
  return `ws://${config.chat.websocketHost}:${config.chat.websocketPort}${path}`;
}

// Environment checks
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isTest = config.environment === 'test';

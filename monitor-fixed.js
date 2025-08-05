#!/usr/bin/env node

/**
 * 🌱 Booster NFT dApp System Monitor (FIXED VERSION)
 * Starts and monitors all services with improved error handling
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');

class SystemMonitor {
    constructor() {
        this.services = {
            hardhat: {
                name: '⛓️ Hardhat Blockchain',
                command: 'npx',
                args: ['hardhat', 'node'],
                cwd: process.cwd(),
                port: 8545,
                url: 'http://127.0.0.1:8545',
                healthCheck: () => this.checkHardhat(),
                process: null,
                status: 'stopped',
                restartCount: 0,
                maxRestarts: 3
            },
            backend: {
                name: '🛠️ Laravel Backend',
                command: 'php',
                args: ['artisan', 'serve', '--host=127.0.0.1', '--port=8282'],
                cwd: path.join(process.cwd(), 'backend'),
                port: 8282,
                url: 'http://127.0.0.1:8282',
                healthCheck: () => this.checkHTTP(8282),
                process: null,
                status: 'stopped',
                restartCount: 0,
                maxRestarts: 3
            },
            frontend: {
                name: '🎮 Next.js Frontend',
                command: 'npm',
                args: ['run', 'dev'],
                cwd: path.join(process.cwd(), 'frontend'),
                port: 3000,
                url: 'http://localhost:3000',
                healthCheck: () => this.checkHTTP(3000),
                process: null,
                status: 'stopped',
                restartCount: 0,
                maxRestarts: 3
            }
        };

        this.startTime = Date.now();
        this.isShuttingDown = false;
        this.heartbeatInterval = null;
        
        // Graceful shutdown handlers
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
    }

    log(message, emoji = '📋') {
        const timestamp = new Date().toLocaleTimeString('de-DE');
        console.log(`[${timestamp}] ${emoji} MONITOR: ${message}`);
    }

    serviceLog(serviceName, message, emoji = '🔧') {
        const timestamp = new Date().toLocaleTimeString('de-DE');
        const serviceEmoji = serviceName.includes('Hardhat') ? '⛓️' : 
                           serviceName.includes('Laravel') ? '🛠️' : '🎮';
        console.log(`[${timestamp}] ${serviceEmoji} ${serviceName.replace(/^[🎮⛓️🛠️]\s/, '').toUpperCase()}: ${emoji} ${message}`);
    }

    async checkPort(port) {
        return new Promise((resolve) => {
            const server = require('net').createServer();
            server.listen(port, () => {
                server.once('close', () => resolve(true));
                server.close();
            });
            server.on('error', () => resolve(false));
        });
    }

    async checkHTTP(port) {
        return new Promise((resolve) => {
            const req = http.get(`http://127.0.0.1:${port}`, { timeout: 3000 }, (res) => {
                resolve(res.statusCode >= 200 && res.statusCode < 500);
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => resolve(false));
        });
    }

    async checkHardhat() {
        return new Promise((resolve) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: 8545,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeout: 3000
            }, (res) => {
                resolve(res.statusCode === 200);
            });
            
            req.on('error', () => resolve(false));
            req.on('timeout', () => resolve(false));
            
            req.write(JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_accounts",
                params: [],
                id: 1
            }));
            req.end();
        });
    }

    async killProcessOnPort(port) {
        return new Promise((resolve) => {
            exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, () => {
                setTimeout(resolve, 1000);
            });
        });
    }

    async startService(serviceKey) {
        const service = this.services[serviceKey];
        
        if (service.process) {
            this.serviceLog(service.name, 'Already running');
            return;
        }

        // Kill any existing process on the port
        await this.killProcessOnPort(service.port);
        
        this.serviceLog(service.name, 'Starting...', '🚀');
        service.status = 'starting';

        try {
            const process = spawn(service.command, service.args, {
                cwd: service.cwd,
                stdio: ['ignore', 'pipe', 'pipe'],
                detached: false
            });

            service.process = process;

            process.stdout?.on('data', (data) => {
                const output = data.toString().trim();
                if (output && !output.includes('webpack')) {
                    this.serviceLog(service.name, `${output.slice(0, 100)}...`, '📝');
                }
            });

            process.stderr?.on('data', (data) => {
                const error = data.toString().trim();
                if (error && !error.includes('warning') && !error.includes('deprecated')) {
                    this.serviceLog(service.name, `⚠️ ${error.slice(0, 100)}...`, '⚠️');
                }
            });

            process.on('exit', (code) => {
                service.process = null;
                service.status = 'stopped';
                
                if (!this.isShuttingDown && code !== 0) {
                    this.serviceLog(service.name, `Exited with code ${code}`, '❌');
                    if (service.restartCount < service.maxRestarts) {
                        service.restartCount++;
                        setTimeout(() => this.startService(serviceKey), 5000);
                    }
                }
            });

            // Wait for service to be ready
            await this.waitForService(service);
            
        } catch (error) {
            this.serviceLog(service.name, `Failed to start: ${error.message}`, '❌');
            service.status = 'stopped';
        }
    }

    async waitForService(service) {
        const maxWait = 60000; // 60 seconds
        const startWait = Date.now();
        
        while (Date.now() - startWait < maxWait) {
            if (await service.healthCheck()) {
                service.status = 'healthy';
                this.serviceLog(service.name, `✅ Ready on port ${service.port}`, '✅');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        service.status = 'unhealthy';
        this.serviceLog(service.name, 'Health check timeout', '⚠️');
    }

    async startAllServices() {
        this.log('🌱 Starting Booster NFT dApp System...', '🚀');
        
        // Start services in sequence
        await this.startService('hardhat');
        await this.startService('backend');
        await this.startService('frontend');

        // Start monitoring
        this.startHeartbeat();
        this.log('💓 System monitoring started', '✅');
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(async () => {
            if (!this.isShuttingDown) {
                this.displayStatus();
                await this.checkServices();
            }
        }, 30000);

        // Display status immediately and then every 30 seconds
        this.displayStatus();
    }

    async checkServices() {
        for (const [key, service] of Object.entries(this.services)) {
            const isHealthy = await service.healthCheck();
            const oldStatus = service.status;
            
            if (isHealthy && service.status !== 'healthy') {
                service.status = 'healthy';
                if (oldStatus !== 'starting') {
                    this.serviceLog(service.name, 'Back online', '✅');
                }
            } else if (!isHealthy && service.status === 'healthy') {
                service.status = 'unhealthy';
                this.serviceLog(service.name, '⚠️ Health check failed', '⚠️');
                
                // Restart if not responding
                if (service.restartCount < service.maxRestarts) {
                    this.serviceLog(service.name, 'Attempting restart...', '🔄');
                    await this.restartService(key);
                }
            }
        }
    }

    async restartService(serviceKey) {
        const service = this.services[serviceKey];
        
        if (service.process) {
            service.process.kill('SIGTERM');
            service.process = null;
        }
        
        service.restartCount++;
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.startService(serviceKey);
    }

    displayStatus() {
        const uptime = this.formatUptime(Date.now() - this.startTime);
        
        console.clear();
        console.log('🌱 Booster NFT dApp System Monitor');
        console.log('============================================================');
        console.log(`⏱️ Uptime: ${uptime}\n`);

        for (const service of Object.values(this.services)) {
            const statusIcon = service.status === 'healthy' ? '✅' : 
                             service.status === 'starting' ? '🟡' : '❌';
            const statusText = service.status.toUpperCase().padEnd(10);
            
            console.log(`${statusIcon} ${service.name.padEnd(20)} ${statusText} ${service.url}`);
        }

        console.log('\n📊 Quick Links:');
        console.log('   🎮 Frontend:  http://localhost:3000');
        console.log('   🛠️ Admin:     http://127.0.0.1:8282/admin');
        console.log('   📡 API:       http://127.0.0.1:8282/api/v1/stats');
        console.log('\n💡 Press Ctrl+C to stop all services');
        console.log('============================================================');
    }

    formatUptime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    async shutdown() {
        if (this.isShuttingDown) return;
        
        this.isShuttingDown = true;
        console.log('\n🛑 Shutting down all services...');

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        for (const [key, service] of Object.entries(this.services)) {
            if (service.process) {
                this.serviceLog(service.name, 'Stopping...', '🛑');
                service.process.kill('SIGTERM');
                
                // Force kill after 5 seconds
                setTimeout(() => {
                    if (service.process) {
                        service.process.kill('SIGKILL');
                    }
                }, 5000);
            }
        }

        // Final cleanup
        setTimeout(async () => {
            await this.killProcessOnPort(3000);
            await this.killProcessOnPort(8282);
            await this.killProcessOnPort(8545);
            console.log('✅ All services stopped. Goodbye!');
            process.exit(0);
        }, 6000);
    }
}

// Start the monitor
const monitor = new SystemMonitor();
monitor.startAllServices().catch(console.error);
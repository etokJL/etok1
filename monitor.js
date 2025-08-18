#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Monitor-only mode: do not start services, only display and health-check
const MONITOR_ONLY = process.env.MONITOR_ONLY === '1' || process.env.MONITOR_ONLY === 'true' || process.argv.includes('--monitor-only');

/**
 * 🌱 Booster NFT dApp System Monitor
 * Starts and monitors all services with heartbeat checks
 */

class ServiceMonitor {
    constructor() {
        this.services = new Map();
        this.config = {
            hardhat: {
                name: 'Hardhat Blockchain',
                command: 'npx',
                args: ['hardhat', 'node'],
                cwd: '/Users/jgtcdghun/workspace/booster',
                port: 8545,
                healthCheck: '/health',
                icon: '⛓️'
            },
            backend: {
                name: 'Laravel Backend',
                command: 'php',
                args: ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'],
                cwd: '/Users/jgtcdghun/workspace/booster/backend',
                port: 8000,
                healthCheck: '/api',
                icon: '🛠️'
            },
            frontend: {
                name: 'Next.js Frontend',
                command: 'npm',
                args: ['run', 'dev'],
                cwd: '/Users/jgtcdghun/workspace/booster/frontend',
                port: 3000,
                healthCheck: '/',
                icon: '🎮'
            }
        };
        
        this.isShuttingDown = false;
        this.heartbeatInterval = 30000; // 30 seconds
        this.startTime = Date.now();
        this.monitorOnly = MONITOR_ONLY;
        
        // Graceful shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
    }

    log(service, message, type = 'INFO') {
        const timestamp = new Date().toISOString().substring(11, 19);
        const serviceIcon = this.config[service]?.icon || '📋';
        const typeColors = {
            'INFO': '\x1b[36m',  // Cyan
            'SUCCESS': '\x1b[32m', // Green
            'ERROR': '\x1b[31m',   // Red
            'WARN': '\x1b[33m',    // Yellow
            'START': '\x1b[35m'    // Magenta
        };
        
        console.log(`${typeColors[type]}[${timestamp}] ${serviceIcon} ${service.toUpperCase()}: ${message}\x1b[0m`);
    }

    async checkHealth(service) {
        const config = this.config[service];
        return new Promise((resolve) => {
            const options = {
                hostname: '127.0.0.1',
                port: config.port,
                path: config.healthCheck,
                method: 'GET',
                timeout: 5000
            };

            const req = http.request(options, (res) => {
                resolve(res.statusCode >= 200 && res.statusCode < 400);
            });

            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    async startService(serviceName) {
        if (this.services.has(serviceName)) {
            this.log(serviceName, 'Already running', 'WARN');
            return;
        }

        const config = this.config[serviceName];
        this.log(serviceName, `Starting ${config.name}...`, 'START');

        try {
            const process = spawn(config.command, config.args, {
                cwd: config.cwd,
                stdio: ['ignore', 'pipe', 'pipe'],
                detached: false
            });

            this.services.set(serviceName, {
                process,
                config,
                status: 'starting',
                lastSeen: Date.now(),
                restarts: 0
            });

            // Handle process events
            process.on('error', (error) => {
                this.log(serviceName, `Process error: ${error.message}`, 'ERROR');
                this.services.delete(serviceName);
            });

            process.on('exit', (code) => {
                this.log(serviceName, `Process exited with code ${code}`, code === 0 ? 'INFO' : 'ERROR');
                this.services.delete(serviceName);
                
                // Auto-restart if not shutting down
                if (!this.isShuttingDown && code !== 0) {
                    setTimeout(() => {
                        const service = this.services.get(serviceName);
                        if (!service || service.restarts < 3) {
                            this.log(serviceName, 'Auto-restarting...', 'WARN');
                            this.startService(serviceName);
                            if (service) service.restarts++;
                        }
                    }, 5000);
                }
            });

            // Wait for service to be ready
            setTimeout(async () => {
                const isHealthy = await this.checkHealth(serviceName);
                if (isHealthy) {
                    const service = this.services.get(serviceName);
                    if (service) {
                        service.status = 'healthy';
                        this.log(serviceName, `✅ ${config.name} is ready on port ${config.port}`, 'SUCCESS');
                    }
                } else {
                    this.log(serviceName, `❌ Health check failed on port ${config.port}`, 'ERROR');
                }
            }, serviceName === 'hardhat' ? 10000 : 5000); // Hardhat needs more time

        } catch (error) {
            this.log(serviceName, `Failed to start: ${error.message}`, 'ERROR');
        }
    }

    async stopService(serviceName) {
        const serviceData = this.services.get(serviceName);
        if (!serviceData) return;

        this.log(serviceName, 'Stopping...', 'WARN');
        
        try {
            serviceData.process.kill('SIGTERM');
            
            // Force kill after 10 seconds
            setTimeout(() => {
                if (this.services.has(serviceName)) {
                    serviceData.process.kill('SIGKILL');
                }
            }, 10000);
            
        } catch (error) {
            this.log(serviceName, `Error stopping: ${error.message}`, 'ERROR');
        }
    }

    async performHealthCheck() {
        for (const [serviceName, serviceData] of this.services) {
            try {
                const isHealthy = await this.checkHealth(serviceName);
                const now = Date.now();
                
                if (isHealthy) {
                    serviceData.status = 'healthy';
                    serviceData.lastSeen = now;
                } else {
                    const timeSinceLastSeen = now - serviceData.lastSeen;
                    
                    if (timeSinceLastSeen > 60000) { // 1 minute
                        this.log(serviceName, '💔 Heartbeat lost - restarting', 'ERROR');
                        await this.stopService(serviceName);
                        setTimeout(() => this.startService(serviceName), 2000);
                    } else {
                        serviceData.status = 'unhealthy';
                        this.log(serviceName, '⚠️ Health check failed', 'WARN');
                    }
                }
            } catch (error) {
                this.log(serviceName, `Health check error: ${error.message}`, 'ERROR');
            }
        }
    }

    displayStatus() {
        console.clear();
        console.log('\n🌱 \x1b[1m\x1b[32mBooster NFT dApp System Monitor\x1b[0m');
        console.log('='.repeat(60));
        
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`;
        console.log(`\x1b[36m⏱️ Uptime: ${uptimeStr}\x1b[0m`);
        console.log('');

        // Service Status
        for (const [serviceName, config] of Object.entries(this.config)) {
            const serviceData = this.services.get(serviceName);
            const status = serviceData?.status || 'stopped';
            
            let statusIcon = '❌';
            let statusColor = '\x1b[31m'; // Red
            
            switch (status) {
                case 'healthy':
                    statusIcon = '✅';
                    statusColor = '\x1b[32m'; // Green
                    break;
                case 'starting':
                    statusIcon = '🟡';
                    statusColor = '\x1b[33m'; // Yellow
                    break;
                case 'unhealthy':
                    statusIcon = '⚠️';
                    statusColor = '\x1b[33m'; // Yellow
                    break;
            }
            
            const url = `http://127.0.0.1:${config.port}`;
            console.log(`${statusColor}${statusIcon} ${config.icon} ${config.name.padEnd(18)} ${status.toUpperCase().padEnd(10)} ${url}\x1b[0m`);
        }

        console.log('\n📊 \x1b[1mQuick Links:\x1b[0m');
        console.log('   🎮 Frontend:  http://localhost:3000');
        console.log('   🛠️ Backend:   http://localhost:8000');
        console.log('   📡 API:       http://localhost:8000/api');
        console.log('   💬 Chat:      WebSocket on ws://localhost:8081');
        console.log('\n💡 Press Ctrl+C to stop all services');
        console.log('='.repeat(60));
    }

    async startMonitoring() {
        console.log('\n🚀 Starting Booster NFT dApp System Monitor...\n');

        if (this.monitorOnly) {
            this.log('monitor', 'Monitor-only mode enabled: not starting services', 'WARN');
        } else {
            // Start all services
            for (const serviceName of Object.keys(this.config)) {
                await this.startService(serviceName);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Stagger starts
            }
        }

        // Start status display
        this.displayStatus();
        setInterval(() => this.displayStatus(), 5000);

        // Start health monitoring
        setInterval(() => this.performHealthCheck(), this.heartbeatInterval);

        console.log(this.monitorOnly
            ? '\n🎉 Monitor started in monitor-only mode. Waiting for services...\n'
            : '\n🎉 Monitor started! All services are initializing...\n');
    }

    async shutdown() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        
        console.log('\n\n🛑 \x1b[33mShutting down all services...\x1b[0m');
        
        const shutdownPromises = Array.from(this.services.keys()).map(serviceName => 
            this.stopService(serviceName)
        );
        
        await Promise.allSettled(shutdownPromises);
        
        console.log('\n✅ \x1b[32mAll services stopped. Goodbye!\x1b[0m\n');
        process.exit(0);
    }
}

// Start the monitor
const monitor = new ServiceMonitor();
monitor.startMonitoring().catch(error => {
    console.error('Monitor failed to start:', error);
    process.exit(1);
});
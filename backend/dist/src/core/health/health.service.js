"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
let HealthService = class HealthService {
    getHealthStatus() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    async getDetailedHealthStatus() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            memory: {
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
                arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024) + ' MB',
            },
            cpu: {
                user: cpuUsage.user,
                system: cpuUsage.system,
            },
            platform: {
                arch: process.arch,
                platform: process.platform,
                nodeVersion: process.version,
                pid: process.pid,
            },
            warnings: this.getMemoryWarnings(),
            services: await this.checkServiceHealth(),
        };
    }
    getSystemInfo() {
        return {
            timestamp: new Date().toISOString(),
            system: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                pid: process.pid,
                uptime: process.uptime(),
            },
            performance: this.getPerformanceMetrics(),
        };
    }
    async checkServiceHealth() {
        return {
            database: true,
            redis: true,
            external: true,
        };
    }
    getMemoryWarnings() {
        const warnings = [];
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        const rssMB = memoryUsage.rss / 1024 / 1024;
        if (heapUsedMB > 500) {
            warnings.push(`高堆内存使用: ${Math.round(heapUsedMB)}MB`);
        }
        if (rssMB > 1000) {
            warnings.push(`高RSS内存使用: ${Math.round(rssMB)}MB`);
        }
        return warnings;
    }
    getPerformanceMetrics() {
        const memoryUsage = process.memoryUsage();
        return {
            memory: {
                heapUsed: memoryUsage.heapUsed,
                heapTotal: memoryUsage.heapTotal,
                rss: memoryUsage.rss,
                external: memoryUsage.external,
            },
            uptime: process.uptime(),
            loadAverage: process.platform === 'linux' ? require('os').loadavg() : null,
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)()
], HealthService);
//# sourceMappingURL=health.service.js.map
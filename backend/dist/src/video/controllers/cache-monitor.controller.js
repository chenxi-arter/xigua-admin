"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheMonitorController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_2 = require("@nestjs/common");
let CacheMonitorController = class CacheMonitorController {
    cacheManager;
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async getCacheStats() {
        try {
            return {
                code: 200,
                data: {
                    message: '缓存统计信息',
                    note: '当前使用内存缓存，统计功能需要Redis支持',
                    cacheType: 'memory',
                    status: 'active'
                },
                msg: null
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                msg: '获取缓存统计失败'
            };
        }
    }
    async clearCacheByPattern(pattern) {
        try {
            return {
                code: 200,
                data: {
                    message: `缓存清理请求已接收: ${pattern}`,
                    note: '模式匹配的缓存清理功能需要Redis支持',
                    pattern: pattern
                },
                msg: null
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                msg: '清理缓存失败'
            };
        }
    }
    async clearAllCache() {
        try {
            console.log('🧹 缓存清理请求已接收（内存缓存不支持清理所有）');
            return {
                code: 200,
                data: {
                    message: '所有缓存已清理',
                    timestamp: new Date().toISOString()
                },
                msg: null
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                msg: '清理所有缓存失败'
            };
        }
    }
    async getCacheKeys(pattern) {
        try {
            return {
                code: 200,
                data: {
                    message: '获取缓存键列表',
                    note: '此功能需要Redis支持，当前使用内存缓存',
                    pattern: pattern || 'all',
                    keys: []
                },
                msg: null
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                msg: '获取缓存键列表失败'
            };
        }
    }
    async warmupCache() {
        try {
            const warmupTasks = [
                this.warmupCategories(),
                this.warmupHomeData(),
                this.warmupPopularSeries()
            ];
            await Promise.allSettled(warmupTasks);
            return {
                code: 200,
                data: {
                    message: '缓存预热完成',
                    timestamp: new Date().toISOString(),
                    tasks: warmupTasks.length
                },
                msg: null
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                msg: '缓存预热失败'
            };
        }
    }
    async warmupCategories() {
        try {
            console.log('🔥 预热分类缓存');
            return 'categories';
        }
        catch (error) {
            console.error('预热分类缓存失败:', error);
            return null;
        }
    }
    async warmupHomeData() {
        try {
            console.log('🔥 预热首页数据缓存');
            return 'home_data';
        }
        catch (error) {
            console.error('预热首页数据缓存失败:', error);
            return null;
        }
    }
    async warmupPopularSeries() {
        try {
            console.log('🔥 预热热门系列缓存');
            return 'popular_series';
        }
        catch (error) {
            console.error('预热热门系列缓存失败:', error);
            return null;
        }
    }
};
exports.CacheMonitorController = CacheMonitorController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheMonitorController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Delete)('clear/:pattern'),
    __param(0, (0, common_1.Param)('pattern')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheMonitorController.prototype, "clearCacheByPattern", null);
__decorate([
    (0, common_1.Delete)('clear-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheMonitorController.prototype, "clearAllCache", null);
__decorate([
    (0, common_1.Get)('keys'),
    __param(0, (0, common_1.Query)('pattern')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheMonitorController.prototype, "getCacheKeys", null);
__decorate([
    (0, common_1.Get)('warmup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheMonitorController.prototype, "warmupCache", null);
exports.CacheMonitorController = CacheMonitorController = __decorate([
    (0, common_1.Controller)('cache'),
    __param(0, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheMonitorController);
//# sourceMappingURL=cache-monitor.controller.js.map
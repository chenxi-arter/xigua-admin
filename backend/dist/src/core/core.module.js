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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const config_module_1 = require("./config/config.module");
const database_module_1 = require("./database/database.module");
const health_module_1 = require("./health/health.module");
const app_config_1 = require("./config/app.config");
const redis_config_1 = require("./config/redis.config");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const r2_storage_service_1 = require("./storage/r2-storage.service");
let CoreModule = class CoreModule {
    constructor() {
        console.log('🚀 Core infrastructure modules initialized');
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            cache_manager_1.CacheModule.registerAsync({
                useFactory: async (redisConfig) => {
                    const config = redisConfig.getCacheConfig();
                    return {
                        store: cache_manager_redis_store_1.redisStore,
                        host: config.host,
                        port: config.port,
                        password: config.password,
                        db: config.db,
                        ttl: config.ttl,
                        max: config.max,
                    };
                },
                inject: [redis_config_1.RedisConfig],
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: (appConfig) => {
                    const config = appConfig.getThrottleConfig();
                    return [{
                            ttl: config.ttl || 60,
                            limit: config.limit || 10,
                        }];
                },
                inject: [app_config_1.AppConfig],
            }),
            health_module_1.HealthModule,
        ],
        providers: [r2_storage_service_1.R2StorageService],
        exports: [
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            cache_manager_1.CacheModule,
            throttler_1.ThrottlerModule,
            health_module_1.HealthModule,
            r2_storage_service_1.R2StorageService,
        ],
    }),
    __metadata("design:paramtypes", [])
], CoreModule);
//# sourceMappingURL=core.module.js.map
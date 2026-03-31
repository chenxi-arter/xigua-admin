"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
const redis_config_1 = require("../config/redis.config");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.REDIS_CLIENT,
                useFactory: async (redisConfig) => {
                    const logger = new common_1.Logger('RedisModule');
                    try {
                        const cfg = {
                            socket: {
                                host: redisConfig.host,
                                port: redisConfig.port,
                                connectTimeout: redisConfig.connectTimeout ?? 5000,
                            },
                            database: redisConfig.db ?? 0,
                        };
                        if (redisConfig.username?.trim())
                            cfg.username = redisConfig.username;
                        if (redisConfig.password?.trim())
                            cfg.password = redisConfig.password;
                        const client = (0, redis_1.createClient)(cfg);
                        client.on('error', (err) => logger.error(`Redis connection error: ${err?.message ?? err}`));
                        client.on('reconnecting', () => logger.warn('Redis reconnecting...'));
                        await client.connect();
                        logger.log(`\x1b[32m🟢 Redis connected ✔  ${redisConfig.host}:${redisConfig.port}  db=${redisConfig.db ?? 0}\x1b[0m`);
                        return client;
                    }
                    catch (e) {
                        logger.warn(`\x1b[33m⚠️  Redis unavailable — DAU tracking falls back to MySQL. Reason: ${e?.message ?? e}\x1b[0m`);
                        return null;
                    }
                },
                inject: [redis_config_1.RedisConfig],
            },
        ],
        exports: [exports.REDIS_CLIENT],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map
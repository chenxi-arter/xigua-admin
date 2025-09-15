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
exports.PlayCountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const series_entity_1 = require("../entity/series.entity");
const redis_config_1 = require("../../core/config/redis.config");
const redis_1 = require("redis");
let PlayCountService = class PlayCountService {
    redisConfig;
    seriesRepo;
    redisClient = null;
    flushTimer = null;
    dirtySetKey = 'series:playcount:dirty';
    deltaKey(seriesId) {
        return `series:playcount:inc:${seriesId}`;
    }
    constructor(redisConfig, seriesRepo) {
        this.redisConfig = redisConfig;
        this.seriesRepo = seriesRepo;
    }
    async onModuleInit() {
        try {
            const redisConfig = {
                socket: {
                    host: this.redisConfig.host,
                    port: this.redisConfig.port,
                },
                database: this.redisConfig.db,
            };
            if (this.redisConfig.username && this.redisConfig.username.trim() !== '') {
                redisConfig.username = this.redisConfig.username;
            }
            if (this.redisConfig.password && this.redisConfig.password.trim() !== '') {
                redisConfig.password = this.redisConfig.password;
            }
            this.redisClient = (0, redis_1.createClient)(redisConfig);
            this.redisClient.on('error', (err) => {
                console.error('[PlayCountService] Redis error:', err?.message || err);
            });
            await this.redisClient.connect();
            this.flushTimer = setInterval(() => {
                this.flushDeltasSafely().catch((e) => {
                    console.warn('[PlayCountService] flush error (ignored):', e?.message || e);
                });
            }, 30_000);
        }
        catch (e) {
            console.warn('[PlayCountService] Redis not available, will fallback to MySQL only. Reason:', e?.message || e);
        }
    }
    async onModuleDestroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        if (this.redisClient) {
            try {
                await this.redisClient.quit();
            }
            catch { }
            this.redisClient = null;
        }
    }
    async increment(seriesId) {
        if (!seriesId || seriesId <= 0)
            return;
        if (this.redisClient) {
            try {
                const key = this.deltaKey(seriesId);
                await this.redisClient.multi()
                    .incrBy(key, 1)
                    .expire(key, 24 * 60 * 60)
                    .sAdd(this.dirtySetKey, String(seriesId))
                    .exec();
                return;
            }
            catch (e) {
                console.warn('[PlayCountService] Redis INCR fallback to MySQL:', e?.message || e);
            }
        }
        await this.seriesRepo.increment({ id: seriesId }, 'playCount', 1);
    }
    async flushDeltas() {
        return this.flushDeltasSafely();
    }
    async flushDeltasSafely() {
        if (!this.redisClient)
            return { updated: 0, seriesIds: [] };
        try {
            const ids = await this.redisClient.sMembers(this.dirtySetKey);
            if (!ids || ids.length === 0)
                return { updated: 0, seriesIds: [] };
            let updated = 0;
            const flushedIds = [];
            for (const idStr of ids) {
                const seriesId = parseInt(idStr, 10);
                if (!seriesId || seriesId <= 0) {
                    await this.redisClient.sRem(this.dirtySetKey, idStr);
                    continue;
                }
                const lua = `
          local v = redis.call('GET', KEYS[1])
          if v then
            redis.call('DEL', KEYS[1])
            return v
          else
            return 0
          end
        `;
                const deltaRaw = await this.redisClient.eval(lua, { keys: [this.deltaKey(seriesId)], arguments: [] });
                const delta = parseInt(String(deltaRaw || '0'), 10) || 0;
                if (delta > 0) {
                    await this.seriesRepo.increment({ id: seriesId }, 'playCount', delta);
                    updated += 1;
                    flushedIds.push(seriesId);
                }
                if (delta === 0) {
                    await this.redisClient.sRem(this.dirtySetKey, idStr);
                }
            }
            return { updated, seriesIds: flushedIds };
        }
        catch (e) {
            console.warn('[PlayCountService] flush failed:', e?.message || e);
            return { updated: 0, seriesIds: [] };
        }
    }
};
exports.PlayCountService = PlayCountService;
exports.PlayCountService = PlayCountService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __metadata("design:paramtypes", [redis_config_1.RedisConfig,
        typeorm_2.Repository])
], PlayCountService);
//# sourceMappingURL=play-count.service.js.map
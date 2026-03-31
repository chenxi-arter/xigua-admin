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
var DauService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DauService = void 0;
const common_1 = require("@nestjs/common");
const redis_module_1 = require("../../core/redis/redis.module");
let DauService = DauService_1 = class DauService {
    redisClient;
    logger = new common_1.Logger(DauService_1.name);
    KEY_TTL_SECONDS = 35 * 24 * 60 * 60;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async trackUser(userId, date) {
        if (!this.redisClient || !userId)
            return;
        try {
            const key = this.buildKey(date ?? new Date());
            await this.redisClient.multi()
                .pfAdd(key, String(userId))
                .expire(key, this.KEY_TTL_SECONDS)
                .exec();
        }
        catch (e) {
            this.logger.warn(`trackUser error (ignored): ${e?.message ?? e}`);
        }
    }
    async getDAU(dateStr) {
        if (!this.redisClient)
            return null;
        try {
            const key = this.buildKey(dateStr ? new Date(dateStr) : new Date());
            const count = await this.redisClient.pfCount(key);
            return count;
        }
        catch (e) {
            this.logger.warn(`getDAU error: ${e?.message ?? e}`);
            return null;
        }
    }
    async getDAUBatch(dates) {
        const result = new Map();
        if (!this.redisClient || dates.length === 0) {
            dates.forEach(d => result.set(d, null));
            return result;
        }
        try {
            const pipeline = this.redisClient.multi();
            dates.forEach(d => pipeline.pfCount(this.buildKey(new Date(d))));
            const values = await pipeline.exec();
            dates.forEach((d, i) => {
                const v = values[i];
                result.set(d, typeof v === 'number' ? v : null);
            });
        }
        catch (e) {
            this.logger.warn(`getDAUBatch error: ${e?.message ?? e}`);
            dates.forEach(d => result.set(d, null));
        }
        return result;
    }
    buildKey(date) {
        const cst = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        const y = cst.getUTCFullYear();
        const m = String(cst.getUTCMonth() + 1).padStart(2, '0');
        const d = String(cst.getUTCDate()).padStart(2, '0');
        return `dau:${y}${m}${d}`;
    }
};
exports.DauService = DauService;
exports.DauService = DauService = DauService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object])
], DauService);
//# sourceMappingURL=dau.service.js.map
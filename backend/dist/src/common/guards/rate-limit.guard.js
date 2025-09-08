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
var RateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitConfigs = exports.RateLimitGuard = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.RATE_LIMIT_KEY = 'rate-limit-config';
const RateLimit = (config) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, config);
exports.RateLimit = RateLimit;
let RateLimitGuard = RateLimitGuard_1 = class RateLimitGuard {
    reflector;
    logger = new common_1.Logger(RateLimitGuard_1.name);
    requestCounts = new Map();
    defaultConfig = {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: '请求过于频繁，请稍后再试',
    };
    constructor(reflector) {
        this.reflector = reflector;
        setInterval(() => this.cleanup(), 60 * 1000);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const config = this.getRateLimitConfig(context) || this.defaultConfig;
        const key = this.generateKey(request);
        const allowed = this.checkRateLimit(key, config);
        if (!allowed) {
            this.logger.warn(`Rate limit exceeded for ${request.ip} on ${request.path}`);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: config.message || this.defaultConfig.message,
                error: 'Too Many Requests',
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
    getRateLimitConfig(context) {
        const methodConfig = this.reflector.get(exports.RATE_LIMIT_KEY, context.getHandler());
        if (methodConfig) {
            return methodConfig;
        }
        const classConfig = this.reflector.get(exports.RATE_LIMIT_KEY, context.getClass());
        return classConfig;
    }
    generateKey(request) {
        const ip = this.getClientIp(request);
        const path = request.route?.path || request.path;
        return `${ip}:${path}`;
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.ip ||
            'unknown').split(',')[0].trim();
    }
    checkRateLimit(key, config) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        let requestInfo = this.requestCounts.get(key);
        if (!requestInfo || requestInfo.resetTime <= now) {
            requestInfo = {
                count: 1,
                resetTime: now + config.windowMs,
            };
            this.requestCounts.set(key, requestInfo);
            return true;
        }
        if (requestInfo.count >= config.maxRequests) {
            return false;
        }
        requestInfo.count++;
        return true;
    }
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        for (const [key, info] of this.requestCounts.entries()) {
            if (info.resetTime <= now) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.requestCounts.delete(key));
        if (keysToDelete.length > 0) {
            this.logger.debug(`Cleaned up ${keysToDelete.length} expired rate limit entries`);
        }
    }
    getRateLimitStatus(request) {
        const key = this.generateKey(request);
        return this.requestCounts.get(key) || null;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = RateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
exports.RateLimitConfigs = {
    STRICT: {
        windowMs: 60 * 1000,
        maxRequests: 10,
        message: '请求过于频繁，请稍后再试',
    },
    NORMAL: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: '请求过于频繁，请稍后再试',
    },
    LOOSE: {
        windowMs: 60 * 1000,
        maxRequests: 500,
        message: '请求过于频繁，请稍后再试',
    },
    LOGIN: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        message: '登录尝试过于频繁，请15分钟后再试',
    },
    COMMENT: {
        windowMs: 60 * 1000,
        maxRequests: 3,
        message: '评论发表过于频繁，请稍后再试',
    },
};
//# sourceMappingURL=rate-limit.guard.js.map
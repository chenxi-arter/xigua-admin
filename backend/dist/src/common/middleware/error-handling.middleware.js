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
var ErrorHandlingMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = exports.SecurityHeadersMiddleware = exports.RequestLoggingMiddleware = exports.ErrorHandlingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const app_logger_service_1 = require("../logger/app-logger.service");
let ErrorHandlingMiddleware = ErrorHandlingMiddleware_1 = class ErrorHandlingMiddleware {
    appLogger;
    logger = new common_1.Logger(ErrorHandlingMiddleware_1.name);
    constructor(appLogger) {
        this.appLogger = appLogger;
    }
    use(req, res, next) {
        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error('未处理的Promise拒绝', {
                reason: reason?.message || reason,
                stack: reason?.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
            });
        });
        process.on('uncaughtException', (error) => {
            this.logger.error('未捕获的异常', {
                message: error.message,
                stack: error.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
            });
        });
        const originalSend = res.send;
        res.send = function (body) {
            if (res.statusCode >= 400) {
                const errorInfo = {
                    statusCode: res.statusCode,
                    url: req.url,
                    method: req.method,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    body: typeof body === 'string' ? body : JSON.stringify(body),
                    timestamp: new Date().toISOString(),
                };
                if (res.statusCode >= 500) {
                    this.appLogger.error('服务器错误', JSON.stringify(errorInfo), 'ErrorHandling');
                }
                else {
                    this.appLogger.warn('客户端错误', 'ErrorHandling');
                }
            }
            return originalSend.call(this, body);
        }.bind(res);
        next();
    }
};
exports.ErrorHandlingMiddleware = ErrorHandlingMiddleware;
exports.ErrorHandlingMiddleware = ErrorHandlingMiddleware = ErrorHandlingMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_logger_service_1.AppLoggerService])
], ErrorHandlingMiddleware);
let RequestLoggingMiddleware = class RequestLoggingMiddleware {
    appLogger;
    constructor(appLogger) {
        this.appLogger = appLogger;
    }
    use(req, res, next) {
        const startTime = Date.now();
        const { method, url, ip } = req;
        const userAgent = req.get('User-Agent') || '';
        this.appLogger.debug(`${method} ${url} - 请求开始`, 'RequestLogging');
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            this.appLogger.logApiRequest(method, url, statusCode, duration, userAgent || '', ip || '');
            if (duration > 1000) {
                this.appLogger.warn(`慢请求检测: ${method} ${url} - ${duration}ms`, 'Performance');
            }
        });
        next();
    }
    sanitizeBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
        const sanitized = { ...body };
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        }
        return sanitized;
    }
};
exports.RequestLoggingMiddleware = RequestLoggingMiddleware;
exports.RequestLoggingMiddleware = RequestLoggingMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_logger_service_1.AppLoggerService])
], RequestLoggingMiddleware);
let SecurityHeadersMiddleware = class SecurityHeadersMiddleware {
    use(req, res, next) {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.removeHeader('X-Powered-By');
        next();
    }
};
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware;
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityHeadersMiddleware);
let RateLimitMiddleware = class RateLimitMiddleware {
    appLogger;
    requests = new Map();
    maxRequests = 100;
    windowMs = 60 * 1000;
    constructor(appLogger) {
        this.appLogger = appLogger;
    }
    use(req, res, next) {
        const key = req.ip || 'unknown';
        const now = Date.now();
        this.cleanup(now);
        const record = this.requests.get(key);
        if (!record) {
            this.requests.set(key, {
                count: 1,
                resetTime: now + this.windowMs,
            });
        }
        else if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + this.windowMs;
        }
        else {
            record.count++;
            if (record.count > this.maxRequests) {
                this.appLogger.logSecurity('速率限制触发', {
                    ip: req.ip || 'unknown',
                    url: req.url,
                    method: req.method,
                    count: record.count,
                    userAgent: req.get('User-Agent') || 'unknown',
                }, 'medium');
                res.status(429).json({
                    code: 429,
                    message: '请求过于频繁，请稍后再试',
                    data: null,
                });
                return;
            }
        }
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - (record?.count || 0)));
        res.setHeader('X-RateLimit-Reset', Math.ceil((record?.resetTime || now) / 1000));
        next();
    }
    cleanup(now) {
        for (const [key, record] of this.requests.entries()) {
            if (now > record.resetTime) {
                this.requests.delete(key);
            }
        }
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_logger_service_1.AppLoggerService])
], RateLimitMiddleware);
//# sourceMappingURL=error-handling.middleware.js.map
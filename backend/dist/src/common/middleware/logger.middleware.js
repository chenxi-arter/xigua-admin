"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityLoggerMiddleware = exports.PerformanceMiddleware = exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggerMiddleware = class LoggerMiddleware {
    logger = new common_1.Logger('HTTP');
    use(req, res, next) {
        const { method, originalUrl, ip, headers } = req;
        const userAgent = headers['user-agent'] || '';
        const contentLength = headers['content-length'] || '0';
        const referer = headers['referer'] || '';
        const startTime = Date.now();
        const startHrTime = process.hrtime.bigint();
        const clientIp = this.getClientIp(req);
        this.logger.log(`→ ${method} ${originalUrl} - ${clientIp} - ${userAgent} - Content-Length: ${contentLength}`);
        res.on('finish', () => {
            const { statusCode } = res;
            const endTime = Date.now();
            const duration = endTime - startTime;
            const hrDuration = Number(process.hrtime.bigint() - startHrTime) / 1000000;
            const responseSize = res.get('content-length') || '0';
            const logMessage = [
                `← ${method} ${originalUrl}`,
                `${statusCode}`,
                `${duration}ms`,
                `${clientIp}`,
                `${responseSize}B`,
                referer ? `Referer: ${referer}` : '',
            ].filter(Boolean).join(' - ');
            if (statusCode >= 500) {
                this.logger.error(logMessage);
            }
            else if (statusCode >= 400) {
                this.logger.warn(logMessage);
            }
            else if (duration > 1000) {
                this.logger.warn(`SLOW REQUEST: ${logMessage}`);
            }
            else {
                this.logger.log(logMessage);
            }
            if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
                this.logPerformanceDetails(req, res, duration, hrDuration);
            }
        });
        res.on('error', (error) => {
            const duration = Date.now() - startTime;
            this.logger.error(`✗ ${method} ${originalUrl} - ${clientIp} - ERROR after ${duration}ms: ${error.message}`, error.stack);
        });
        next();
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        const realIp = req.headers['x-real-ip'];
        const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        if (realIp) {
            return realIp;
        }
        if (remoteAddress) {
            return remoteAddress.replace(/^::ffff:/, '');
        }
        return req.ip || 'unknown';
    }
    logPerformanceDetails(req, res, duration, hrDuration) {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const performanceInfo = {
            request: {
                method: req.method,
                url: req.originalUrl,
                headers: this.sanitizeHeaders(req.headers),
                query: req.query,
                params: req.params,
            },
            response: {
                statusCode: res.statusCode,
                headers: this.sanitizeHeaders(res.getHeaders()),
            },
            performance: {
                duration: `${duration}ms`,
                hrDuration: `${hrDuration.toFixed(3)}ms`,
                memory: {
                    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
                },
                cpu: {
                    user: `${cpuUsage.user}μs`,
                    system: `${cpuUsage.system}μs`,
                },
            },
        };
        this.logger.debug(`Performance Details: ${JSON.stringify(performanceInfo, null, 2)}`);
    }
    sanitizeHeaders(headers) {
        const sensitiveHeaders = [
            'authorization',
            'cookie',
            'x-api-key',
            'x-auth-token',
            'x-access-token',
        ];
        const sanitized = { ...headers };
        sensitiveHeaders.forEach(header => {
            if (sanitized[header]) {
                sanitized[header] = '[REDACTED]';
            }
        });
        return sanitized;
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
let PerformanceMiddleware = class PerformanceMiddleware {
    logger = new common_1.Logger('Performance');
    slowRequestThreshold = 1000;
    memoryWarningThreshold = 500 * 1024 * 1024;
    use(req, res, next) {
        const start = process.hrtime.bigint();
        const initialMemory = process.memoryUsage();
        res.on('finish', () => {
            const duration = Number(process.hrtime.bigint() - start) / 1000000;
            const finalMemory = process.memoryUsage();
            const memoryDiff = finalMemory.heapUsed - initialMemory.heapUsed;
            if (duration > this.slowRequestThreshold) {
                this.logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
            }
            if (finalMemory.heapUsed > this.memoryWarningThreshold) {
                this.logger.warn(`High memory usage: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB after ${req.method} ${req.originalUrl}`);
            }
            if (memoryDiff > 10 * 1024 * 1024) {
                this.logger.warn(`Potential memory leak: ${Math.round(memoryDiff / 1024 / 1024)}MB increase after ${req.method} ${req.originalUrl}`);
            }
        });
        next();
    }
};
exports.PerformanceMiddleware = PerformanceMiddleware;
exports.PerformanceMiddleware = PerformanceMiddleware = __decorate([
    (0, common_1.Injectable)()
], PerformanceMiddleware);
let SecurityLoggerMiddleware = class SecurityLoggerMiddleware {
    logger = new common_1.Logger('Security');
    suspiciousPatterns = [
        /\.\.\//,
        /<script/i,
        /union.*select/i,
        /javascript:/i,
        /data:.*base64/i,
    ];
    use(req, res, next) {
        const { method, originalUrl, ip, headers, body, query } = req;
        const userAgent = headers['user-agent'] || '';
        const clientIp = this.getClientIp(req);
        const suspiciousActivity = this.detectSuspiciousActivity(req);
        if (suspiciousActivity.length > 0) {
            this.logger.warn(`Suspicious activity detected from ${clientIp}: ${method} ${originalUrl} - ${suspiciousActivity.join(', ')}`);
        }
        res.on('finish', () => {
            if (res.statusCode === 401 || res.statusCode === 403) {
                this.logger.warn(`Authentication/Authorization failure: ${method} ${originalUrl} - ${clientIp} - ${userAgent}`);
            }
        });
        next();
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        return req.ip || 'unknown';
    }
    detectSuspiciousActivity(req) {
        const suspicious = [];
        const { originalUrl, body, query, headers } = req;
        this.suspiciousPatterns.forEach(pattern => {
            if (pattern.test(originalUrl)) {
                suspicious.push(`Suspicious URL pattern: ${pattern}`);
            }
        });
        const queryString = JSON.stringify(query);
        this.suspiciousPatterns.forEach(pattern => {
            if (pattern.test(queryString)) {
                suspicious.push(`Suspicious query parameter: ${pattern}`);
            }
        });
        if (body) {
            const bodyString = JSON.stringify(body);
            this.suspiciousPatterns.forEach(pattern => {
                if (pattern.test(bodyString)) {
                    suspicious.push(`Suspicious request body: ${pattern}`);
                }
            });
        }
        const userAgent = headers['user-agent'] || '';
        if (!userAgent || userAgent.length < 10) {
            suspicious.push('Missing or suspicious User-Agent');
        }
        return suspicious;
    }
};
exports.SecurityLoggerMiddleware = SecurityLoggerMiddleware;
exports.SecurityLoggerMiddleware = SecurityLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityLoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map
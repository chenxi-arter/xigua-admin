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
var AppLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerService = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../config/app-config.service");
let AppLoggerService = AppLoggerService_1 = class AppLoggerService {
    configService;
    context = 'Application';
    constructor(configService) {
        this.configService = configService;
    }
    setContext(context) {
        this.context = context;
    }
    log(message, context) {
        this.writeLog('log', message, context);
    }
    error(message, trace, context) {
        this.writeLog('error', message, context, trace);
    }
    warn(message, context) {
        this.writeLog('warn', message, context);
    }
    debug(message, context) {
        if (this.configService.isDevelopment) {
            this.writeLog('debug', message, context);
        }
    }
    verbose(message, context) {
        if (this.configService.isDevelopment) {
            this.writeLog('verbose', message, context);
        }
    }
    logDatabaseOperation(operation, table, data, duration) {
        const message = {
            operation,
            table,
            data: this.sanitizeData(data),
            duration: duration ? `${duration}ms` : undefined,
            timestamp: new Date().toISOString(),
        };
        this.log(`Database ${operation}: ${table}`, 'Database');
        if (this.configService.isDevelopment && data) {
            this.debug(message, 'Database');
        }
    }
    logCacheOperation(operation, key, hit, ttl) {
        const message = {
            operation,
            key,
            hit,
            ttl,
            timestamp: new Date().toISOString(),
        };
        this.debug(`Cache ${operation}: ${key} ${hit !== undefined ? (hit ? '(HIT)' : '(MISS)') : ''}`, 'Cache');
    }
    logApiRequest(method, url, statusCode, duration, userAgent, ip) {
        const message = {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            userAgent,
            ip,
            timestamp: new Date().toISOString(),
        };
        const logMessage = `${method} ${url} ${statusCode} - ${duration}ms`;
        if (statusCode >= 500) {
            this.error(logMessage, undefined, 'HTTP');
        }
        else if (statusCode >= 400) {
            this.warn(logMessage, 'HTTP');
        }
        else {
            this.log(logMessage, 'HTTP');
        }
        if (this.configService.isDevelopment) {
            this.debug(message, 'HTTP');
        }
    }
    logBusinessOperation(operation, entity, entityId, userId, details) {
        const message = {
            operation,
            entity,
            entityId,
            userId,
            details: this.sanitizeData(details),
            timestamp: new Date().toISOString(),
        };
        this.log(`Business: ${operation} ${entity}${entityId ? ` (ID: ${entityId})` : ''}${userId ? ` by User ${userId}` : ''}`, 'Business');
        if (this.configService.isDevelopment && details) {
            this.debug(message, 'Business');
        }
    }
    logPerformance(operation, duration, metadata) {
        const message = {
            operation,
            duration: `${duration}ms`,
            metadata,
            timestamp: new Date().toISOString(),
        };
        if (duration > 1000) {
            this.warn(`Slow operation: ${operation} took ${duration}ms`, 'Performance');
        }
        else {
            this.debug(`Performance: ${operation} took ${duration}ms`, 'Performance');
        }
        if (this.configService.isDevelopment && metadata) {
            this.debug(message, 'Performance');
        }
    }
    logSecurity(event, details, severity = 'medium') {
        const message = {
            event,
            severity,
            details: this.sanitizeData(details),
            timestamp: new Date().toISOString(),
        };
        const logMessage = `Security Event: ${event} (${severity.toUpperCase()})`;
        switch (severity) {
            case 'high':
                this.error(logMessage, undefined, 'Security');
                break;
            case 'medium':
                this.warn(logMessage, 'Security');
                break;
            default:
                this.log(logMessage, 'Security');
        }
        this.debug(message, 'Security');
    }
    writeLog(level, message, context, trace) {
        const timestamp = new Date().toISOString();
        const ctx = context || this.context;
        const logLevel = level.toUpperCase().padEnd(7);
        let formattedMessage;
        if (typeof message === 'object') {
            formattedMessage = JSON.stringify(message, null, 2);
        }
        else {
            formattedMessage = String(message);
        }
        const logEntry = `[${timestamp}] [${logLevel}] [${ctx}] ${formattedMessage}`;
        if (this.configService.logging.enableConsole) {
            switch (level) {
                case 'error':
                    console.error(logEntry);
                    if (trace) {
                        console.error(trace);
                    }
                    break;
                case 'warn':
                    console.warn(logEntry);
                    break;
                case 'debug':
                case 'verbose':
                    if (this.configService.isDevelopment) {
                        console.debug(logEntry);
                    }
                    break;
                default:
                    console.log(logEntry);
            }
        }
        if (this.configService.logging.enableFile) {
        }
    }
    sanitizeData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
        const sanitized = { ...data };
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        }
        return sanitized;
    }
    createChildLogger(context) {
        const childLogger = new AppLoggerService_1(this.configService);
        childLogger.setContext(context);
        return childLogger;
    }
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = AppLoggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], AppLoggerService);
//# sourceMappingURL=app-logger.service.js.map
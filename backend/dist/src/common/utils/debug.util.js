"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugUtil = void 0;
class DebugUtil {
    static isDebugEnabled = process.env.DEBUG_ENABLED === 'true';
    static debugCacheEnabled = process.env.DEBUG_CACHE === 'true';
    static debugDatabaseEnabled = process.env.DEBUG_DATABASE === 'true';
    static debugServiceEnabled = process.env.DEBUG_SERVICE === 'true';
    static log(message, data) {
        if (this.isDebugEnabled) {
            const timestamp = new Date().toISOString();
            console.log(`[DEBUG ${timestamp}] ${message}`, data ? data : '');
        }
    }
    static cache(message, cacheKey) {
        if (this.isDebugEnabled && this.debugCacheEnabled) {
            const timestamp = new Date().toISOString();
            const keyInfo = cacheKey ? ` | Key: ${cacheKey}` : '';
            console.log(`[CACHE ${timestamp}] ${message}${keyInfo}`);
        }
    }
    static database(message, query) {
        if (this.isDebugEnabled && this.debugDatabaseEnabled) {
            const timestamp = new Date().toISOString();
            console.log(`[DB ${timestamp}] ${message}`);
            if (query) {
                console.log(`[DB QUERY] ${query}`);
            }
        }
    }
    static service(serviceName, method, message, data) {
        if (this.isDebugEnabled && this.debugServiceEnabled) {
            const timestamp = new Date().toISOString();
            console.log(`[SERVICE ${timestamp}] ${serviceName}.${method}: ${message}`, data ? data : '');
        }
    }
    static error(message, error) {
        const timestamp = new Date().toISOString();
        console.error(`[ERROR ${timestamp}] ${message}`);
        if (error) {
            console.error(`[ERROR STACK]`, error.stack);
        }
    }
    static performance(operation, startTime) {
        if (this.isDebugEnabled) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const timestamp = new Date().toISOString();
            console.log(`[PERF ${timestamp}] ${operation}: ${duration}ms`);
        }
    }
    static getConfig() {
        return {
            enabled: this.isDebugEnabled,
            cache: this.debugCacheEnabled,
            database: this.debugDatabaseEnabled,
            service: this.debugServiceEnabled,
        };
    }
}
exports.DebugUtil = DebugUtil;
//# sourceMappingURL=debug.util.js.map
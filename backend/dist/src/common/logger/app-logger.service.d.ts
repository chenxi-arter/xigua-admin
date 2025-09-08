import { LoggerService } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
export declare class AppLoggerService implements LoggerService {
    private readonly configService;
    private context;
    constructor(configService: AppConfigService);
    setContext(context: string): void;
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
    debug(message: any, context?: string): void;
    verbose(message: any, context?: string): void;
    logDatabaseOperation(operation: string, table: string, data?: any, duration?: number): void;
    logCacheOperation(operation: 'GET' | 'SET' | 'DEL', key: string, hit?: boolean, ttl?: number): void;
    logApiRequest(method: string, url: string, statusCode: number, duration: number, userAgent?: string, ip?: string): void;
    logBusinessOperation(operation: string, entity: string, entityId?: number | string, userId?: number, details?: any): void;
    logPerformance(operation: string, duration: number, metadata?: any): void;
    logSecurity(event: string, details: any, severity?: 'low' | 'medium' | 'high'): void;
    private writeLog;
    private sanitizeData;
    createChildLogger(context: string): AppLoggerService;
}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from './app-config.service';
import { AppLoggerService } from '../logger/app-logger.service';
export declare class DatabaseConfigService {
    private readonly configService;
    private readonly logger;
    constructor(configService: AppConfigService, logger: AppLoggerService);
    getTypeOrmConfig(): TypeOrmModuleOptions;
    private getConnectionLimit;
    private getMaxIdleConnections;
    private getLoggingConfig;
    private getCacheConfig;
    getReplicationConfig(): TypeOrmModuleOptions;
    checkDatabaseHealth(): Promise<boolean>;
}

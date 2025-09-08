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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigService = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("./app-config.service");
const app_logger_service_1 = require("../logger/app-logger.service");
let DatabaseConfigService = class DatabaseConfigService {
    configService;
    logger;
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
    }
    getTypeOrmConfig() {
        const config = {
            type: 'mysql',
            host: this.configService.database.host,
            port: this.configService.database.port,
            username: this.configService.database.username,
            password: this.configService.database.password,
            database: this.configService.database.database,
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            synchronize: this.configService.isDevelopment,
            extra: {
                connectionLimit: this.getConnectionLimit(),
                acquireTimeout: 60000,
                timeout: 60000,
                reconnect: true,
                charset: 'utf8mb4',
                timezone: '+08:00',
                idleTimeout: 300000,
                maxIdle: this.getMaxIdleConnections(),
                ...(this.configService.isProduction && {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
            },
            logging: this.getLoggingConfig(),
            logger: 'advanced-console',
            cache: false,
            migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
            migrationsRun: false,
            subscribers: [__dirname + '/../../**/*.subscriber{.ts,.js}'],
            retryAttempts: 3,
            retryDelay: 3000,
            autoLoadEntities: true,
        };
        this.logger.log('数据库配置已加载', 'DatabaseConfig');
        return config;
    }
    getConnectionLimit() {
        if (this.configService.isProduction) {
            return 20;
        }
        else if (this.configService.isTest) {
            return 5;
        }
        else {
            return 10;
        }
    }
    getMaxIdleConnections() {
        const limit = this.getConnectionLimit();
        return Math.ceil(limit * 0.3);
    }
    getLoggingConfig() {
        if (this.configService.isDevelopment) {
            return ['query', 'error', 'warn'];
        }
        else if (this.configService.isTest) {
            return ['error'];
        }
        else {
            return ['error', 'warn'];
        }
    }
    getCacheConfig() {
        if (this.configService.isProduction) {
            return {
                type: 'redis',
                options: {
                    host: this.configService.redis.host,
                    port: this.configService.redis.port,
                    password: this.configService.redis.password,
                    db: 1,
                },
                duration: 30000,
            };
        }
        else {
            return {
                type: 'database',
                duration: 10000,
            };
        }
    }
    getReplicationConfig() {
        return this.getTypeOrmConfig();
    }
    async checkDatabaseHealth() {
        try {
            this.logger.log('数据库健康检查通过', 'DatabaseHealth');
            return true;
        }
        catch (error) {
            this.logger.error('数据库健康检查失败', error instanceof Error ? error.stack : '', 'DatabaseHealth');
            return false;
        }
    }
};
exports.DatabaseConfigService = DatabaseConfigService;
exports.DatabaseConfigService = DatabaseConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
        app_logger_service_1.AppLoggerService])
], DatabaseConfigService);
class CustomNamingStrategy {
    tableName(className, customName) {
        if (customName) {
            return customName;
        }
        return className
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .substring(1);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        if (customName) {
            return customName;
        }
        let name = propertyName.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (embeddedPrefixes && embeddedPrefixes.length > 0) {
            name = embeddedPrefixes.join('_') + '_' + name;
        }
        return name;
    }
    relationName(propertyName) {
        return propertyName;
    }
    joinTableName(firstTableName, secondTableName) {
        return `${firstTableName}_${secondTableName}`;
    }
    joinColumnName(relationName, referencedColumnName) {
        return `${relationName}_${referencedColumnName}`;
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return `${tableName}_${columnName || propertyName}`;
    }
    indexName(tableOrName, columnNames) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `IDX_${tableName}_${columnNames.join('_')}`;
    }
    foreignKeyName(tableOrName, columnNames) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `FK_${tableName}_${columnNames.join('_')}`;
    }
    uniqueConstraintName(tableOrName, columnNames) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `UQ_${tableName}_${columnNames.join('_')}`;
    }
    checkConstraintName(tableOrName, expression) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `CHK_${tableName}_${expression.replace(/\s+/g, '_')}`;
    }
    exclusionConstraintName(tableOrName, expression) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `XCL_${tableName}_${expression.replace(/\s+/g, '_')}`;
    }
    primaryKeyName(tableOrName, columnNames) {
        const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName;
        return `PK_${tableName}`;
    }
}
//# sourceMappingURL=database-config.service.js.map
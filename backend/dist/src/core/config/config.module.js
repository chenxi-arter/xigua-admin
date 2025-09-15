"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const app_config_1 = require("./app.config");
const database_config_1 = require("./database.config");
const redis_config_1 = require("./redis.config");
function validateConfig(config) {
    const appConfig = (0, class_transformer_1.plainToClass)(app_config_1.AppConfig, {
        nodeEnv: config.NODE_ENV,
        port: config.PORT,
        appName: config.APP_NAME,
        appVersion: config.APP_VERSION,
        appUrl: config.APP_URL,
        globalPrefix: config.GLOBAL_PREFIX,
        enableCors: config.ENABLE_CORS,
        enableSwagger: config.ENABLE_SWAGGER,
        enableVersioning: config.ENABLE_VERSIONING,
        defaultVersion: config.DEFAULT_VERSION,
        throttleTtl: config.THROTTLE_TTL,
        throttleLimit: config.THROTTLE_LIMIT,
        jwtSecret: config.JWT_SECRET,
        jwtExpiresIn: config.JWT_EXPIRES_IN,
        jwtRefreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
    const databaseConfig = (0, class_transformer_1.plainToClass)(database_config_1.DatabaseConfig, {
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        charset: config.DB_CHARSET,
        timezone: config.DB_TIMEZONE,
        synchronize: config.DB_SYNCHRONIZE,
        logging: config.DB_LOGGING,
        maxConnections: config.DB_MAX_CONNECTIONS,
        minConnections: config.DB_MIN_CONNECTIONS,
        acquireTimeout: config.DB_ACQUIRE_TIMEOUT,
        timeout: config.DB_TIMEOUT,
    });
    const redisConfig = (0, class_transformer_1.plainToClass)(redis_config_1.RedisConfig, {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        username: config.REDIS_USERNAME || config.REDIS_USER,
        password: config.REDIS_PASSWORD || config.REDIS_PASS,
        db: config.REDIS_DB,
        ttl: config.REDIS_TTL,
        max: config.REDIS_MAX,
        connectTimeout: config.REDIS_CONNECT_TIMEOUT,
        lazyConnect: config.REDIS_LAZY_CONNECT,
        retryAttempts: config.REDIS_RETRY_ATTEMPTS,
        retryDelay: config.REDIS_RETRY_DELAY,
        enableReadyCheck: config.REDIS_ENABLE_READY_CHECK,
        maxRetriesPerRequest: config.REDIS_MAX_RETRIES_PER_REQUEST,
    });
    const configs = [appConfig, databaseConfig, redisConfig];
    for (const configInstance of configs) {
        const errors = (0, class_validator_1.validateSync)(configInstance, {
            skipMissingProperties: false,
        });
        if (errors.length > 0) {
            throw new Error(`Configuration validation error: ${errors
                .map((error) => Object.values(error.constraints || {}).join(', '))
                .join('; ')}`);
        }
    }
    return {
        app: appConfig,
        database: databaseConfig,
        redis: redisConfig,
    };
}
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
                validate: validateConfig,
                cache: true,
            }),
        ],
        providers: [
            {
                provide: app_config_1.AppConfig,
                useFactory: (configService) => {
                    return configService.get('app');
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: database_config_1.DatabaseConfig,
                useFactory: (configService) => {
                    return configService.get('database');
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: redis_config_1.RedisConfig,
                useFactory: (configService) => {
                    return configService.get('redis');
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [app_config_1.AppConfig, database_config_1.DatabaseConfig, redis_config_1.RedisConfig],
    })
], ConfigModule);
//# sourceMappingURL=config.module.js.map
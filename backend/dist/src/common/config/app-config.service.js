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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get database() {
        return {
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', 3306),
            username: this.configService.get('DB_USERNAME', 'root'),
            password: this.configService.get('DB_PASSWORD', ''),
            database: this.configService.get('DB_DATABASE', 'short_drama'),
            synchronize: this.configService.get('DB_SYNCHRONIZE', false),
            logging: this.configService.get('DB_LOGGING', false),
        };
    }
    get redis() {
        return {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD'),
            db: this.configService.get('REDIS_DB', 0),
            ttl: this.configService.get('REDIS_TTL', 300),
        };
    }
    get app() {
        return {
            port: this.configService.get('PORT', 3000),
            env: this.configService.get('NODE_ENV', 'development'),
            apiPrefix: this.configService.get('API_PREFIX', 'api'),
            corsOrigin: this.configService.get('CORS_ORIGIN', '*'),
            maxFileSize: this.configService.get('MAX_FILE_SIZE', 10 * 1024 * 1024),
        };
    }
    get jwt() {
        return {
            secret: this.configService.get('JWT_SECRET', 'your-secret-key'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
            refreshSecret: this.configService.get('JWT_REFRESH_SECRET', 'your-refresh-secret'),
            refreshExpiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
        };
    }
    get upload() {
        return {
            destination: this.configService.get('UPLOAD_DESTINATION', './uploads'),
            maxSize: this.configService.get('UPLOAD_MAX_SIZE', 10 * 1024 * 1024),
            allowedMimeTypes: this.configService.get('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/gif,video/mp4').split(','),
        };
    }
    get cache() {
        return {
            defaultTtl: this.configService.get('CACHE_DEFAULT_TTL', 300),
            homeVideosTtl: this.configService.get('CACHE_HOME_VIDEOS_TTL', 600),
            filterDataTtl: this.configService.get('CACHE_FILTER_DATA_TTL', 300),
            videoDetailsTtl: this.configService.get('CACHE_VIDEO_DETAILS_TTL', 1800),
            categoriesTtl: this.configService.get('CACHE_CATEGORIES_TTL', 3600),
            tagsTtl: this.configService.get('CACHE_TAGS_TTL', 3600),
        };
    }
    get pagination() {
        return {
            defaultLimit: this.configService.get('PAGINATION_DEFAULT_LIMIT', 20),
            maxLimit: this.configService.get('PAGINATION_MAX_LIMIT', 100),
            defaultPage: this.configService.get('PAGINATION_DEFAULT_PAGE', 1),
        };
    }
    get logging() {
        return {
            level: this.configService.get('LOG_LEVEL', 'info'),
            enableConsole: this.configService.get('LOG_ENABLE_CONSOLE', true),
            enableFile: this.configService.get('LOG_ENABLE_FILE', false),
            filePath: this.configService.get('LOG_FILE_PATH', './logs'),
            maxFiles: this.configService.get('LOG_MAX_FILES', 7),
            maxSize: this.configService.get('LOG_MAX_SIZE', '20m'),
        };
    }
    get security() {
        return {
            rateLimitTtl: this.configService.get('RATE_LIMIT_TTL', 60),
            rateLimitMax: this.configService.get('RATE_LIMIT_MAX', 100),
            enableHelmet: this.configService.get('SECURITY_ENABLE_HELMET', true),
            enableCors: this.configService.get('SECURITY_ENABLE_CORS', true),
        };
    }
    get thirdParty() {
        return {
            cdnUrl: this.configService.get('CDN_URL'),
            cdnAccessKey: this.configService.get('CDN_ACCESS_KEY'),
            cdnSecretKey: this.configService.get('CDN_SECRET_KEY'),
            emailHost: this.configService.get('EMAIL_HOST'),
            emailPort: this.configService.get('EMAIL_PORT', 587),
            emailUser: this.configService.get('EMAIL_USER'),
            emailPassword: this.configService.get('EMAIL_PASSWORD'),
            smsAccessKey: this.configService.get('SMS_ACCESS_KEY'),
            smsSecretKey: this.configService.get('SMS_SECRET_KEY'),
            smsSignName: this.configService.get('SMS_SIGN_NAME'),
        };
    }
    get business() {
        return {
            maxVideoSize: this.configService.get('MAX_VIDEO_SIZE', 100 * 1024 * 1024),
            supportedVideoFormats: this.configService.get('SUPPORTED_VIDEO_FORMATS', 'mp4,avi,mov').split(','),
            maxCommentLength: this.configService.get('MAX_COMMENT_LENGTH', 500),
            enableCommentReview: this.configService.get('ENABLE_COMMENT_REVIEW', false),
            maxUsernameLength: this.configService.get('MAX_USERNAME_LENGTH', 20),
            minPasswordLength: this.configService.get('MIN_PASSWORD_LENGTH', 6),
            maxSeriesEpisodes: this.configService.get('MAX_SERIES_EPISODES', 1000),
            defaultSeriesStatus: this.configService.get('DEFAULT_SERIES_STATUS', 1),
        };
    }
    get isDevelopment() {
        return this.app.env === 'development';
    }
    get isProduction() {
        return this.app.env === 'production';
    }
    get isTest() {
        return this.app.env === 'test';
    }
    get databaseUrl() {
        const db = this.database;
        return `mysql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`;
    }
    get redisUrl() {
        const redis = this.redis;
        const auth = redis.password ? `:${redis.password}@` : '';
        return `redis://${auth}${redis.host}:${redis.port}/${redis.db}`;
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map
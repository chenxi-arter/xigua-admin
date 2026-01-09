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
exports.DatabaseConfig = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DatabaseConfig {
    host = 'localhost';
    port = 3306;
    username;
    password;
    database;
    charset = 'utf8mb4';
    timezone = 'Asia/Shanghai';
    synchronize = false;
    logging = false;
    maxConnections = 10;
    minConnections = 0;
    acquireTimeout = 30000;
    timeout = 10000;
    getTypeOrmConfig() {
        const useSqlite = (process.env.DB_TYPE === 'sqlite') || !this.username || !this.database;
        if (useSqlite) {
            return {
                type: 'sqlite',
                database: process.env.SQLITE_DB_PATH || ':memory:',
                synchronize: true,
                logging: false,
                autoLoadEntities: true,
            };
        }
        return {
            type: 'mysql',
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            database: this.database,
            charset: 'utf8mb4',
            timezone: '+08:00',
            synchronize: this.synchronize,
            logging: this.logging,
            extra: {
                connectionLimit: this.maxConnections,
                charset: 'utf8mb4',
                dateStrings: true,
                waitForConnections: true,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
                idleTimeoutMillis: 28800000,
                maxLifetime: 1800000,
                typeCast: function (field, next) {
                    if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
                        const val = field.string();
                        if (val === '0000-00-00 00:00:00') {
                            return null;
                        }
                        return val;
                    }
                    return next();
                },
            },
            poolSize: this.maxConnections,
            connectTimeout: 60000,
            autoLoadEntities: true,
            retryAttempts: 3,
            retryDelay: 3000,
        };
    }
}
exports.DatabaseConfig = DatabaseConfig;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'localhost'),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "host", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 3306),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "database", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'utf8mb4'),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "charset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'Asia/Shanghai'),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "timezone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "synchronize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "logging", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 10),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "maxConnections", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 0),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "minConnections", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 30000),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "acquireTimeout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 10000),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "timeout", void 0);
//# sourceMappingURL=database.config.js.map
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
exports.RedisConfig = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RedisConfig {
    host = 'localhost';
    port = 6379;
    username;
    password;
    db = 0;
    ttl = 300;
    max = 100;
    connectTimeout = 5000;
    lazyConnect = 3000;
    retryAttempts = 3;
    retryDelay = 3000;
    enableReadyCheck = true;
    maxRetriesPerRequest = 20000;
    getRedisConfig() {
        const config = {
            host: this.host,
            port: this.port,
            db: this.db,
            connectTimeout: this.connectTimeout,
            lazyConnect: this.lazyConnect,
            retryAttempts: this.retryAttempts,
            retryDelayOnFailover: this.retryDelay,
            enableReadyCheck: this.enableReadyCheck,
            maxRetriesPerRequest: this.maxRetriesPerRequest,
        };
        if (this.username && this.username.trim() !== '') {
            config.username = this.username;
        }
        if (this.password && this.password.trim() !== '') {
            config.password = this.password;
        }
        return config;
    }
    getCacheConfig() {
        const config = {
            store: 'redis',
            host: this.host,
            port: this.port,
            db: this.db,
            ttl: this.ttl,
            max: this.max,
        };
        if (this.username && this.username.trim() !== '') {
            config.username = this.username;
        }
        if (this.password && this.password.trim() !== '') {
            config.password = this.password;
        }
        return config;
    }
}
exports.RedisConfig = RedisConfig;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'localhost'),
    __metadata("design:type", String)
], RedisConfig.prototype, "host", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 6379),
    __metadata("design:type", Number)
], RedisConfig.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedisConfig.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedisConfig.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 0),
    __metadata("design:type", Number)
], RedisConfig.prototype, "db", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 300),
    __metadata("design:type", Number)
], RedisConfig.prototype, "ttl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 100),
    __metadata("design:type", Number)
], RedisConfig.prototype, "max", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 5000),
    __metadata("design:type", Number)
], RedisConfig.prototype, "connectTimeout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 3000),
    __metadata("design:type", Number)
], RedisConfig.prototype, "lazyConnect", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 3),
    __metadata("design:type", Number)
], RedisConfig.prototype, "retryAttempts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 3000),
    __metadata("design:type", Number)
], RedisConfig.prototype, "retryDelay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], RedisConfig.prototype, "enableReadyCheck", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 20000),
    __metadata("design:type", Number)
], RedisConfig.prototype, "maxRetriesPerRequest", void 0);
//# sourceMappingURL=redis.config.js.map
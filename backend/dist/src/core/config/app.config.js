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
exports.AppConfig = exports.Environment = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["PRODUCTION"] = "production";
    Environment["TEST"] = "test";
})(Environment || (exports.Environment = Environment = {}));
class AppConfig {
    nodeEnv = Environment.DEVELOPMENT;
    port = 3000;
    appName = 'short-drama-api';
    appVersion = '1.0.0';
    appUrl = 'http://localhost:3000';
    globalPrefix = 'api';
    enableCors = true;
    enableSwagger = true;
    enableVersioning = true;
    defaultVersion = '1';
    throttleTtl = 100;
    throttleLimit = 1000;
    jwtSecret;
    jwtExpiresIn = '1d';
    jwtRefreshExpiresIn = '7d';
    get isDevelopment() {
        return this.nodeEnv === Environment.DEVELOPMENT;
    }
    get isProduction() {
        return this.nodeEnv === Environment.PRODUCTION;
    }
    get isTest() {
        return this.nodeEnv === Environment.TEST;
    }
    getCorsConfig() {
        return {
            origin: this.isDevelopment ? true : [this.appUrl],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,
        };
    }
    getThrottleConfig() {
        return {
            ttl: this.throttleTtl,
            limit: this.throttleLimit,
        };
    }
    getJwtConfig() {
        return {
            secret: this.jwtSecret,
            signOptions: {
                expiresIn: this.jwtExpiresIn,
            },
        };
    }
}
exports.AppConfig = AppConfig;
__decorate([
    (0, class_validator_1.IsEnum)(Environment),
    (0, class_transformer_1.Transform)(({ value }) => value || Environment.DEVELOPMENT),
    __metadata("design:type", String)
], AppConfig.prototype, "nodeEnv", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 3000),
    __metadata("design:type", Number)
], AppConfig.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'short-drama-api'),
    __metadata("design:type", String)
], AppConfig.prototype, "appName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '1.0.0'),
    __metadata("design:type", String)
], AppConfig.prototype, "appVersion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || 'http://localhost:3000'),
    __metadata("design:type", String)
], AppConfig.prototype, "appUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppConfig.prototype, "globalPrefix", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], AppConfig.prototype, "enableCors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], AppConfig.prototype, "enableSwagger", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], AppConfig.prototype, "enableVersioning", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '1'),
    __metadata("design:type", String)
], AppConfig.prototype, "defaultVersion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 100),
    __metadata("design:type", Number)
], AppConfig.prototype, "throttleTtl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value) || 1000),
    __metadata("design:type", Number)
], AppConfig.prototype, "throttleLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtSecret", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '1d'),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtExpiresIn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '7d'),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtRefreshExpiresIn", void 0);
//# sourceMappingURL=app.config.js.map
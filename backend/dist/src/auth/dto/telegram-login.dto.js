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
exports.TelegramLoginResponseDto = exports.TelegramLoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TelegramLoginDto {
    initData;
    deviceInfo;
}
exports.TelegramLoginDto = TelegramLoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Telegram Web App的initData字符串',
        example: 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2'
    }),
    __metadata("design:type", String)
], TelegramLoginDto.prototype, "initData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: '设备信息（可选）',
        example: 'iPhone 14 Pro, iOS 16.0',
        required: false
    }),
    __metadata("design:type", String)
], TelegramLoginDto.prototype, "deviceInfo", void 0);
class TelegramLoginResponseDto {
    access_token;
    refresh_token;
    token_type;
    expires_in;
}
exports.TelegramLoginResponseDto = TelegramLoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '访问令牌',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    __metadata("design:type", String)
], TelegramLoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '刷新令牌',
        example: 'abc123def456...'
    }),
    __metadata("design:type", String)
], TelegramLoginResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '令牌类型',
        example: 'Bearer'
    }),
    __metadata("design:type", String)
], TelegramLoginResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '过期时间（秒）',
        example: 3600
    }),
    __metadata("design:type", Number)
], TelegramLoginResponseDto.prototype, "expires_in", void 0);
//# sourceMappingURL=telegram-login.dto.js.map
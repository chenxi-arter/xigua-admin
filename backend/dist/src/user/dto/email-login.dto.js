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
exports.EmailLoginResponseDto = exports.EmailLoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class EmailLoginDto {
    email;
    password;
    deviceInfo;
    guestToken;
}
exports.EmailLoginDto = EmailLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '邮箱地址',
        example: 'user@example.com',
        type: String
    }),
    (0, class_validator_1.IsEmail)({}, { message: '请输入有效的邮箱地址' }),
    (0, class_validator_1.IsNotEmpty)({ message: '邮箱地址不能为空' }),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '密码',
        example: 'password123',
        type: String
    }),
    (0, class_validator_1.IsString)({ message: '密码必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '密码不能为空' }),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '设备信息',
        example: 'iPhone 13 Pro',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '设备信息必须是字符串' }),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '游客唯一标识（可选，用于自动合并游客数据）',
        example: 'guest_abc123xyz',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '游客token必须是字符串' }),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "guestToken", void 0);
class EmailLoginResponseDto {
    access_token;
    refresh_token;
    expires_in;
    token_type;
}
exports.EmailLoginResponseDto = EmailLoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '访问令牌' }),
    __metadata("design:type", String)
], EmailLoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '刷新令牌' }),
    __metadata("design:type", String)
], EmailLoginResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '过期时间（秒）' }),
    __metadata("design:type", Number)
], EmailLoginResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '令牌类型' }),
    __metadata("design:type", String)
], EmailLoginResponseDto.prototype, "token_type", void 0);
//# sourceMappingURL=email-login.dto.js.map
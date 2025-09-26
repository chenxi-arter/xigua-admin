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
exports.BindTelegramResponseDto = exports.BindTelegramDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BindTelegramDto {
    id;
    first_name;
    last_name;
    username;
    auth_date;
    hash;
}
exports.BindTelegramDto = BindTelegramDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram用户ID',
        example: 6702079700,
        type: Number
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Telegram用户ID必须是数字' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Telegram用户ID不能为空' }),
    __metadata("design:type", Number)
], BindTelegramDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram用户名',
        example: '随风',
        type: String
    }),
    (0, class_validator_1.IsString)({ message: 'Telegram用户名必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Telegram用户名不能为空' }),
    __metadata("design:type", String)
], BindTelegramDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram姓氏',
        example: '李',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telegram姓氏必须是字符串' }),
    __metadata("design:type", String)
], BindTelegramDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram用户名',
        example: 'seo99991',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telegram用户名必须是字符串' }),
    __metadata("design:type", String)
], BindTelegramDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '认证时间戳',
        example: 1754642628,
        type: Number
    }),
    (0, class_validator_1.IsNumber)({}, { message: '认证时间戳必须是数字' }),
    (0, class_validator_1.IsNotEmpty)({ message: '认证时间戳不能为空' }),
    __metadata("design:type", Number)
], BindTelegramDto.prototype, "auth_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '验证哈希',
        example: 'cd671f60a4393b399d9cb269ac4327c8a47a3807c5520077c37477544ae93c07',
        type: String
    }),
    (0, class_validator_1.IsString)({ message: '验证哈希必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '验证哈希不能为空' }),
    __metadata("design:type", String)
], BindTelegramDto.prototype, "hash", void 0);
class BindTelegramResponseDto {
    success;
    message;
    user;
}
exports.BindTelegramResponseDto = BindTelegramResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '绑定结果' }),
    __metadata("design:type", Boolean)
], BindTelegramResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '消息' }),
    __metadata("design:type", String)
], BindTelegramResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户信息' }),
    __metadata("design:type", Object)
], BindTelegramResponseDto.prototype, "user", void 0);
//# sourceMappingURL=bind-telegram.dto.js.map
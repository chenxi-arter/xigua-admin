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
exports.ConvertGuestResponseDto = exports.ConvertGuestToEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ConvertGuestToEmailDto {
    email;
    password;
    confirmPassword;
    username;
    firstName;
    lastName;
}
exports.ConvertGuestToEmailDto = ConvertGuestToEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '邮箱地址',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '密码',
        example: 'Password123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '确认密码',
        example: 'Password123!',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户名（可选）',
        required: false,
        example: 'myusername',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '名字（可选）',
        required: false,
        example: '张三',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '姓氏（可选）',
        required: false,
        example: '李',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConvertGuestToEmailDto.prototype, "lastName", void 0);
class ConvertGuestResponseDto {
    success;
    message;
    access_token;
    refresh_token;
    token_type;
    expires_in;
}
exports.ConvertGuestResponseDto = ConvertGuestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否成功' }),
    __metadata("design:type", Boolean)
], ConvertGuestResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '提示信息' }),
    __metadata("design:type", String)
], ConvertGuestResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新的访问令牌' }),
    __metadata("design:type", String)
], ConvertGuestResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '新的刷新令牌' }),
    __metadata("design:type", String)
], ConvertGuestResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '令牌类型' }),
    __metadata("design:type", String)
], ConvertGuestResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '过期时间（秒）' }),
    __metadata("design:type", Number)
], ConvertGuestResponseDto.prototype, "expires_in", void 0);
//# sourceMappingURL=convert-guest.dto.js.map
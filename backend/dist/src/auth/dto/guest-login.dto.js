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
exports.GuestLoginResponseDto = exports.GuestLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GuestLoginDto {
    guestToken;
    deviceInfo;
}
exports.GuestLoginDto = GuestLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '游客token（可选，用于识别回访游客）',
        required: false,
        example: 'guest_abc123def456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GuestLoginDto.prototype, "guestToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '设备信息（可选）',
        required: false,
        example: 'iPhone 14 Pro',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GuestLoginDto.prototype, "deviceInfo", void 0);
class GuestLoginResponseDto {
    access_token;
    refresh_token;
    token_type;
    expires_in;
    guestToken;
    isNewGuest;
    userId;
}
exports.GuestLoginResponseDto = GuestLoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '访问令牌' }),
    __metadata("design:type", String)
], GuestLoginResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '刷新令牌' }),
    __metadata("design:type", String)
], GuestLoginResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '令牌类型' }),
    __metadata("design:type", String)
], GuestLoginResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '过期时间（秒）' }),
    __metadata("design:type", Number)
], GuestLoginResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '游客唯一标识token' }),
    __metadata("design:type", String)
], GuestLoginResponseDto.prototype, "guestToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否为新创建的游客' }),
    __metadata("design:type", Boolean)
], GuestLoginResponseDto.prototype, "isNewGuest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", Number)
], GuestLoginResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=guest-login.dto.js.map
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
exports.BotLoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BotLoginDto {
    id;
    first_name;
    last_name;
    username;
    auth_date;
    hash;
    deviceInfo;
}
exports.BotLoginDto = BotLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Telegram 用户ID', example: 6702079700 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BotLoginDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '名', example: '随风' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BotLoginDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '姓', example: '李', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BotLoginDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名', example: 'seo99991', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BotLoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '认证时间戳', example: 1754642628 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BotLoginDto.prototype, "auth_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '签名', example: 'cd671f60a4...ae93c07' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BotLoginDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '设备信息', example: 'iPhone, iOS 16', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BotLoginDto.prototype, "deviceInfo", void 0);
//# sourceMappingURL=bot-login.dto.js.map
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
exports.UpdatePasswordResponseDto = exports.UpdatePasswordDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdatePasswordDto {
    oldPassword;
    newPassword;
    confirmPassword;
}
exports.UpdatePasswordDto = UpdatePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '旧密码',
        example: 'oldpassword123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '新密码',
        example: 'newpassword123',
        minLength: 6
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6, { message: '密码长度至少6位' }),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '确认新密码',
        example: 'newpassword123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "confirmPassword", void 0);
class UpdatePasswordResponseDto {
    success;
    message;
}
exports.UpdatePasswordResponseDto = UpdatePasswordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否成功' }),
    __metadata("design:type", Boolean)
], UpdatePasswordResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应消息' }),
    __metadata("design:type", String)
], UpdatePasswordResponseDto.prototype, "message", void 0);
//# sourceMappingURL=update-password.dto.js.map
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
exports.UpdateAvatarResponseDto = exports.UpdateAvatarDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateAvatarDto {
    photo_url;
}
exports.UpdateAvatarDto = UpdateAvatarDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '头像URL',
        example: 'https://ui-avatars.com/api/?name=John+Doe&size=200',
        maxLength: 500
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '头像URL不能为空' }),
    (0, class_validator_1.IsUrl)({}, { message: '请输入有效的URL地址' }),
    (0, class_validator_1.MaxLength)(500, { message: '头像URL长度不能超过500个字符' }),
    __metadata("design:type", String)
], UpdateAvatarDto.prototype, "photo_url", void 0);
class UpdateAvatarResponseDto {
    success;
    message;
    photo_url;
}
exports.UpdateAvatarResponseDto = UpdateAvatarResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否成功' }),
    __metadata("design:type", Boolean)
], UpdateAvatarResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应消息' }),
    __metadata("design:type", String)
], UpdateAvatarResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新后的头像URL', required: false }),
    __metadata("design:type", String)
], UpdateAvatarResponseDto.prototype, "photo_url", void 0);
//# sourceMappingURL=update-avatar.dto.js.map
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
exports.UpdateNicknameResponseDto = exports.UpdateNicknameDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateNicknameDto {
    nickname;
}
exports.UpdateNicknameDto = UpdateNicknameDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '新昵称',
        example: 'MyNewNickname',
        maxLength: 50
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50, { message: '昵称长度不能超过50个字符' }),
    __metadata("design:type", String)
], UpdateNicknameDto.prototype, "nickname", void 0);
class UpdateNicknameResponseDto {
    success;
    message;
}
exports.UpdateNicknameResponseDto = UpdateNicknameResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否成功' }),
    __metadata("design:type", Boolean)
], UpdateNicknameResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '响应消息' }),
    __metadata("design:type", String)
], UpdateNicknameResponseDto.prototype, "message", void 0);
//# sourceMappingURL=update-nickname.dto.js.map
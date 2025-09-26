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
exports.BindEmailDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BindEmailDto {
    email;
    password;
    confirmPassword;
}
exports.BindEmailDto = BindEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱地址', example: 'user@example.com', type: String }),
    (0, class_validator_1.IsEmail)({}, { message: '请输入有效的邮箱地址' }),
    (0, class_validator_1.IsNotEmpty)({ message: '邮箱地址不能为空' }),
    __metadata("design:type", String)
], BindEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '密码', example: 'password123', type: String, minLength: 6, maxLength: 20 }),
    (0, class_validator_1.IsString)({ message: '密码必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '密码不能为空' }),
    (0, class_validator_1.MinLength)(6, { message: '密码长度不能少于6位' }),
    (0, class_validator_1.MaxLength)(20, { message: '密码长度不能超过20位' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, { message: '密码必须包含至少一个字母和一个数字' }),
    __metadata("design:type", String)
], BindEmailDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '确认密码', example: 'password123', type: String }),
    (0, class_validator_1.IsString)({ message: '确认密码必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '确认密码不能为空' }),
    __metadata("design:type", String)
], BindEmailDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=bind-email.dto.js.map
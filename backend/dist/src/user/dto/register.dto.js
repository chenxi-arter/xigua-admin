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
exports.RegisterResponseDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    email;
    password;
    confirmPassword;
    username;
    firstName;
    lastName;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '邮箱地址',
        example: 'user@example.com',
        type: String
    }),
    (0, class_validator_1.IsEmail)({}, { message: '请输入有效的邮箱地址' }),
    (0, class_validator_1.IsNotEmpty)({ message: '邮箱地址不能为空' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '密码',
        example: 'password123',
        type: String,
        minLength: 6,
        maxLength: 20
    }),
    (0, class_validator_1.IsString)({ message: '密码必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '密码不能为空' }),
    (0, class_validator_1.MinLength)(6, { message: '密码长度不能少于6位' }),
    (0, class_validator_1.MaxLength)(20, { message: '密码长度不能超过20位' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, {
        message: '密码必须包含至少一个字母和一个数字'
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '确认密码',
        example: 'password123',
        type: String
    }),
    (0, class_validator_1.IsString)({ message: '确认密码必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '确认密码不能为空' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户名',
        example: 'username123',
        type: String,
        minLength: 3,
        maxLength: 20,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '用户名必须是字符串' }),
    (0, class_validator_1.MinLength)(3, { message: '用户名长度不能少于3位' }),
    (0, class_validator_1.MaxLength)(20, { message: '用户名长度不能超过20位' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '名字',
        example: '张',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '名字必须是字符串' }),
    (0, class_validator_1.MaxLength)(50, { message: '名字长度不能超过50位' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '姓氏',
        example: '三',
        type: String,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '姓氏必须是字符串' }),
    (0, class_validator_1.MaxLength)(50, { message: '姓氏长度不能超过50位' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
class RegisterResponseDto {
    id;
    shortId;
    email;
    username;
    firstName;
    lastName;
    isActive;
    createdAt;
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", Number)
], RegisterResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '短ID' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "shortId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '邮箱地址' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '名字' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '姓氏' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否激活' }),
    __metadata("design:type", Boolean)
], RegisterResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    __metadata("design:type", Date)
], RegisterResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=register.dto.js.map
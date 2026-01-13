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
exports.TelegramUserDto = exports.LoginType = void 0;
const class_validator_1 = require("class-validator");
var LoginType;
(function (LoginType) {
    LoginType["WEBAPP"] = "webapp";
    LoginType["BOT"] = "bot";
})(LoginType || (exports.LoginType = LoginType = {}));
class TelegramUserDto {
    loginType;
    initData;
    deviceInfo;
    guestToken;
    id;
    first_name;
    last_name;
    username;
    auth_date;
    hash;
    photo_url;
}
exports.TelegramUserDto = TelegramUserDto;
__decorate([
    (0, class_validator_1.IsEnum)(LoginType),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "loginType", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.loginType === LoginType.WEBAPP),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "initData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "guestToken", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.loginType === LoginType.BOT),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TelegramUserDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.loginType === LoginType.BOT),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.loginType === LoginType.BOT),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TelegramUserDto.prototype, "auth_date", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.loginType === LoginType.BOT),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "hash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TelegramUserDto.prototype, "photo_url", void 0);
//# sourceMappingURL=telegram-user.dto.js.map
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
exports.PlatformResponseDto = exports.PlatformSortItem = exports.UpdatePlatformSortDto = exports.UpdatePlatformStatusDto = exports.UpdatePlatformDto = exports.CreatePlatformDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreatePlatformDto {
    name;
    code;
    description;
    iconUrl;
    color;
    config;
}
exports.CreatePlatformDto = CreatePlatformDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "iconUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePlatformDto.prototype, "config", void 0);
class UpdatePlatformDto {
    name;
    description;
    iconUrl;
    color;
    config;
}
exports.UpdatePlatformDto = UpdatePlatformDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformDto.prototype, "iconUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePlatformDto.prototype, "config", void 0);
class UpdatePlatformStatusDto {
    isEnabled;
}
exports.UpdatePlatformStatusDto = UpdatePlatformStatusDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlatformStatusDto.prototype, "isEnabled", void 0);
class UpdatePlatformSortDto {
    platforms;
}
exports.UpdatePlatformSortDto = UpdatePlatformSortDto;
__decorate([
    (0, class_transformer_1.Type)(() => PlatformSortItem),
    __metadata("design:type", Array)
], UpdatePlatformSortDto.prototype, "platforms", void 0);
class PlatformSortItem {
    id;
    sortOrder;
}
exports.PlatformSortItem = PlatformSortItem;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PlatformSortItem.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PlatformSortItem.prototype, "sortOrder", void 0);
class PlatformResponseDto {
    id;
    name;
    code;
    description;
    iconUrl;
    color;
    isEnabled;
    sortOrder;
    config;
    createdAt;
    updatedAt;
}
exports.PlatformResponseDto = PlatformResponseDto;
//# sourceMappingURL=platform.dto.js.map
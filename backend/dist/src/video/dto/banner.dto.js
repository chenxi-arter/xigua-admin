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
exports.BannerQueryDto = exports.UpdateBannerDto = exports.CreateBannerDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enhanced_validation_decorator_1 = require("../../common/validators/enhanced-validation.decorator");
class CreateBannerDto {
    title;
    imageUrl;
    seriesId;
    categoryId;
    linkUrl;
    weight = 0;
    isActive = true;
    startTime;
    endTime;
    description;
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '标题必须是字符串' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 255, { message: '标题长度必须在1到255个字符之间' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '图片URL必须是字符串' }),
    (0, class_validator_1.IsUrl)({}, { message: '图片URL格式不正确' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 500, { message: '图片URL长度必须在1到500个字符之间' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '系列ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '系列ID必须大于0' }),
    __metadata("design:type", Number)
], CreateBannerDto.prototype, "seriesId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '分类ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '分类ID必须大于0' }),
    __metadata("design:type", Number)
], CreateBannerDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '跳转链接必须是字符串' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 500, { message: '跳转链接长度必须在1到500个字符之间' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "linkUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '权重必须是数字' }),
    __metadata("design:type", Number)
], CreateBannerDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '启用状态必须是布尔值' }),
    __metadata("design:type", Boolean)
], CreateBannerDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始时间格式不正确' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束时间格式不正确' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '描述必须是字符串' }),
    (0, class_validator_1.Length)(0, 1000, { message: '描述长度不能超过1000个字符' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "description", void 0);
class UpdateBannerDto {
    title;
    imageUrl;
    seriesId;
    categoryId;
    linkUrl;
    weight;
    isActive;
    startTime;
    endTime;
    description;
}
exports.UpdateBannerDto = UpdateBannerDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '标题必须是字符串' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 255, { message: '标题长度必须在1到255个字符之间' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '图片URL必须是字符串' }),
    (0, class_validator_1.IsUrl)({}, { message: '图片URL格式不正确' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 500, { message: '图片URL长度必须在1到500个字符之间' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '系列ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '系列ID必须大于0' }),
    __metadata("design:type", Number)
], UpdateBannerDto.prototype, "seriesId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '分类ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '分类ID必须大于0' }),
    __metadata("design:type", Number)
], UpdateBannerDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '跳转链接必须是字符串' }),
    (0, enhanced_validation_decorator_1.EnhancedStringLength)(1, 500, { message: '跳转链接长度必须在1到500个字符之间' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "linkUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '权重必须是数字' }),
    __metadata("design:type", Number)
], UpdateBannerDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '启用状态必须是布尔值' }),
    __metadata("design:type", Boolean)
], UpdateBannerDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '开始时间格式不正确' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: '结束时间格式不正确' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '描述必须是字符串' }),
    (0, class_validator_1.Length)(0, 1000, { message: '描述长度不能超过1000个字符' }),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "description", void 0);
class BannerQueryDto {
    categoryId;
    isActive;
    page = 1;
    size = 10;
}
exports.BannerQueryDto = BannerQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '分类ID必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '分类ID必须大于0' }),
    __metadata("design:type", Number)
], BannerQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '启用状态必须是布尔值' }),
    __metadata("design:type", Boolean)
], BannerQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '页码必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '页码必须大于等于1' }),
    __metadata("design:type", Number)
], BannerQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: '每页数量必须是数字' }),
    (0, class_validator_1.Min)(1, { message: '每页数量必须大于0' }),
    __metadata("design:type", Number)
], BannerQueryDto.prototype, "size", void 0);
//# sourceMappingURL=banner.dto.js.map
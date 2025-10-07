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
exports.MediaQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enhanced_validation_decorator_1 = require("../../common/validators/enhanced-validation.decorator");
class MediaQueryDto {
    categoryId;
    type;
    sort = 'latest';
    page = 1;
    size = 20;
}
exports.MediaQueryDto = MediaQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsPositive)({ message: '分类ID必须是正整数' }),
    __metadata("design:type", Number)
], MediaQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['short', 'series'], { message: '类型只能是 short 或 series' }),
    __metadata("design:type", String)
], MediaQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['latest', 'like', 'play'], { message: '排序方式只能是 latest、like 或 play' }),
    __metadata("design:type", String)
], MediaQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: '页码必须大于等于1' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, Number(value) || 1)),
    __metadata("design:type", Object)
], MediaQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, enhanced_validation_decorator_1.NumberRange)(1, 200, { message: '每页数量必须在1到200之间' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.min(200, Math.max(1, Number(value) || 20))),
    __metadata("design:type", Object)
], MediaQueryDto.prototype, "size", void 0);
//# sourceMappingURL=media-query.dto.js.map
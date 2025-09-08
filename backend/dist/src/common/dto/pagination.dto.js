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
exports.EnhancedPaginationDto = exports.PaginationDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enhanced_validation_decorator_1 = require("../validators/enhanced-validation.decorator");
class PaginationDto {
    page = 1;
    limit = 20;
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: '页码必须是整数' }),
    (0, enhanced_validation_decorator_1.NumberRange)(1, 1000, { message: '页码必须在1到1000之间' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, Number(value) || 1)),
    __metadata("design:type", Object)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: '每页数量必须是整数' }),
    (0, enhanced_validation_decorator_1.NumberRange)(1, 100, { message: '每页数量必须在1到100之间' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.min(100, Math.max(1, Number(value) || 20))),
    __metadata("design:type", Object)
], PaginationDto.prototype, "limit", void 0);
class EnhancedPaginationDto {
    page = 1;
    size = 20;
    get skip() {
        return (this.page - 1) * this.size;
    }
    get take() {
        return this.size;
    }
    createMeta(total) {
        const totalPages = Math.ceil(total / this.size);
        return {
            page: this.page,
            size: this.size,
            total,
            totalPages,
            hasNext: this.page < totalPages,
            hasPrev: this.page > 1,
        };
    }
}
exports.EnhancedPaginationDto = EnhancedPaginationDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: '页码必须是整数' }),
    (0, enhanced_validation_decorator_1.NumberRange)(1, 1000, { message: '页码必须在1到1000之间' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, Number(value) || 1)),
    __metadata("design:type", Object)
], EnhancedPaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: '每页数量必须是整数' }),
    (0, enhanced_validation_decorator_1.NumberRange)(1, 100, { message: '每页数量必须在1到100之间' }),
    (0, class_transformer_1.Transform)(({ value }) => Math.min(100, Math.max(1, Number(value) || 20))),
    __metadata("design:type", Object)
], EnhancedPaginationDto.prototype, "size", void 0);
//# sourceMappingURL=pagination.dto.js.map
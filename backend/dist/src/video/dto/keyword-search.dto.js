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
exports.KeywordSearchDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class KeywordSearchDto {
    keyword;
    channelId;
    page;
    pageSize;
}
exports.KeywordSearchDto = KeywordSearchDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: '关键词不能为空' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeywordSearchDto.prototype, "keyword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '1'),
    __metadata("design:type", String)
], KeywordSearchDto.prototype, "channelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '1'),
    __metadata("design:type", String)
], KeywordSearchDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value || '20'),
    __metadata("design:type", String)
], KeywordSearchDto.prototype, "pageSize", void 0);
//# sourceMappingURL=keyword-search.dto.js.map
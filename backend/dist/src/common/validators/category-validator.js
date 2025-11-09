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
exports.CategoryValidator = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("../../video/services/category.service");
let CategoryValidator = class CategoryValidator {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async validateCategoryId(categoryId) {
        const category = await this.categoryService.getCategoryById(categoryId);
        if (!category) {
            return {
                valid: false,
                message: `分类ID ${categoryId} 不存在，请使用有效的分类ID`
            };
        }
        if (!category.isEnabled) {
            return {
                valid: false,
                message: `分类"${category.name}"已禁用，无法使用`
            };
        }
        return {
            valid: true,
            category
        };
    }
    async getAvailableCategories() {
        const categories = await this.categoryService.getRawCategories();
        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            categoryId: cat.categoryId
        }));
    }
    async formatAvailableCategoriesMessage() {
        const categories = await this.getAvailableCategories();
        if (categories.length === 0) {
            return '当前没有可用的分类';
        }
        const categoryList = categories.map(cat => `${cat.id}-${cat.name}`).join('、');
        return `可用的分类: ${categoryList}`;
    }
};
exports.CategoryValidator = CategoryValidator;
exports.CategoryValidator = CategoryValidator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryValidator);
//# sourceMappingURL=category-validator.js.map
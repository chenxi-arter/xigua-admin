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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_suggestions_service_1 = require("../services/search-suggestions.service");
const base_controller_1 = require("./base.controller");
let SearchController = class SearchController extends base_controller_1.BaseController {
    searchSuggestionsService;
    constructor(searchSuggestionsService) {
        super();
        this.searchSuggestionsService = searchSuggestionsService;
    }
    async getHotSuggestions(limit, categoryId, daysRange) {
        try {
            const limitNum = limit ? Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50) : 10;
            const categoryIdNum = categoryId ? parseInt(categoryId, 10) : undefined;
            const daysRangeNum = daysRange ? parseInt(daysRange, 10) : 30;
            const suggestions = await this.searchSuggestionsService.getHotSearchSuggestions(limitNum, categoryIdNum, daysRangeNum);
            return this.success(suggestions, '获取热门搜索建议成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取热门搜索建议失败');
        }
    }
    async getHotKeywords(limit, categoryId) {
        try {
            const limitNum = limit ? Math.min(Math.max(parseInt(limit, 10) || 5, 1), 20) : 5;
            const categoryIdNum = categoryId ? parseInt(categoryId, 10) : undefined;
            const suggestions = await this.searchSuggestionsService.getHotSearchSuggestions(limitNum, categoryIdNum, 30);
            const keywords = suggestions.map(s => s.title);
            return this.success(keywords, '获取热门关键词成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取热门关键词失败');
        }
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('hot-suggestions'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('daysRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getHotSuggestions", null);
__decorate([
    (0, common_1.Get)('hot-keywords'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getHotKeywords", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_suggestions_service_1.SearchSuggestionsService])
], SearchController);
//# sourceMappingURL=search.controller.js.map
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
exports.ListController = void 0;
const common_1 = require("@nestjs/common");
const admin_response_util_1 = require("../common/utils/admin-response.util");
const video_service_1 = require("./video.service");
const filter_tags_dto_1 = require("./dto/filter-tags.dto");
const filter_data_dto_1 = require("./dto/filter-data.dto");
const condition_filter_dto_1 = require("./dto/condition-filter.dto");
const fuzzy_search_dto_1 = require("./dto/fuzzy-search.dto");
const category_validator_1 = require("../common/validators/category-validator");
let ListController = class ListController {
    videoService;
    categoryValidator;
    constructor(videoService, categoryValidator) {
        this.videoService = videoService;
        this.categoryValidator = categoryValidator;
    }
    async getFiltersTags(dto) {
        return this.videoService.getFiltersTags(dto.channeid || '1');
    }
    async getFiltersData(dto) {
        return this.videoService.getFiltersData(dto.channeid || '1', dto.ids || '0,0,0,0,0', dto.page || '1');
    }
    async getConditionFilterData(dto) {
        return this.videoService.getConditionFilterData(dto);
    }
    async fuzzySearch(dto) {
        if (!dto.keyword || dto.keyword.trim() === '') {
            const resp = admin_response_util_1.AdminResponseUtil.error('搜索关键词不能为空', 400);
            return { code: resp.code, msg: '搜索关键词不能为空', data: null, success: resp.success, timestamp: resp.timestamp };
        }
        if (dto.categoryId) {
            const categoryIdNum = parseInt(dto.categoryId, 10);
            if (isNaN(categoryIdNum) || categoryIdNum <= 0) {
                const resp = admin_response_util_1.AdminResponseUtil.error('无效的分类ID格式', 400);
                return { code: resp.code, msg: '无效的分类ID格式', data: null, success: resp.success, timestamp: resp.timestamp };
            }
            const validation = await this.categoryValidator.validateCategoryId(categoryIdNum);
            if (!validation.valid) {
                const availableMsg = await this.categoryValidator.formatAvailableCategoriesMessage();
                const resp = admin_response_util_1.AdminResponseUtil.error(`${validation.message}。${availableMsg}`, 400);
                return { code: resp.code, msg: `${validation.message}。${availableMsg}`, data: null, success: resp.success, timestamp: resp.timestamp };
            }
        }
        return this.videoService.fuzzySearch(dto.keyword, dto.categoryId, dto.page || 1, dto.size || 20);
    }
    async clearFilterCache(channeid) {
        await this.videoService.clearFilterCache(channeid);
        const message = channeid ? `已清除频道 ${channeid} 的筛选器缓存` : '已清除所有筛选器缓存';
        const resp = admin_response_util_1.AdminResponseUtil.success(null, message);
        return { code: resp.code, msg: message, data: null, success: resp.success, timestamp: resp.timestamp };
    }
};
exports.ListController = ListController;
__decorate([
    (0, common_1.Get)('/getfilterstags'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_tags_dto_1.FilterTagsDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "getFiltersTags", null);
__decorate([
    (0, common_1.Get)('getfiltersdata'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_data_dto_1.FilterDataDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "getFiltersData", null);
__decorate([
    (0, common_1.Get)('getconditionfilterdata'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [condition_filter_dto_1.ConditionFilterDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "getConditionFilterData", null);
__decorate([
    (0, common_1.Get)('fuzzysearch'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fuzzy_search_dto_1.FuzzySearchDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "fuzzySearch", null);
__decorate([
    (0, common_1.Get)('clearfiltercache'),
    __param(0, (0, common_1.Query)('channeid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "clearFilterCache", null);
exports.ListController = ListController = __decorate([
    (0, common_1.Controller)('list'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        category_validator_1.CategoryValidator])
], ListController);
//# sourceMappingURL=list.controller.js.map
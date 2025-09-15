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
exports.PublicBrowseHistoryController = void 0;
const common_1 = require("@nestjs/common");
const browse_history_service_1 = require("../services/browse-history.service");
const base_controller_1 = require("./base.controller");
let PublicBrowseHistoryController = class PublicBrowseHistoryController extends base_controller_1.BaseController {
    browseHistoryService;
    constructor(browseHistoryService) {
        super();
        this.browseHistoryService = browseHistoryService;
    }
    async getPopularBrowseHistory(limit = '20', categoryId) {
        try {
            const limitNum = this.validateId(limit, '限制数量');
            const result = {
                list: [],
                total: 0,
                message: '热门浏览记录功能开发中'
            };
            return this.success(result, '获取热门浏览记录成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取热门浏览记录失败');
        }
    }
    async getBrowseHistoryStats() {
        try {
            const result = {
                totalViews: 0,
                activeUsers: 0,
                popularCategories: [],
                message: '浏览统计功能开发中'
            };
            return this.success(result, '获取浏览统计成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取浏览统计失败');
        }
    }
    async getRecommendations(limit = '10') {
        try {
            const limitNum = this.validateId(limit, '限制数量');
            const result = {
                list: [],
                total: 0,
                message: '推荐内容功能开发中'
            };
            return this.success(result, '获取推荐内容成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取推荐内容失败');
        }
    }
};
exports.PublicBrowseHistoryController = PublicBrowseHistoryController;
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicBrowseHistoryController.prototype, "getPopularBrowseHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicBrowseHistoryController.prototype, "getBrowseHistoryStats", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicBrowseHistoryController.prototype, "getRecommendations", null);
exports.PublicBrowseHistoryController = PublicBrowseHistoryController = __decorate([
    (0, common_1.Controller)('public/browse-history'),
    __metadata("design:paramtypes", [browse_history_service_1.BrowseHistoryService])
], PublicBrowseHistoryController);
//# sourceMappingURL=public-browse-history.controller.js.map
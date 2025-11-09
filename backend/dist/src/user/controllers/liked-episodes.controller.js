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
exports.LikedEpisodesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const liked_episodes_service_1 = require("../services/liked-episodes.service");
const category_validator_1 = require("../../common/validators/category-validator");
let LikedEpisodesController = class LikedEpisodesController {
    likedEpisodesService;
    categoryValidator;
    constructor(likedEpisodesService, categoryValidator) {
        this.likedEpisodesService = likedEpisodesService;
        this.categoryValidator = categoryValidator;
    }
    async getLikedEpisodes(req, page, size, categoryId) {
        const userId = req.user?.userId;
        const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
        const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
        let categoryIdNum;
        if (categoryId) {
            categoryIdNum = parseInt(categoryId, 10);
            if (isNaN(categoryIdNum) || categoryIdNum <= 0) {
                return {
                    code: 400,
                    message: '无效的分类ID格式',
                    data: null,
                };
            }
            const validation = await this.categoryValidator.validateCategoryId(categoryIdNum);
            if (!validation.valid) {
                const availableMsg = await this.categoryValidator.formatAvailableCategoriesMessage();
                return {
                    code: 400,
                    message: `${validation.message}。${availableMsg}`,
                    data: null,
                };
            }
        }
        const result = await this.likedEpisodesService.getUserLikedEpisodes(userId, pageNum, sizeNum, categoryIdNum);
        return {
            code: 200,
            message: '获取点赞列表成功',
            data: result,
        };
    }
    async getLikedStats(req) {
        const userId = req.user?.userId;
        const stats = await this.likedEpisodesService.getUserLikedStats(userId);
        return {
            code: 200,
            message: '获取统计成功',
            data: stats,
        };
    }
};
exports.LikedEpisodesController = LikedEpisodesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], LikedEpisodesController.prototype, "getLikedEpisodes", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikedEpisodesController.prototype, "getLikedStats", null);
exports.LikedEpisodesController = LikedEpisodesController = __decorate([
    (0, common_1.Controller)('user/liked'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [liked_episodes_service_1.LikedEpisodesService,
        category_validator_1.CategoryValidator])
], LikedEpisodesController);
//# sourceMappingURL=liked-episodes.controller.js.map
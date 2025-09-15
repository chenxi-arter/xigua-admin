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
exports.BrowseHistoryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const browse_history_service_1 = require("./services/browse-history.service");
const browse_history_cleanup_service_1 = require("./services/browse-history-cleanup.service");
const base_controller_1 = require("./controllers/base.controller");
let BrowseHistoryController = class BrowseHistoryController extends base_controller_1.BaseController {
    browseHistoryService;
    browseHistoryCleanupService;
    constructor(browseHistoryService, browseHistoryCleanupService) {
        super();
        this.browseHistoryService = browseHistoryService;
        this.browseHistoryCleanupService = browseHistoryCleanupService;
    }
    async getUserBrowseHistory(req, page = '1', size = '10') {
        try {
            const { page: pageNum, size: sizeNum } = this.normalizePagination(page, size, 50);
            const result = await this.browseHistoryService.getUserBrowseHistory(Number(req.user?.userId), pageNum, sizeNum);
            return this.success(result, '获取浏览记录成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取浏览记录失败');
        }
    }
    async getRecentBrowsedSeries(req, limit = '10') {
        try {
            const limitNum = this.validateId(limit, '限制数量');
            const result = await this.browseHistoryService.getRecentBrowsedSeries(Number(req.user?.userId), limitNum);
            return this.success(result, '获取最近浏览记录成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取最近浏览记录失败');
        }
    }
    async syncBrowseHistory(req, seriesShortId, browseType = 'episode_watch', lastEpisodeNumber) {
        if (!seriesShortId) {
            return {
                code: 400,
                msg: '必须提供 seriesShortId',
                data: null
            };
        }
        const series = await this.browseHistoryService.findSeriesByShortId(seriesShortId);
        if (!series) {
            return {
                code: 400,
                msg: '无效的系列ShortID',
                data: null
            };
        }
        const seriesIdNum = series.id;
        const episodeNumber = lastEpisodeNumber ? parseInt(lastEpisodeNumber, 10) : undefined;
        await this.browseHistoryService.recordBrowseHistory(Number(req.user?.userId), seriesIdNum, browseType, episodeNumber, req);
        return {
            code: 200,
            msg: '浏览记录同步成功',
            data: null
        };
    }
    async deleteBrowseHistory(req, seriesId) {
        const seriesIdNum = parseInt(seriesId, 10);
        await this.browseHistoryService.deleteBrowseHistory(Number(req.user?.userId), seriesIdNum);
        return {
            code: 200,
            msg: '浏览记录删除成功',
            data: null
        };
    }
    async deleteAllBrowseHistory(req) {
        await this.browseHistoryService.deleteBrowseHistory(req.user.userId);
        return {
            code: 200,
            msg: '所有浏览记录删除成功',
            data: null
        };
    }
    async getSystemStats() {
        const stats = await this.browseHistoryService.getSystemStats();
        return {
            code: 200,
            data: stats,
            msg: null
        };
    }
    async cleanupExpiredRecords() {
        await this.browseHistoryService.cleanupExpiredBrowseHistory();
        return {
            code: 200,
            msg: '过期记录清理完成',
            data: null
        };
    }
    async manualCleanupExcessRecords() {
        try {
            const result = await this.browseHistoryCleanupService.manualCleanup();
            return {
                code: 200,
                msg: '浏览记录清理任务完成',
                data: {
                    processedUsers: result.processedUsers,
                    totalCleanedRecords: result.totalCleanedRecords,
                    duration: result.duration
                }
            };
        }
        catch {
            return {
                code: 500,
                msg: '浏览记录清理任务失败',
                data: null
            };
        }
    }
    async getCleanupStats() {
        try {
            const stats = await this.browseHistoryCleanupService.getCleanupStats();
            return {
                code: 200,
                msg: '获取清理统计信息成功',
                data: stats
            };
        }
        catch {
            return {
                code: 500,
                msg: '获取清理统计信息失败',
                data: null
            };
        }
    }
};
exports.BrowseHistoryController = BrowseHistoryController;
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.NORMAL),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "getUserBrowseHistory", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.NORMAL),
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "getRecentBrowsedSeries", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.STRICT),
    (0, common_1.Get)('sync'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('seriesShortId')),
    __param(2, (0, common_1.Query)('browseType')),
    __param(3, (0, common_1.Query)('lastEpisodeNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "syncBrowseHistory", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.STRICT),
    (0, common_1.Delete)(':seriesId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "deleteBrowseHistory", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.STRICT),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "deleteAllBrowseHistory", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.NORMAL),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "getSystemStats", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.STRICT),
    (0, common_1.Get)('cleanup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "cleanupExpiredRecords", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.STRICT),
    (0, common_1.Post)('cleanup-excess'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "manualCleanupExcessRecords", null);
__decorate([
    (0, rate_limit_guard_1.RateLimit)(rate_limit_guard_1.RateLimitConfigs.NORMAL),
    (0, common_1.Get)('cleanup-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseHistoryController.prototype, "getCleanupStats", null);
exports.BrowseHistoryController = BrowseHistoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rate_limit_guard_1.RateLimitGuard),
    (0, common_1.Controller)('video/browse-history'),
    __metadata("design:paramtypes", [browse_history_service_1.BrowseHistoryService,
        browse_history_cleanup_service_1.BrowseHistoryCleanupService])
], BrowseHistoryController);
//# sourceMappingURL=browse-history.controller.js.map
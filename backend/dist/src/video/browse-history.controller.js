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
let BrowseHistoryController = class BrowseHistoryController {
    browseHistoryService;
    constructor(browseHistoryService) {
        this.browseHistoryService = browseHistoryService;
    }
    async getUserBrowseHistory(req, page = '1', size = '20') {
        const pageNum = parseInt(page, 10);
        const sizeNum = parseInt(size, 10);
        return this.browseHistoryService.getUserBrowseHistory(req.user.userId, pageNum, sizeNum);
    }
    async getRecentBrowsedSeries(req, limit = '10') {
        const limitNum = parseInt(limit, 10);
        return {
            code: 200,
            data: await this.browseHistoryService.getRecentBrowsedSeries(req.user.userId, limitNum),
            msg: null
        };
    }
    async syncBrowseHistory(req, seriesShortId, browseType = 'episode_list', lastEpisodeNumber) {
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
        await this.browseHistoryService.recordBrowseHistory(req.user.userId, seriesIdNum, browseType, episodeNumber, req);
        return {
            code: 200,
            msg: '浏览记录同步成功',
            data: null
        };
    }
    async deleteBrowseHistory(req, seriesId) {
        const seriesIdNum = parseInt(seriesId, 10);
        await this.browseHistoryService.deleteBrowseHistory(req.user.userId, seriesIdNum);
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
exports.BrowseHistoryController = BrowseHistoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rate_limit_guard_1.RateLimitGuard),
    (0, common_1.Controller)('video/browse-history'),
    __metadata("design:paramtypes", [browse_history_service_1.BrowseHistoryService])
], BrowseHistoryController);
//# sourceMappingURL=browse-history.controller.js.map
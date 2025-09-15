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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const video_service_1 = require("../video.service");
const base_controller_1 = require("./base.controller");
let ProgressController = class ProgressController extends base_controller_1.BaseController {
    videoService;
    constructor(videoService) {
        super();
        this.videoService = videoService;
    }
    async saveProgress(req, episodeIdentifier, stopAtSecond) {
        try {
            if (!episodeIdentifier) {
                return this.error('剧集标识符不能为空', 400);
            }
            if (!stopAtSecond || stopAtSecond < 0) {
                return this.error('观看进度必须大于等于0', 400);
            }
            const isShortId = typeof episodeIdentifier === 'string' &&
                episodeIdentifier.length === 11 &&
                !/^\d+$/.test(episodeIdentifier);
            if (isShortId) {
                const episode = await this.videoService.getEpisodeByShortId(episodeIdentifier);
                if (!episode) {
                    return this.error('剧集不存在', 404);
                }
                const result = await this.videoService.saveProgressWithBrowseHistory(req.user.userId, episode.id, stopAtSecond, req);
                return this.success(result, '观看进度保存成功', 200);
            }
            else {
                const result = await this.videoService.saveProgressWithBrowseHistory(req.user.userId, Number(episodeIdentifier), stopAtSecond, req);
                return this.success(result, '观看进度保存成功', 200);
            }
        }
        catch (error) {
            return this.handleServiceError(error, '保存观看进度失败');
        }
    }
    async getProgress(req, episodeIdentifier) {
        try {
            if (!episodeIdentifier) {
                return this.error('剧集标识符不能为空', 400);
            }
            const isShortId = episodeIdentifier.length === 11 && !/^\d+$/.test(episodeIdentifier);
            if (isShortId) {
                const episode = await this.videoService.getEpisodeByShortId(episodeIdentifier);
                if (!episode) {
                    return this.error('剧集不存在', 404);
                }
                const result = await this.videoService.getProgress(req.user.userId, episode.id);
                return this.success(result, '获取观看进度成功', 200);
            }
            else {
                const result = await this.videoService.getProgress(req.user.userId, Number(episodeIdentifier));
                return this.success(result, '获取观看进度成功', 200);
            }
        }
        catch (error) {
            return this.handleServiceError(error, '获取观看进度失败');
        }
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('episodeIdentifier')),
    __param(2, (0, common_1.Body)('stopAtSecond')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "saveProgress", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('episodeIdentifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getProgress", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('video/progress'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map
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
exports.VideoCompatAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_jwt_auth_guard_1 = require("../../admin/guards/admin-jwt-auth.guard");
const video_service_1 = require("../video.service");
const base_controller_1 = require("./base.controller");
let VideoCompatAdminController = class VideoCompatAdminController extends base_controller_1.BaseController {
    videoService;
    constructor(videoService) {
        super();
        this.videoService = videoService;
    }
    validateHttpsUrl(value, fieldName) {
        let parsed;
        try {
            parsed = new URL(value.trim());
        }
        catch {
            throw new common_1.BadRequestException(`${fieldName}格式不正确`);
        }
        if (parsed.protocol !== 'https:') {
            throw new common_1.BadRequestException(`${fieldName}必须是 HTTPS URL`);
        }
        return parsed.toString();
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        try {
            if (!episodeId || episodeId <= 0) {
                return this.error('剧集ID无效', 400);
            }
            if (!quality || quality.trim().length === 0) {
                return this.error('清晰度不能为空', 400);
            }
            if (!ossUrl || ossUrl.trim().length === 0) {
                return this.error('OSS地址不能为空', 400);
            }
            if (!cdnUrl || cdnUrl.trim().length === 0) {
                return this.error('CDN地址不能为空', 400);
            }
            const safeOssUrl = this.validateHttpsUrl(ossUrl, 'OSS地址');
            const safeCdnUrl = this.validateHttpsUrl(cdnUrl, 'CDN地址');
            const safeSubtitleUrl = subtitleUrl?.trim()
                ? this.validateHttpsUrl(subtitleUrl, '字幕地址')
                : undefined;
            const result = await this.videoService.createEpisodeUrl(episodeId, quality.trim(), safeOssUrl, safeCdnUrl, safeSubtitleUrl);
            return this.success(result, '播放地址创建成功');
        }
        catch (error) {
            return this.handleServiceError(error, '创建播放地址失败');
        }
    }
};
exports.VideoCompatAdminController = VideoCompatAdminController;
__decorate([
    (0, common_1.Post)('episode-url'),
    __param(0, (0, common_1.Body)('episodeId')),
    __param(1, (0, common_1.Body)('quality')),
    __param(2, (0, common_1.Body)('ossUrl')),
    __param(3, (0, common_1.Body)('cdnUrl')),
    __param(4, (0, common_1.Body)('subtitleUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VideoCompatAdminController.prototype, "createEpisodeUrl", null);
exports.VideoCompatAdminController = VideoCompatAdminController = __decorate([
    (0, swagger_1.ApiTags)('播放地址（管理员）'),
    (0, common_1.Controller)('video'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoCompatAdminController);
//# sourceMappingURL=video-compat-admin.controller.js.map
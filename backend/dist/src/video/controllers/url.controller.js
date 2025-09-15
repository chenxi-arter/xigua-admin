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
exports.UrlController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("../video.service");
const base_controller_1 = require("./base.controller");
let UrlController = class UrlController extends base_controller_1.BaseController {
    videoService;
    constructor(videoService) {
        super();
        this.videoService = videoService;
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
            const result = await this.videoService.createEpisodeUrl(episodeId, quality.trim(), ossUrl.trim(), cdnUrl.trim(), subtitleUrl?.trim());
            return this.success(result, '播放地址创建成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '创建播放地址失败');
        }
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        try {
            if (!accessKey || accessKey.trim().length === 0) {
                return this.error('访问密钥不能为空', 400);
            }
            const result = await this.videoService.getEpisodeUrlByAccessKey(accessKey.trim());
            return this.success(result, '获取播放地址成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取播放地址失败');
        }
    }
    async getEpisodeUrlByKey(body) {
        try {
            const { type, accessKey, key } = body || {};
            if (type && accessKey) {
                const normalized = String(type).toLowerCase();
                if (normalized !== 'episode' && normalized !== 'url') {
                    return this.error("type仅支持'episode'或'url'", 400);
                }
                const prefix = normalized === 'episode' ? 'ep' : 'url';
                const result = await this.videoService.getEpisodeUrlByKey(prefix, String(accessKey));
                return this.success(result, '获取播放地址成功', 200);
            }
            if (key && typeof key === 'string' && key.includes(':')) {
                const [prefix, raw] = key.split(':', 2);
                const result = await this.videoService.getEpisodeUrlByKey(prefix, raw);
                return this.success(result, '获取播放地址成功', 200);
            }
            return this.error("请求体应包含{type:'episode'|'url', accessKey}，或兼容的{key:'ep:<accessKey>'}格式", 400);
        }
        catch (error) {
            return this.handleServiceError(error, '获取播放地址失败');
        }
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        try {
            if (!episodeId || episodeId <= 0) {
                return this.error('剧集ID无效', 400);
            }
            if (typeof hasSequel !== 'boolean') {
                return this.error('续集状态必须是布尔值', 400);
            }
            const result = await this.videoService.updateEpisodeSequel(episodeId, hasSequel);
            return this.success(result, '续集状态更新成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '更新续集状态失败');
        }
    }
    async generateAccessKeysForExisting() {
        try {
            const result = await this.videoService.generateAccessKeysForExisting();
            return this.success(result, '访问密钥生成完成', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '生成访问密钥失败');
        }
    }
};
exports.UrlController = UrlController;
__decorate([
    (0, common_1.Post)('episode'),
    __param(0, (0, common_1.Body)('episodeId')),
    __param(1, (0, common_1.Body)('quality')),
    __param(2, (0, common_1.Body)('ossUrl')),
    __param(3, (0, common_1.Body)('cdnUrl')),
    __param(4, (0, common_1.Body)('subtitleUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "createEpisodeUrl", null);
__decorate([
    (0, common_1.Get)('access/:accessKey'),
    __param(0, (0, common_1.Param)('accessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "getEpisodeUrlByAccessKey", null);
__decorate([
    (0, common_1.Post)('query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "getEpisodeUrlByKey", null);
__decorate([
    (0, common_1.Post)('episode/sequel'),
    __param(0, (0, common_1.Body)('episodeId')),
    __param(1, (0, common_1.Body)('hasSequel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "updateEpisodeSequel", null);
__decorate([
    (0, common_1.Post)('generate-keys'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "generateAccessKeysForExisting", null);
exports.UrlController = UrlController = __decorate([
    (0, common_1.Controller)('video/url'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], UrlController);
//# sourceMappingURL=url.controller.js.map
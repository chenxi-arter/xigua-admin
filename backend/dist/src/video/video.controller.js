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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const media_query_dto_1 = require("./dto/media-query.dto");
const episode_list_dto_1 = require("./dto/episode-list.dto");
const base_controller_1 = require("./controllers/base.controller");
let VideoController = class VideoController extends base_controller_1.BaseController {
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
                return this.success(result, '观看进度保存成功');
            }
            else {
                const result = await this.videoService.saveProgressWithBrowseHistory(req.user.userId, Number(episodeIdentifier), stopAtSecond, req);
                return this.success(result, '观看进度保存成功');
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
                return this.success(result, '获取观看进度成功');
            }
            else {
                const result = await this.videoService.getProgress(req.user.userId, Number(episodeIdentifier));
                return this.success(result, '获取观看进度成功');
            }
        }
        catch (error) {
            return this.handleServiceError(error, '获取观看进度失败');
        }
    }
    async addComment(req, episodeIdentifier, content, appearSecond) {
        try {
            if (!episodeIdentifier) {
                return this.error('剧集标识符不能为空', 400);
            }
            if (!content || content.trim().length === 0) {
                return this.error('评论内容不能为空', 400);
            }
            if (content.length > 500) {
                return this.error('评论内容不能超过500个字符', 400);
            }
            const isShortId = typeof episodeIdentifier === 'string' &&
                episodeIdentifier.length === 11 &&
                !/^\d+$/.test(episodeIdentifier);
            const episode = await this.videoService.getEpisodeByShortId(isShortId ? episodeIdentifier : String(episodeIdentifier));
            if (!episode) {
                return this.error('剧集不存在', 404);
            }
            const result = await this.videoService.addComment(req.user.userId, episode.shortId, content.trim(), appearSecond);
            return this.success(result, '评论发表成功');
        }
        catch (error) {
            return this.handleServiceError(error, '发表评论失败');
        }
    }
    async listMediaUser(req, dto) {
        try {
            const { page, size } = this.normalizePagination(dto.page, dto.size, 200);
            const result = await this.videoService.listMedia(dto.categoryId, dto.type, req.user.userId, dto.sort || 'latest', page, size);
            return this.success(result, '获取媒体列表成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取媒体列表失败');
        }
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
            return this.success(result, '播放地址创建成功');
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
            return this.success(result, '获取播放地址成功');
        }
        catch (error) {
            return this.handleServiceError(error, '获取播放地址失败');
        }
    }
    async postEpisodeUrlByKey(body) {
        try {
            const { type, accessKey, key } = body || {};
            if (type && accessKey) {
                const normalized = String(type).toLowerCase();
                if (normalized !== 'episode' && normalized !== 'url') {
                    return this.error("type仅支持'episode'或'url'", 400);
                }
                const prefix = normalized === 'episode' ? 'ep' : 'url';
                const result = await this.videoService.getEpisodeUrlByKey(prefix, String(accessKey));
                return this.success(result, '获取播放地址成功');
            }
            if (key && typeof key === 'string' && key.includes(':')) {
                const [prefix, raw] = key.split(':', 2);
                const result = await this.videoService.getEpisodeUrlByKey(prefix, raw);
                return this.success(result, '获取播放地址成功');
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
            return this.success(result, '续集状态更新成功');
        }
        catch (error) {
            return this.handleServiceError(error, '更新续集状态失败');
        }
    }
    async generateAccessKeysForExisting() {
        try {
            const result = await this.videoService.generateAccessKeysForExisting();
            return this.success(result, '访问密钥生成完成');
        }
        catch (error) {
            return this.handleServiceError(error, '生成访问密钥失败');
        }
    }
    async getEpisodeList(dto, req) {
        try {
            const { page, size } = this.normalizePagination(dto.page, dto.size, 200);
            if (dto.seriesShortId) {
                const result = await this.videoService.getEpisodeList(dto.seriesShortId, true, page, size, req.user?.userId);
                return result;
            }
            else if (dto.seriesId) {
                const result = await this.videoService.getEpisodeList(dto.seriesId, false, page, size, req.user?.userId);
                return result;
            }
            else {
                const result = await this.videoService.getEpisodeList(undefined, false, page, size, req.user?.userId);
                return result;
            }
        }
        catch (error) {
            return this.handleServiceError(error, '获取剧集列表失败');
        }
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)('progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('episodeIdentifier')),
    __param(2, (0, common_1.Body)('stopAtSecond')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "saveProgress", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('episodeIdentifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('comment'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('episodeIdentifier')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('appearSecond')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('media'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, media_query_dto_1.MediaQueryDto]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "listMediaUser", null);
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
], VideoController.prototype, "createEpisodeUrl", null);
__decorate([
    (0, common_1.Get)('episode-url/:accessKey'),
    __param(0, (0, common_1.Param)('accessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getEpisodeUrlByAccessKey", null);
__decorate([
    (0, common_1.Post)('episode-url/query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "postEpisodeUrlByKey", null);
__decorate([
    (0, common_1.Post)('episode-sequel'),
    __param(0, (0, common_1.Body)('episodeId')),
    __param(1, (0, common_1.Body)('hasSequel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "updateEpisodeSequel", null);
__decorate([
    (0, common_1.Post)('generate-access-keys'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "generateAccessKeysForExisting", null);
__decorate([
    (0, common_1.Get)('episodes'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_list_dto_1.EpisodeListDto, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getEpisodeList", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map
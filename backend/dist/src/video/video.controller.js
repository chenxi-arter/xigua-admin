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
let VideoController = class VideoController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async saveProgress(req, episodeIdentifier, stopAtSecond) {
        const isShortId = typeof episodeIdentifier === 'string' && episodeIdentifier.length === 11 && !/^\d+$/.test(episodeIdentifier);
        if (isShortId) {
            const episode = await this.videoService.getEpisodeByShortId(episodeIdentifier);
            if (!episode) {
                throw new common_1.BadRequestException('剧集不存在');
            }
            return this.videoService.saveProgress(req.user.userId, episode.id, stopAtSecond);
        }
        else {
            return this.videoService.saveProgress(req.user.userId, Number(episodeIdentifier), stopAtSecond);
        }
    }
    async getProgress(req, episodeIdentifier) {
        const isShortId = episodeIdentifier.length === 11 && !/^\d+$/.test(episodeIdentifier);
        if (isShortId) {
            const episode = await this.videoService.getEpisodeByShortId(episodeIdentifier);
            if (!episode) {
                throw new common_1.BadRequestException('剧集不存在');
            }
            return this.videoService.getProgress(req.user.userId, episode.id);
        }
        else {
            return this.videoService.getProgress(req.user.userId, Number(episodeIdentifier));
        }
    }
    async addComment(req, episodeIdentifier, content, appearSecond) {
        const isShortId = typeof episodeIdentifier === 'string' && episodeIdentifier.length === 11 && !/^\d+$/.test(episodeIdentifier);
        if (isShortId) {
            const episode = await this.videoService.getEpisodeByShortId(episodeIdentifier);
            if (!episode) {
                throw new common_1.BadRequestException('剧集不存在');
            }
            return this.videoService.addComment(req.user.userId, episode.id, content, appearSecond);
        }
        else {
            return this.videoService.addComment(req.user.userId, Number(episodeIdentifier), content, appearSecond);
        }
    }
    async listMediaUser(req, dto) {
        return this.videoService.listMedia(dto.categoryId, dto.type, req.user.userId);
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        return this.videoService.createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl);
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        return this.videoService.getEpisodeUrlByAccessKey(accessKey);
    }
    async postEpisodeUrlByKey(body) {
        const { type, accessKey, key } = body || {};
        if (type && accessKey) {
            const normalized = String(type).toLowerCase();
            if (normalized !== 'episode' && normalized !== 'url') {
                throw new common_1.BadRequestException("type 仅支持 'episode' 或 'url'");
            }
            const prefix = normalized === 'episode' ? 'ep' : 'url';
            return this.videoService.getEpisodeUrlByKey(prefix, String(accessKey));
        }
        if (key && typeof key === 'string' && key.includes(':')) {
            const [prefix, raw] = key.split(':', 2);
            return this.videoService.getEpisodeUrlByKey(prefix, raw);
        }
        throw new common_1.BadRequestException("请求体应包含 { type: 'episode'|'url', accessKey }，或兼容的 { key: 'ep:<accessKey>' } 格式");
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        return this.videoService.updateEpisodeSequel(episodeId, hasSequel);
    }
    async generateAccessKeysForExisting() {
        return this.videoService.generateAccessKeysForExisting();
    }
    async getEpisodeList(dto, req) {
        const page = parseInt(dto.page || '1', 10);
        const size = parseInt(dto.size || '20', 10);
        if (dto.seriesShortId) {
            return this.videoService.getEpisodeList(dto.seriesShortId, true, page, size, req.user?.userId, req);
        }
        else if (dto.seriesId) {
            return this.videoService.getEpisodeList(dto.seriesId, false, page, size, req.user?.userId, req);
        }
        else {
            return this.videoService.getEpisodeList(undefined, false, page, size, req.user?.userId, req);
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
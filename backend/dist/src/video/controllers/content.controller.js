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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const video_service_1 = require("../video.service");
const media_query_dto_1 = require("../dto/media-query.dto");
const episode_list_dto_1 = require("../dto/episode-list.dto");
const base_controller_1 = require("./base.controller");
let ContentController = class ContentController extends base_controller_1.BaseController {
    videoService;
    constructor(videoService) {
        super();
        this.videoService = videoService;
    }
    async listMediaUser(req, dto) {
        try {
            const { page, size } = this.normalizePagination(dto.page, dto.size, 50);
            const result = await this.videoService.listMedia(dto.categoryId, dto.type, req.user.userId, dto.sort || 'latest', page, size);
            return this.success(result, '获取媒体列表成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取媒体列表失败');
        }
    }
    async getEpisodeList(dto, req) {
        try {
            const { page, size } = this.normalizePagination(dto.page, dto.size, 200);
            if (dto.seriesShortId) {
                const result = await this.videoService.getEpisodeList(dto.seriesShortId, true, page, size, req.user?.userId);
                return this.success(result, '获取剧集列表成功', 200);
            }
            else if (dto.seriesId) {
                const result = await this.videoService.getEpisodeList(dto.seriesId, false, page, size, req.user?.userId);
                return this.success(result, '获取剧集列表成功', 200);
            }
            else {
                const result = await this.videoService.getEpisodeList(undefined, false, page, size, req.user?.userId);
                return this.success(result, '获取剧集列表成功', 200);
            }
        }
        catch (error) {
            return this.handleServiceError(error, '获取剧集列表失败');
        }
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('media'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, media_query_dto_1.MediaQueryDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "listMediaUser", null);
__decorate([
    (0, common_1.Get)('episodes'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_list_dto_1.EpisodeListDto, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getEpisodeList", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], ContentController);
//# sourceMappingURL=content.controller.js.map
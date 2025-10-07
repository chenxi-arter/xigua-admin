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
exports.PublicVideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const media_query_dto_1 = require("./dto/media-query.dto");
const episode_list_dto_1 = require("./dto/episode-list.dto");
let PublicVideoController = class PublicVideoController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async listSeriesFull(dto) {
        return this.videoService.listSeriesFull(dto.categoryId, dto.page, dto.size);
    }
    async listSeriesByCategory(categoryId) {
        return this.videoService.listSeriesByCategory(categoryId);
    }
    async getSeriesDetail(id) {
        return this.videoService.getSeriesDetail(id);
    }
    async listMedia(dto) {
        const { categoryId, type, sort, page, size } = dto;
        return this.videoService.listMedia(categoryId, type, undefined, sort, page, size);
    }
    async getPublicEpisodeList(dto) {
        const page = Math.max(1, parseInt(dto.page || '1', 10));
        const size = Math.min(200, Math.max(1, parseInt(dto.size || '20', 10)));
        if (dto.seriesShortId) {
            return this.videoService.getEpisodeList(dto.seriesShortId, true, page, size, undefined);
        }
        else if (dto.seriesId) {
            return this.videoService.getEpisodeList(dto.seriesId, false, page, size, undefined);
        }
        else {
            return this.videoService.getEpisodeList(undefined, false, page, size, undefined);
        }
    }
};
exports.PublicVideoController = PublicVideoController;
__decorate([
    (0, common_1.Get)('/series/list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_query_dto_1.MediaQueryDto]),
    __metadata("design:returntype", Promise)
], PublicVideoController.prototype, "listSeriesFull", null);
__decorate([
    (0, common_1.Get)('series'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicVideoController.prototype, "listSeriesByCategory", null);
__decorate([
    (0, common_1.Get)('series/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicVideoController.prototype, "getSeriesDetail", null);
__decorate([
    (0, common_1.Get)('media'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_query_dto_1.MediaQueryDto]),
    __metadata("design:returntype", Promise)
], PublicVideoController.prototype, "listMedia", null);
__decorate([
    (0, common_1.Get)('episodes'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_list_dto_1.EpisodeListDto]),
    __metadata("design:returntype", Promise)
], PublicVideoController.prototype, "getPublicEpisodeList", null);
exports.PublicVideoController = PublicVideoController = __decorate([
    (0, common_1.Controller)('public/video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], PublicVideoController);
//# sourceMappingURL=public-video.controller.js.map
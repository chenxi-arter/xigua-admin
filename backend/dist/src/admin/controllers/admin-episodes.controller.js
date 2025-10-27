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
exports.AdminEpisodesController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_entity_1 = require("../../video/entity/episode.entity");
const episode_url_entity_1 = require("../../video/entity/episode-url.entity");
let AdminEpisodesController = class AdminEpisodesController {
    episodeRepo;
    episodeUrlRepo;
    constructor(episodeRepo, episodeUrlRepo) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
    }
    normalize(raw) {
        const toInt = (v) => (typeof v === 'string' || typeof v === 'number') ? Number(v) : undefined;
        const toStr = (v) => (typeof v === 'string') ? v : undefined;
        const toBool = (v) => {
            if (v === undefined || v === null)
                return undefined;
            if (typeof v === 'boolean')
                return v;
            if (v === 'true' || v === '1' || v === 1)
                return true;
            if (v === 'false' || v === '0' || v === 0)
                return false;
            return undefined;
        };
        const payload = {};
        const seriesId = toInt(raw.seriesId);
        if (seriesId !== undefined)
            payload.seriesId = seriesId;
        const episodeNumber = toInt(raw.episodeNumber);
        if (episodeNumber !== undefined)
            payload.episodeNumber = episodeNumber;
        const duration = toInt(raw.duration);
        if (duration !== undefined)
            payload.duration = duration;
        const status = toStr(raw.status);
        if (status !== undefined)
            payload.status = status;
        const title = toStr(raw.title);
        if (title !== undefined)
            payload.title = title;
        const isVertical = toBool(raw.isVertical);
        if (isVertical !== undefined)
            payload.isVertical = isVertical;
        const playCount = toInt(raw.playCount);
        if (playCount !== undefined)
            payload.playCount = playCount;
        const likeCount = toInt(raw.likeCount);
        if (likeCount !== undefined)
            payload.likeCount = likeCount;
        const dislikeCount = toInt(raw.dislikeCount);
        if (dislikeCount !== undefined)
            payload.dislikeCount = dislikeCount;
        const favoriteCount = toInt(raw.favoriteCount);
        if (favoriteCount !== undefined)
            payload.favoriteCount = favoriteCount;
        return payload;
    }
    async list(page = 1, size = 20, seriesId, minDuration, maxDuration) {
        const take = Math.min(200, Math.max(Number(size) || 20, 1));
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const whereClause = {};
        if (seriesId) {
            whereClause.seriesId = Number(seriesId);
        }
        const minDur = minDuration ? Number(minDuration) : undefined;
        const maxDur = maxDuration ? Number(maxDuration) : undefined;
        if (minDur !== undefined && !isNaN(minDur) && maxDur !== undefined && !isNaN(maxDur)) {
            whereClause.duration = (0, typeorm_2.Between)(minDur, maxDur);
        }
        else if (minDur !== undefined && !isNaN(minDur)) {
            whereClause.duration = (0, typeorm_2.MoreThanOrEqual)(minDur);
        }
        else if (maxDur !== undefined && !isNaN(maxDur)) {
            whereClause.duration = (0, typeorm_2.LessThanOrEqual)(maxDur);
        }
        const [items, total] = await this.episodeRepo.findAndCount({
            skip,
            take,
            order: { id: 'DESC' },
            relations: ['series'],
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        });
        const mappedItems = items.map(item => ({
            ...item,
            seriesTitle: item.series?.title || '',
        }));
        return { total, items: mappedItems, page: Number(page) || 1, size: take };
    }
    async get(id) {
        return this.episodeRepo.findOne({ where: { id: Number(id) }, relations: ['series', 'urls'] });
    }
    async create(body) {
        const entity = this.episodeRepo.create(this.normalize(body));
        return this.episodeRepo.save(entity);
    }
    async update(id, body) {
        const payload = this.normalize(body);
        await this.episodeRepo.update({ id: Number(id) }, payload);
        return this.episodeRepo.findOne({ where: { id: Number(id) }, relations: ['series', 'urls'] });
    }
    async remove(id) {
        await this.episodeRepo.delete({ id: Number(id) });
        return { success: true };
    }
    async getDownloadUrls(id) {
        const episode = await this.episodeRepo.findOne({
            where: { id: Number(id) },
            relations: ['series', 'urls']
        });
        if (!episode) {
            return { success: false, message: '剧集不存在' };
        }
        const downloadUrls = episode.urls?.map(url => ({
            id: url.id,
            quality: url.quality,
            cdnUrl: url.cdnUrl,
            ossUrl: url.ossUrl,
            originUrl: url.originUrl,
            subtitleUrl: url.subtitleUrl,
            accessKey: url.accessKey,
        })) || [];
        return {
            success: true,
            episodeId: episode.id,
            episodeShortId: episode.shortId,
            episodeTitle: episode.title,
            episodeNumber: episode.episodeNumber,
            seriesId: episode.seriesId,
            seriesTitle: episode.series?.title || '',
            duration: episode.duration,
            downloadUrls
        };
    }
};
exports.AdminEpisodesController = AdminEpisodesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('seriesId')),
    __param(3, (0, common_1.Query)('minDuration')),
    __param(4, (0, common_1.Query)('maxDuration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/download-urls'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "getDownloadUrls", null);
exports.AdminEpisodesController = AdminEpisodesController = __decorate([
    (0, common_1.Controller)('admin/episodes'),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminEpisodesController);
//# sourceMappingURL=admin-episodes.controller.js.map
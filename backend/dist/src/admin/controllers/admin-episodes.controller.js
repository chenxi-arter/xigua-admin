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
const r2_storage_service_1 = require("../../core/storage/r2-storage.service");
const presigned_upload_dto_1 = require("../dto/presigned-upload.dto");
const crypto_1 = require("crypto");
let AdminEpisodesController = class AdminEpisodesController {
    episodeRepo;
    episodeUrlRepo;
    storage;
    constructor(episodeRepo, episodeUrlRepo, storage) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.storage = storage;
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
    async getPresignedUploadUrl(id, query) {
        const episode = await this.episodeRepo.findOne({ where: { id: Number(id) } });
        if (!episode) {
            throw new common_1.NotFoundException('Episode not found');
        }
        const { filename, contentType, quality = '720p' } = query;
        const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        if (!allowedVideoTypes.includes(contentType)) {
            throw new common_1.BadRequestException('Invalid video type. Allowed: MP4, MPEG, MOV, AVI, WebM');
        }
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            throw new common_1.BadRequestException('Invalid filename');
        }
        const extension = filename.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['mp4', 'mpeg', 'mpg', 'mov', 'avi', 'webm'];
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new common_1.BadRequestException('Invalid file extension');
        }
        const allowedQualities = ['360p', '480p', '720p', '1080p', '1440p', '2160p'];
        if (quality && !allowedQualities.includes(quality)) {
            throw new common_1.BadRequestException('Invalid quality parameter');
        }
        const fileKey = `episodes/${id}/video_${quality}_${(0, crypto_1.randomUUID)()}.${extension}`;
        const uploadUrl = await this.storage.generatePresignedUploadUrl(fileKey, contentType, 7200);
        const publicUrl = this.storage.getPublicUrl(fileKey);
        return {
            uploadUrl,
            fileKey,
            publicUrl,
            quality,
        };
    }
    async uploadComplete(id, body) {
        const { fileKey, publicUrl, quality, fileSize } = body;
        if (!fileKey || !publicUrl) {
            throw new common_1.BadRequestException('fileKey and publicUrl are required');
        }
        const episode = await this.episodeRepo.findOne({ where: { id: Number(id) } });
        if (!episode) {
            throw new common_1.NotFoundException('Episode not found');
        }
        const whereCondition = {
            episodeId: Number(id),
            quality: quality || null,
        };
        const existingUrl = await this.episodeUrlRepo.findOne({
            where: whereCondition,
        });
        if (existingUrl) {
            await this.episodeUrlRepo.update({ id: existingUrl.id }, {
                cdnUrl: publicUrl,
                ossUrl: publicUrl,
                originUrl: publicUrl,
                updatedAt: new Date(),
            });
        }
        else {
            const episodeUrl = this.episodeUrlRepo.create({
                episodeId: Number(id),
                quality: quality || undefined,
                cdnUrl: publicUrl,
                ossUrl: publicUrl,
                originUrl: publicUrl,
            });
            await this.episodeUrlRepo.save(episodeUrl);
        }
        return {
            success: true,
            message: 'Video upload completed',
            publicUrl,
            quality,
            fileSize,
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
__decorate([
    (0, common_1.Get)(':id/presigned-upload-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.GetVideoPresignedUrlDto]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "getPresignedUploadUrl", null);
__decorate([
    (0, common_1.Post)(':id/upload-complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.VideoUploadCompleteDto]),
    __metadata("design:returntype", Promise)
], AdminEpisodesController.prototype, "uploadComplete", null);
exports.AdminEpisodesController = AdminEpisodesController = __decorate([
    (0, common_1.Controller)('admin/episodes'),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        r2_storage_service_1.R2StorageService])
], AdminEpisodesController);
//# sourceMappingURL=admin-episodes.controller.js.map
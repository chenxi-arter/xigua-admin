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
exports.AdminBannersController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banner_entity_1 = require("../../video/entity/banner.entity");
const r2_storage_service_1 = require("../../core/storage/r2-storage.service");
const platform_express_1 = require("@nestjs/platform-express");
const axios_1 = require("axios");
const https = require("https");
let AdminBannersController = class AdminBannersController {
    bannerRepo;
    storage;
    constructor(bannerRepo, storage) {
        this.bannerRepo = bannerRepo;
        this.storage = storage;
    }
    normalize(raw) {
        const toInt = (v) => (typeof v === 'string' || typeof v === 'number') ? Number(v) : undefined;
        const toBool = (v) => v === undefined ? undefined : (v === true || v === 'true' || v === 1 || v === '1');
        const toDate = (v) => (typeof v === 'string' || v instanceof Date) ? new Date(v) : undefined;
        const payload = {};
        if (typeof raw.title === 'string')
            payload.title = raw.title;
        if (typeof raw.imageUrl === 'string')
            payload.imageUrl = raw.imageUrl;
        if (typeof raw.linkUrl === 'string')
            payload.linkUrl = raw.linkUrl;
        if (typeof raw.description === 'string')
            payload.description = raw.description;
        const seriesId = toInt(raw.seriesId);
        if (seriesId !== undefined)
            payload.seriesId = seriesId;
        const categoryId = toInt(raw.categoryId);
        if (categoryId !== undefined)
            payload.categoryId = categoryId;
        const weight = toInt(raw.weight);
        if (weight !== undefined)
            payload.weight = weight;
        const impressions = toInt(raw.impressions);
        if (impressions !== undefined)
            payload.impressions = impressions;
        const clicks = toInt(raw.clicks);
        if (clicks !== undefined)
            payload.clicks = clicks;
        const isActive = toBool(raw.isActive);
        if (isActive !== undefined)
            payload.isActive = isActive;
        const isAd = toBool(raw.isAd);
        if (isAd !== undefined)
            payload.isAd = isAd;
        const startTime = toDate(raw.startTime);
        if (startTime !== undefined)
            payload.startTime = startTime;
        const endTime = toDate(raw.endTime);
        if (endTime !== undefined)
            payload.endTime = endTime;
        return payload;
    }
    async list(page = 1, size = 20) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const [items, total] = await this.bannerRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
        return { total, items, page: Number(page) || 1, size: take };
    }
    async get(id) {
        return this.bannerRepo.findOne({ where: { id: Number(id) } });
    }
    async create(body) {
        const entity = this.bannerRepo.create(this.normalize(body));
        return this.bannerRepo.save(entity);
    }
    async update(id, body) {
        const payload = this.normalize(body);
        await this.bannerRepo.update({ id: Number(id) }, payload);
        return this.bannerRepo.findOne({ where: { id: Number(id) } });
    }
    async remove(id) {
        await this.bannerRepo.delete({ id: Number(id) });
        return { success: true };
    }
    async uploadImage(id, file) {
        if (!file || !file.buffer)
            throw new common_1.BadRequestException('file is required');
        const { url, key } = await this.storage.uploadBuffer(file.buffer, file.originalname, {
            keyPrefix: 'banners/',
            contentType: file.mimetype,
        });
        const imageUrl = url ?? key;
        await this.bannerRepo.update({ id: Number(id) }, { imageUrl });
        return this.bannerRepo.findOne({ where: { id: Number(id) } });
    }
    async uploadImageFromUrl(id, src) {
        if (!src)
            throw new common_1.BadRequestException('url is required');
        const allowInsecure = process.env.ALLOW_INSECURE_EXTERNAL_FETCH === 'true';
        const httpsAgent = new https.Agent({ rejectUnauthorized: !allowInsecure });
        const resp = await axios_1.default.get(src, {
            responseType: 'arraybuffer',
            httpsAgent,
            timeout: 15000,
        });
        const buffer = Buffer.from(resp.data);
        const contentType = resp.headers['content-type'];
        const { url, key } = await this.storage.uploadBuffer(buffer, undefined, {
            keyPrefix: 'banners/',
            contentType,
        });
        const imageUrl = url ?? key;
        await this.bannerRepo.update({ id: Number(id) }, { imageUrl });
        return this.bannerRepo.findOne({ where: { id: Number(id) } });
    }
};
exports.AdminBannersController = AdminBannersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)(':id/image-from-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "uploadImageFromUrl", null);
exports.AdminBannersController = AdminBannersController = __decorate([
    (0, common_1.Controller)('admin/banners'),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        r2_storage_service_1.R2StorageService])
], AdminBannersController);
//# sourceMappingURL=admin-banners.controller.js.map
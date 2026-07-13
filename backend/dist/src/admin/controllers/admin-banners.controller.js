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
const presigned_upload_dto_1 = require("../dto/presigned-upload.dto");
const crypto_1 = require("crypto");
const axios_1 = require("axios");
const promises_1 = require("dns/promises");
const net_1 = require("net");
const https = require("https");
const admin_jwt_auth_guard_1 = require("../guards/admin-jwt-auth.guard");
let AdminBannersController = class AdminBannersController {
    bannerRepo;
    storage;
    constructor(bannerRepo, storage) {
        this.bannerRepo = bannerRepo;
        this.storage = storage;
    }
    async validateExternalImageUrl(rawUrl) {
        let parsed;
        try {
            parsed = new URL(rawUrl);
        }
        catch {
            throw new common_1.BadRequestException('Invalid URL');
        }
        if (parsed.protocol !== 'https:') {
            throw new common_1.BadRequestException('Only HTTPS URLs are allowed');
        }
        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
            throw new common_1.BadRequestException('Localhost URLs are not allowed');
        }
        const addresses = (0, net_1.isIP)(hostname) ? [{ address: hostname }] : await (0, promises_1.lookup)(hostname, { all: true });
        if (addresses.some(({ address }) => this.isPrivateOrReservedIp(address))) {
            throw new common_1.BadRequestException('Private or reserved IP addresses are not allowed');
        }
        return parsed.toString();
    }
    isPrivateOrReservedIp(address) {
        if (address === '::1' || address.startsWith('fe80:') || address.startsWith('fc') || address.startsWith('fd')) {
            return true;
        }
        const parts = address.split('.').map(Number);
        if (parts.length !== 4 || parts.some(part => !Number.isInteger(part))) {
            return false;
        }
        const [a, b] = parts;
        return a === 10
            || a === 127
            || a === 0
            || a === 169 && b === 254
            || a === 172 && b >= 16 && b <= 31
            || a === 192 && b === 168
            || a === 100 && b >= 64 && b <= 127
            || a >= 224;
    }
    buildPublicUrlFromKey(fileKey, allowedPrefix) {
        if (!fileKey.startsWith(allowedPrefix) || fileKey.includes('..') || fileKey.startsWith('/')) {
            throw new common_1.BadRequestException('Invalid fileKey');
        }
        return this.storage.getPublicUrl(fileKey);
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
            payload.linkUrl = this.validateHttpsUrl(raw.linkUrl, 'linkUrl');
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
    async getPresignedUploadUrl(id, query) {
        const banner = await this.bannerRepo.findOne({ where: { id: Number(id) } });
        if (!banner) {
            throw new common_1.NotFoundException('Banner not found');
        }
        const { filename, contentType } = query;
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedImageTypes.includes(contentType)) {
            throw new common_1.BadRequestException('Invalid image type. Allowed: JPEG, PNG, WebP, GIF');
        }
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            throw new common_1.BadRequestException('Invalid filename');
        }
        const extension = filename.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new common_1.BadRequestException('Invalid file extension');
        }
        const fileKey = `banners/${id}/image_${(0, crypto_1.randomUUID)()}.${extension}`;
        const uploadUrl = await this.storage.generatePresignedUploadUrl(fileKey, contentType, 3600);
        const publicUrl = this.storage.getPublicUrl(fileKey);
        return {
            uploadUrl,
            fileKey,
            publicUrl,
        };
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
        const safeUrl = await this.validateExternalImageUrl(src);
        const allowInsecure = process.env.ALLOW_INSECURE_EXTERNAL_FETCH === 'true';
        const httpsAgent = new https.Agent({ rejectUnauthorized: !allowInsecure });
        const resp = await axios_1.default.get(safeUrl, {
            responseType: 'arraybuffer',
            httpsAgent,
            timeout: 15000,
            maxRedirects: 0,
            maxContentLength: 10 * 1024 * 1024,
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
    async uploadComplete(id, body) {
        const { fileKey } = body;
        if (!fileKey) {
            throw new common_1.BadRequestException('fileKey is required');
        }
        const banner = await this.bannerRepo.findOne({ where: { id: Number(id) } });
        if (!banner) {
            throw new common_1.NotFoundException('Banner not found');
        }
        const publicUrl = this.buildPublicUrlFromKey(fileKey, `banners/${id}/`);
        if (!(await this.storage.objectExists(fileKey))) {
            throw new common_1.BadRequestException('Uploaded object not found');
        }
        await this.bannerRepo.update({ id: Number(id) }, {
            imageUrl: publicUrl,
            updatedAt: new Date(),
        });
        return {
            success: true,
            message: 'Image upload completed',
            imageUrl: publicUrl,
        };
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
    (0, common_1.Get)(':id/presigned-upload-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.GetPresignedUrlDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "getPresignedUploadUrl", null);
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
__decorate([
    (0, common_1.Post)(':id/upload-complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.UploadCompleteDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "uploadComplete", null);
exports.AdminBannersController = AdminBannersController = __decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Controller)('admin/banners'),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        r2_storage_service_1.R2StorageService])
], AdminBannersController);
//# sourceMappingURL=admin-banners.controller.js.map
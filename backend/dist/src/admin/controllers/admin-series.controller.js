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
exports.AdminSeriesController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const series_entity_1 = require("../../video/entity/series.entity");
const filter_option_entity_1 = require("../../video/entity/filter-option.entity");
const video_service_1 = require("../../video/video.service");
const r2_storage_service_1 = require("../../core/storage/r2-storage.service");
const platform_express_1 = require("@nestjs/platform-express");
const presigned_upload_dto_1 = require("../dto/presigned-upload.dto");
const crypto_1 = require("crypto");
const axios_1 = require("axios");
const https = require("https");
let AdminSeriesController = class AdminSeriesController {
    seriesRepo;
    filterOptionRepo;
    videoService;
    storage;
    constructor(seriesRepo, filterOptionRepo, videoService, storage) {
        this.seriesRepo = seriesRepo;
        this.filterOptionRepo = filterOptionRepo;
        this.videoService = videoService;
        this.storage = storage;
    }
    async findFilterOptionIdByName(name, typeCode) {
        if (!name)
            return undefined;
        const option = await this.filterOptionRepo
            .createQueryBuilder('option')
            .innerJoin('option.filterType', 'filterType')
            .where('option.name = :name', { name })
            .andWhere('filterType.code = :typeCode', { typeCode })
            .getOne();
        return option?.id;
    }
    async resolveChineseFilters(raw) {
        const result = {};
        if (typeof raw.region === 'string') {
            const id = await this.findFilterOptionIdByName(raw.region, 'region');
            if (id)
                result.regionOptionId = id;
        }
        if (typeof raw.language === 'string') {
            const id = await this.findFilterOptionIdByName(raw.language, 'language');
            if (id)
                result.languageOptionId = id;
        }
        if (typeof raw.status === 'string') {
            const id = await this.findFilterOptionIdByName(raw.status, 'status');
            if (id)
                result.statusOptionId = id;
        }
        if (typeof raw.year === 'string') {
            const id = await this.findFilterOptionIdByName(raw.year, 'year');
            if (id)
                result.yearOptionId = id;
        }
        return result;
    }
    normalize(raw) {
        const toInt = (v) => (typeof v === 'string' || typeof v === 'number') ? Number(v) : undefined;
        const toFloat = (v) => (typeof v === 'string' || typeof v === 'number') ? Number(v) : undefined;
        const toBoolNum = (v) => v === undefined ? undefined : ((v === true || v === 'true' || v === 1 || v === '1') ? 1 : 0);
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
        const toDate = (v) => (typeof v === 'string' || v instanceof Date) ? new Date(v) : undefined;
        const payload = {};
        if (typeof raw.title === 'string')
            payload.title = raw.title;
        if (typeof raw.description === 'string')
            payload.description = raw.description;
        if (typeof raw.coverUrl === 'string')
            payload.coverUrl = raw.coverUrl;
        if (typeof raw.starring === 'string')
            payload.starring = raw.starring;
        if (typeof raw.actor === 'string')
            payload.actor = raw.actor;
        if (typeof raw.director === 'string')
            payload.director = raw.director;
        if (typeof raw.upStatus === 'string')
            payload.upStatus = raw.upStatus;
        const categoryId = toInt(raw.categoryId);
        if (categoryId !== undefined)
            payload.categoryId = categoryId;
        const score = toFloat(raw.score);
        if (score !== undefined)
            payload.score = score;
        const upCount = toInt(raw.upCount);
        if (upCount !== undefined)
            payload.upCount = upCount;
        const regionOptionId = toInt(raw.regionOptionId);
        if (regionOptionId !== undefined)
            payload.regionOptionId = regionOptionId;
        const languageOptionId = toInt(raw.languageOptionId);
        if (languageOptionId !== undefined)
            payload.languageOptionId = languageOptionId;
        const statusOptionId = toInt(raw.statusOptionId);
        if (statusOptionId !== undefined)
            payload.statusOptionId = statusOptionId;
        const yearOptionId = toInt(raw.yearOptionId);
        if (yearOptionId !== undefined)
            payload.yearOptionId = yearOptionId;
        const isCompleted = toBool(raw.isCompleted);
        if (isCompleted !== undefined)
            payload.isCompleted = isCompleted;
        const isActive = toBoolNum(raw.isActive);
        if (isActive !== undefined)
            payload.isActive = isActive;
        const releaseDate = toDate(raw.releaseDate);
        if (releaseDate !== undefined)
            payload.releaseDate = releaseDate;
        return payload;
    }
    async list(page = 1, size = 20, includeDeleted, categoryId) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const where = includeDeleted === 'true' ? {} : { isActive: 1 };
        if (categoryId && !isNaN(Number(categoryId))) {
            where.categoryId = Number(categoryId);
        }
        const [items, total] = await this.seriesRepo.findAndCount({
            skip,
            take,
            order: { id: 'DESC' },
            where,
            relations: [
                'category',
                'regionOption',
                'languageOption',
                'statusOption',
                'yearOption'
            ]
        });
        return { total, items, page: Number(page) || 1, size: take };
    }
    async getDeleted(page = 1, size = 20) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const [items, total] = await this.seriesRepo.findAndCount({
            skip,
            take,
            order: { deletedAt: 'DESC' },
            where: { isActive: 0 }
        });
        return { total, items, page: Number(page) || 1, size: take };
    }
    async getPresignedUploadUrl(id, query) {
        const series = await this.seriesRepo.findOne({ where: { id: Number(id) } });
        if (!series) {
            throw new common_1.NotFoundException('Series not found');
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
        const fileKey = `series/${id}/cover_${(0, crypto_1.randomUUID)()}.${extension}`;
        const uploadUrl = await this.storage.generatePresignedUploadUrl(fileKey, contentType, 3600);
        const publicUrl = this.storage.getPublicUrl(fileKey);
        return {
            uploadUrl,
            fileKey,
            publicUrl,
        };
    }
    async uploadComplete(id, body) {
        const { fileKey, publicUrl } = body;
        if (!fileKey || !publicUrl) {
            throw new common_1.BadRequestException('fileKey and publicUrl are required');
        }
        const series = await this.seriesRepo.findOne({ where: { id: Number(id) } });
        if (!series) {
            throw new common_1.NotFoundException('Series not found');
        }
        await this.seriesRepo.update({ id: Number(id) }, {
            coverUrl: publicUrl,
            updatedAt: new Date(),
        });
        return {
            success: true,
            message: 'Cover upload completed',
            coverUrl: publicUrl,
        };
    }
    async get(id) {
        return this.seriesRepo.findOne({ where: { id: Number(id) } });
    }
    async create(body) {
        const chineseFilters = await this.resolveChineseFilters(body);
        const normalized = this.normalize(body);
        const payload = { ...normalized, ...chineseFilters };
        await this.validateFilterOptionIds(payload);
        try {
            const entity = this.seriesRepo.create(payload);
            return this.seriesRepo.save(entity);
        }
        catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new common_1.BadRequestException({
                    message: '外键约束失败：引用的选项不存在',
                    details: error.sqlMessage,
                    hint: '请调用 GET /api/admin/options?types=region,language,status,year 获取有效的选项列表'
                });
            }
            throw error;
        }
    }
    async validateFilterOptionIds(payload) {
        const errors = [];
        if (payload.regionOptionId) {
            const exists = await this.filterOptionRepo
                .createQueryBuilder('option')
                .innerJoin('option.filterType', 'filterType')
                .where('option.id = :id', { id: payload.regionOptionId })
                .andWhere('filterType.code = :code', { code: 'region' })
                .andWhere('option.isActive = 1')
                .getOne();
            if (!exists) {
                errors.push(`地区选项 ID ${payload.regionOptionId} 不存在或已禁用`);
            }
        }
        if (payload.languageOptionId) {
            const exists = await this.filterOptionRepo
                .createQueryBuilder('option')
                .innerJoin('option.filterType', 'filterType')
                .where('option.id = :id', { id: payload.languageOptionId })
                .andWhere('filterType.code = :code', { code: 'language' })
                .andWhere('option.isActive = 1')
                .getOne();
            if (!exists) {
                errors.push(`语言选项 ID ${payload.languageOptionId} 不存在或已禁用`);
            }
        }
        if (payload.statusOptionId) {
            const exists = await this.filterOptionRepo
                .createQueryBuilder('option')
                .innerJoin('option.filterType', 'filterType')
                .where('option.id = :id', { id: payload.statusOptionId })
                .andWhere('filterType.code = :code', { code: 'status' })
                .andWhere('option.isActive = 1')
                .getOne();
            if (!exists) {
                errors.push(`状态选项 ID ${payload.statusOptionId} 不存在或已禁用`);
            }
        }
        if (payload.yearOptionId) {
            const exists = await this.filterOptionRepo
                .createQueryBuilder('option')
                .innerJoin('option.filterType', 'filterType')
                .where('option.id = :id', { id: payload.yearOptionId })
                .andWhere('filterType.code = :code', { code: 'year' })
                .andWhere('option.isActive = 1')
                .getOne();
            if (!exists) {
                errors.push(`年份选项 ID ${payload.yearOptionId} 不存在或已禁用`);
            }
        }
        if (errors.length > 0) {
            const availableOptions = {};
            for (const typeCode of ['region', 'language', 'status', 'year']) {
                const options = await this.filterOptionRepo
                    .createQueryBuilder('option')
                    .innerJoin('option.filterType', 'filterType')
                    .where('filterType.code = :typeCode', { typeCode })
                    .andWhere('option.isActive = 1')
                    .andWhere('option.isDefault = 0')
                    .orderBy('option.sortOrder', 'ASC')
                    .select(['option.id', 'option.name', 'option.value'])
                    .getMany();
                availableOptions[typeCode] = options.map(opt => ({
                    id: opt.id,
                    name: opt.name,
                    value: opt.value,
                }));
            }
            throw new common_1.BadRequestException({
                message: '筛选选项验证失败',
                errors,
                availableOptions,
                hint: '请使用 availableOptions 中的有效 ID，或调用 GET /api/admin/options?types=region,language,status,year 获取最新选项'
            });
        }
    }
    async update(id, body) {
        const chineseFilters = await this.resolveChineseFilters(body);
        const normalized = this.normalize(body);
        const payload = { ...normalized, ...chineseFilters };
        await this.validateFilterOptionIds(payload);
        try {
            await this.seriesRepo.update({ id: Number(id) }, payload);
            return this.seriesRepo.findOne({
                where: { id: Number(id) },
                relations: ['category', 'regionOption', 'languageOption', 'statusOption', 'yearOption']
            });
        }
        catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new common_1.BadRequestException({
                    message: '外键约束失败：引用的选项不存在',
                    details: error.sqlMessage,
                    hint: '请调用 GET /api/admin/options?types=region,language,status,year 获取有效的选项列表'
                });
            }
            throw error;
        }
    }
    async remove(id) {
        const result = await this.videoService.softDeleteSeries(Number(id));
        return result;
    }
    async restore(id) {
        const result = await this.videoService.restoreSeries(Number(id));
        return result;
    }
    async uploadCover(id, file) {
        if (!file || !file.buffer)
            throw new common_1.BadRequestException('file is required');
        const { url, key } = await this.storage.uploadBuffer(file.buffer, file.originalname, {
            keyPrefix: 'series/',
            contentType: file.mimetype,
        });
        const coverUrl = url ?? key;
        await this.seriesRepo.update({ id: Number(id) }, { coverUrl });
        return this.seriesRepo.findOne({ where: { id: Number(id) } });
    }
    async uploadCoverFromUrl(id, src) {
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
            keyPrefix: 'series/',
            contentType,
        });
        const coverUrl = url ?? key;
        await this.seriesRepo.update({ id: Number(id) }, { coverUrl });
        return this.seriesRepo.findOne({ where: { id: Number(id) } });
    }
};
exports.AdminSeriesController = AdminSeriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('includeDeleted')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('deleted'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "getDeleted", null);
__decorate([
    (0, common_1.Get)(':id/presigned-upload-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.GetPresignedUrlDto]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "getPresignedUploadUrl", null);
__decorate([
    (0, common_1.Post)(':id/upload-complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, presigned_upload_dto_1.UploadCompleteDto]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "uploadComplete", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)(':id/cover'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "uploadCover", null);
__decorate([
    (0, common_1.Post)(':id/cover-from-url'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminSeriesController.prototype, "uploadCoverFromUrl", null);
exports.AdminSeriesController = AdminSeriesController = __decorate([
    (0, common_1.Controller)('admin/series'),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        video_service_1.VideoService,
        r2_storage_service_1.R2StorageService])
], AdminSeriesController);
//# sourceMappingURL=admin-series.controller.js.map
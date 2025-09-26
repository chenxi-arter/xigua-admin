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
const video_service_1 = require("../../video/video.service");
let AdminSeriesController = class AdminSeriesController {
    seriesRepo;
    videoService;
    constructor(seriesRepo, videoService) {
        this.seriesRepo = seriesRepo;
        this.videoService = videoService;
    }
    async list(page = 1, size = 20, includeDeleted) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const where = includeDeleted === 'true' ? {} : { isActive: 1 };
        const [items, total] = await this.seriesRepo.findAndCount({
            skip,
            take,
            order: { id: 'DESC' },
            where
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
    async get(id) {
        return this.seriesRepo.findOne({ where: { id: Number(id) } });
    }
    async create(body) {
        const entity = this.seriesRepo.create(body);
        return this.seriesRepo.save(entity);
    }
    async update(id, body) {
        await this.seriesRepo.update({ id: Number(id) }, body);
        return this.seriesRepo.findOne({ where: { id: Number(id) } });
    }
    async remove(id) {
        const result = await this.videoService.softDeleteSeries(Number(id));
        return result;
    }
    async restore(id) {
        const result = await this.videoService.restoreSeries(Number(id));
        return result;
    }
};
exports.AdminSeriesController = AdminSeriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
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
exports.AdminSeriesController = AdminSeriesController = __decorate([
    (0, common_1.Controller)('admin/series'),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        video_service_1.VideoService])
], AdminSeriesController);
//# sourceMappingURL=admin-series.controller.js.map
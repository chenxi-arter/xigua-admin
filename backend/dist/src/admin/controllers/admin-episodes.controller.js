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
    async list(page = 1, size = 20, seriesId) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const where = seriesId ? { seriesId: Number(seriesId) } : {};
        const [items, total] = await this.episodeRepo.findAndCount({
            skip,
            take,
            order: { id: 'DESC' },
            relations: ['series'],
            where,
        });
        return { total, items, page: Number(page) || 1, size: take };
    }
    async get(id) {
        return this.episodeRepo.findOne({ where: { id: Number(id) }, relations: ['series', 'urls'] });
    }
    async create(body) {
        const entity = this.episodeRepo.create(body);
        return this.episodeRepo.save(entity);
    }
    async update(id, body) {
        await this.episodeRepo.update({ id: Number(id) }, body);
        return this.episodeRepo.findOne({ where: { id: Number(id) }, relations: ['series', 'urls'] });
    }
    async remove(id) {
        await this.episodeRepo.delete({ id: Number(id) });
        return { success: true };
    }
};
exports.AdminEpisodesController = AdminEpisodesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
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
exports.AdminEpisodesController = AdminEpisodesController = __decorate([
    (0, common_1.Controller)('admin/episodes'),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminEpisodesController);
//# sourceMappingURL=admin-episodes.controller.js.map
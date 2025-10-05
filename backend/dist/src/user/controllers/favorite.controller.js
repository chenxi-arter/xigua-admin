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
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const favorite_service_1 = require("../services/favorite.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_entity_1 = require("../../video/entity/episode.entity");
let FavoriteController = class FavoriteController {
    favoriteService;
    episodeRepo;
    constructor(favoriteService, episodeRepo) {
        this.favoriteService = favoriteService;
        this.episodeRepo = episodeRepo;
    }
    async getFavorites(req, page, size) {
        const userId = req.user?.userId;
        const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
        const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
        const result = await this.favoriteService.getUserFavorites(userId, pageNum, sizeNum);
        return {
            code: 200,
            message: '获取收藏列表成功',
            data: result,
        };
    }
    async removeFavorite(req, body) {
        const userId = req.user?.userId;
        const { shortId } = body;
        if (!shortId) {
            return {
                code: 400,
                message: 'shortId 必填',
            };
        }
        const episode = await this.episodeRepo.findOne({
            where: { shortId },
            select: ['id', 'seriesId', 'shortId'],
        });
        if (!episode) {
            return {
                code: 404,
                message: '剧集不存在',
            };
        }
        const removed = await this.favoriteService.removeFavorite(userId, episode.seriesId, episode.id);
        return {
            code: 200,
            message: removed ? '取消收藏成功' : '未找到该收藏',
            data: {
                removed,
                shortId,
                seriesId: episode.seriesId,
                episodeId: episode.id,
                favoriteType: 'episode',
            },
        };
    }
    async getFavoriteStats(req) {
        const userId = req.user?.userId;
        const stats = await this.favoriteService.getUserFavoriteStats(userId);
        return {
            code: 200,
            message: '获取统计成功',
            data: stats,
        };
    }
};
exports.FavoriteController = FavoriteController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Post)('remove'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "removeFavorite", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getFavoriteStats", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, common_1.Controller)('user/favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService,
        typeorm_2.Repository])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map
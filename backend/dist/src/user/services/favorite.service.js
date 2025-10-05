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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../entity/favorite.entity");
let FavoriteService = class FavoriteService {
    favoriteRepo;
    constructor(favoriteRepo) {
        this.favoriteRepo = favoriteRepo;
    }
    async addFavorite(userId, seriesId, episodeId) {
        const queryBuilder = this.favoriteRepo
            .createQueryBuilder('f')
            .where('f.userId = :userId', { userId })
            .andWhere('f.seriesId = :seriesId', { seriesId });
        if (episodeId) {
            queryBuilder.andWhere('f.episodeId = :episodeId', { episodeId });
        }
        else {
            queryBuilder.andWhere('f.episodeId IS NULL');
        }
        const existing = await queryBuilder.getOne();
        if (existing) {
            return existing;
        }
        const favorite = this.favoriteRepo.create({
            userId,
            seriesId,
            episodeId,
            favoriteType: episodeId ? 'episode' : 'series',
        });
        return this.favoriteRepo.save(favorite);
    }
    async removeFavorite(userId, seriesId, episodeId) {
        const queryBuilder = this.favoriteRepo
            .createQueryBuilder()
            .delete()
            .from(favorite_entity_1.Favorite)
            .where('userId = :userId', { userId })
            .andWhere('seriesId = :seriesId', { seriesId });
        if (episodeId) {
            queryBuilder.andWhere('episodeId = :episodeId', { episodeId });
        }
        else {
            queryBuilder.andWhere('episodeId IS NULL');
        }
        const result = await queryBuilder.execute();
        return (result.affected ?? 0) > 0;
    }
    async isFavorited(userId, seriesId, episodeId) {
        const queryBuilder = this.favoriteRepo
            .createQueryBuilder('f')
            .where('f.userId = :userId', { userId })
            .andWhere('f.seriesId = :seriesId', { seriesId });
        if (episodeId) {
            queryBuilder.andWhere('f.episodeId = :episodeId', { episodeId });
        }
        else {
            queryBuilder.andWhere('f.episodeId IS NULL');
        }
        const count = await queryBuilder.getCount();
        return count > 0;
    }
    async getUserFavorites(userId, page = 1, size = 20) {
        const skip = (page - 1) * size;
        const query = `
      SELECT 
        f.series_id as seriesId,
        MAX(f.created_at) as latestFavoriteTime,
        COUNT(DISTINCT f.episode_id) as favoritedEpisodeCount,
        s.short_id as seriesShortId,
        s.title as seriesTitle,
        s.cover_url as seriesCoverUrl,
        s.description,
        s.score,
        s.play_count as playCount,
        s.is_completed as isCompleted,
        c.name as categoryName,
        (SELECT COUNT(*) FROM episodes WHERE series_id = s.id AND status = 'published') as totalEpisodeCount,
        (SELECT COUNT(*) FROM episodes WHERE series_id = s.id AND status = 'published' AND DATE(created_at) = CURDATE()) as upCount
      FROM favorites f
      INNER JOIN series s ON f.series_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE f.user_id = ?
      GROUP BY f.series_id
      ORDER BY latestFavoriteTime DESC
      LIMIT ? OFFSET ?
    `;
        const totalCount = await this.favoriteRepo
            .createQueryBuilder('f')
            .where('f.userId = :userId', { userId })
            .select('COUNT(DISTINCT f.seriesId)', 'total')
            .getRawOne();
        const total = totalCount?.total || 0;
        const seriesList = await this.favoriteRepo.query(query, [userId, size, skip]);
        const list = seriesList.map(series => ({
            seriesId: series.seriesId,
            seriesShortId: series.seriesShortId || '',
            seriesTitle: series.seriesTitle || '',
            seriesCoverUrl: series.seriesCoverUrl || '',
            categoryName: series.categoryName || '',
            description: series.description || '',
            score: series.score || '0.0',
            playCount: series.playCount || 0,
            totalEpisodeCount: series.totalEpisodeCount || 0,
            favoritedEpisodeCount: series.favoritedEpisodeCount || 0,
            upCount: series.upCount || 0,
            isCompleted: series.isCompleted || false,
            favoriteTime: new Date(series.latestFavoriteTime).toISOString().replace('T', ' ').substring(0, 16),
        }));
        return {
            list,
            total,
            page,
            size,
            hasMore: total > page * size,
        };
    }
    async getUserFavoriteStats(userId) {
        const stats = await this.favoriteRepo
            .createQueryBuilder('f')
            .select('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN f.favoriteType = :seriesType THEN 1 ELSE 0 END)', 'seriesCount')
            .addSelect('SUM(CASE WHEN f.favoriteType = :episodeType THEN 1 ELSE 0 END)', 'episodeCount')
            .where('f.userId = :userId', { userId })
            .setParameters({
            seriesType: 'series',
            episodeType: 'episode',
        })
            .getRawOne();
        return {
            total: parseInt(stats?.total || '0', 10),
            seriesCount: parseInt(stats?.seriesCount || '0', 10),
            episodeCount: parseInt(stats?.episodeCount || '0', 10),
        };
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map
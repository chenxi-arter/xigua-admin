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
exports.LikedEpisodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_reaction_entity_1 = require("../../video/entity/episode-reaction.entity");
let LikedEpisodesService = class LikedEpisodesService {
    reactionRepo;
    constructor(reactionRepo) {
        this.reactionRepo = reactionRepo;
    }
    async getUserLikedEpisodes(userId, page = 1, size = 20, categoryId) {
        const skip = (page - 1) * size;
        const categoryFilter = categoryId ? `AND s.category_id = ${categoryId}` : '';
        const query = `
      SELECT 
        s.id as seriesId,
        s.short_id as seriesShortId,
        s.title as seriesTitle,
        s.cover_url as seriesCoverUrl,
        s.description,
        s.score,
        s.play_count as playCount,
        s.is_completed as isCompleted,
        c.name as categoryName,
        COUNT(DISTINCT er.episode_id) as likedEpisodeCount,
        MAX(er.created_at) as latestLikeTime,
        (SELECT COUNT(*) FROM episodes WHERE series_id = s.id AND status = 'published') as totalEpisodeCount,
        (SELECT COUNT(*) FROM episodes WHERE series_id = s.id AND status = 'published' AND DATE(created_at) = CURDATE()) as upCount
      FROM episode_reactions er
      INNER JOIN episodes e ON er.episode_id = e.id
      INNER JOIN series s ON e.series_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE er.user_id = ? 
        AND er.reaction_type = 'like'
        ${categoryFilter}
      GROUP BY s.id
      ORDER BY latestLikeTime DESC
      LIMIT ? OFFSET ?
    `;
        let totalQuery = this.reactionRepo
            .createQueryBuilder('er')
            .innerJoin('er.episode', 'e')
            .innerJoin('e.series', 's')
            .where('er.userId = :userId', { userId })
            .andWhere('er.reactionType = :reactionType', { reactionType: 'like' })
            .select('COUNT(DISTINCT s.id)', 'total');
        if (categoryId) {
            totalQuery = totalQuery.andWhere('s.categoryId = :categoryId', { categoryId });
        }
        const totalCount = await totalQuery.getRawOne();
        const total = parseInt(totalCount?.total || '0', 10);
        const seriesList = await this.reactionRepo.query(query, [userId, size, skip]);
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
            likedEpisodeCount: series.likedEpisodeCount || 0,
            upCount: series.upCount || 0,
            isCompleted: series.isCompleted || false,
            likeTime: new Date(series.latestLikeTime).toISOString().replace('T', ' ').substring(0, 16),
        }));
        return {
            list,
            total,
            page,
            size,
            hasMore: total > page * size,
        };
    }
    async getUserLikedStats(userId) {
        const stats = await this.reactionRepo
            .createQueryBuilder('er')
            .select('COUNT(*)', 'total')
            .addSelect('COUNT(DISTINCT e.seriesId)', 'seriesCount')
            .innerJoin('er.episode', 'e')
            .where('er.userId = :userId', { userId })
            .andWhere('er.reactionType = :reactionType', { reactionType: 'like' })
            .getRawOne();
        return {
            totalLikedEpisodes: parseInt(stats?.total || '0', 10),
            likedSeriesCount: parseInt(stats?.seriesCount || '0', 10),
        };
    }
};
exports.LikedEpisodesService = LikedEpisodesService;
exports.LikedEpisodesService = LikedEpisodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikedEpisodesService);
//# sourceMappingURL=liked-episodes.service.js.map
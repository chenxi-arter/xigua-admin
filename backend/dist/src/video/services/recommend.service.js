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
exports.RecommendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const date_util_1 = require("../../common/utils/date.util");
let RecommendService = class RecommendService {
    episodeRepo;
    episodeUrlRepo;
    cacheManager;
    constructor(episodeRepo, episodeUrlRepo, cacheManager) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.cacheManager = cacheManager;
    }
    async getRecommendList(page = 1, size = 20) {
        try {
            const offset = (page - 1) * size;
            const cacheKey = `recommend:list:${page}:${size}`;
            const cachedData = await this.cacheManager.get(cacheKey);
            if (cachedData) {
                return cachedData;
            }
            const query = `
        SELECT 
          e.id,
          e.short_id as shortId,
          e.episode_number as episodeNumber,
          e.title,
          e.duration,
          e.status,
          e.is_vertical as isVertical,
          e.created_at as createdAt,
          e.play_count as playCount,
          e.like_count as likeCount,
          e.dislike_count as dislikeCount,
          e.favorite_count as favoriteCount,
          e.access_key as episodeAccessKey,
          s.short_id as seriesShortId,
          s.title as seriesTitle,
          s.cover_url as seriesCoverUrl,
          s.description as seriesDescription,
          s.score as seriesScore,
          s.starring as seriesStarring,
          s.actor as seriesActor,
          (
            COALESCE(e.like_count, 0) * 3 + 
            COALESCE(e.favorite_count, 0) * 5 +
            FLOOR(RAND() * 100)
          ) as recommendScore
        FROM episodes e
        INNER JOIN series s ON e.series_id = s.id
        WHERE e.status = 'published'
          AND s.is_active = 1
        ORDER BY recommendScore DESC, RAND()
        LIMIT ? OFFSET ?
      `;
            const episodes = await this.episodeRepo.query(query, [size + 1, offset]);
            const hasMore = episodes.length > size;
            const list = hasMore ? episodes.slice(0, size) : episodes;
            const enrichedList = await Promise.all(list.map(async (episode) => {
                const urls = await this.episodeUrlRepo.find({
                    where: { episodeId: episode.id },
                    select: ['quality', 'accessKey'],
                });
                const createdAt = date_util_1.DateUtil.formatDateTime(episode.createdAt);
                return {
                    shortId: episode.shortId,
                    episodeNumber: episode.episodeNumber,
                    episodeTitle: String(episode.episodeNumber).padStart(2, '0'),
                    title: episode.title,
                    duration: episode.duration,
                    status: episode.status,
                    isVertical: Boolean(episode.isVertical),
                    createdAt,
                    seriesShortId: episode.seriesShortId,
                    seriesTitle: episode.seriesTitle,
                    seriesCoverUrl: episode.seriesCoverUrl || '',
                    seriesDescription: episode.seriesDescription || '',
                    seriesScore: episode.seriesScore || '0.0',
                    seriesStarring: episode.seriesStarring || '',
                    seriesActor: episode.seriesActor || '',
                    playCount: episode.playCount || 0,
                    likeCount: episode.likeCount || 0,
                    dislikeCount: episode.dislikeCount || 0,
                    favoriteCount: episode.favoriteCount || 0,
                    commentCount: 0,
                    episodeAccessKey: episode.episodeAccessKey,
                    urls: urls.map(url => ({
                        quality: url.quality,
                        accessKey: url.accessKey,
                    })),
                    topComments: [],
                    recommendScore: parseFloat(episode.recommendScore),
                };
            }));
            const result = {
                list: enrichedList,
                page,
                size,
                hasMore,
            };
            await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000);
            return result;
        }
        catch (error) {
            console.error('获取推荐列表失败:', error);
            throw new Error('获取推荐列表失败');
        }
    }
};
exports.RecommendService = RecommendService;
exports.RecommendService = RecommendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], RecommendService);
//# sourceMappingURL=recommend.service.js.map
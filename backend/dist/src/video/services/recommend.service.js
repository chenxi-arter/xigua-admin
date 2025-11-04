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
const comment_entity_1 = require("../entity/comment.entity");
const date_util_1 = require("../../common/utils/date.util");
const episode_interaction_service_1 = require("./episode-interaction.service");
const favorite_service_1 = require("../../user/services/favorite.service");
const comment_service_1 = require("./comment.service");
let RecommendService = class RecommendService {
    episodeRepo;
    episodeUrlRepo;
    commentRepo;
    cacheManager;
    episodeInteractionService;
    favoriteService;
    commentService;
    constructor(episodeRepo, episodeUrlRepo, commentRepo, cacheManager, episodeInteractionService, favoriteService, commentService) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.commentRepo = commentRepo;
        this.cacheManager = cacheManager;
        this.episodeInteractionService = episodeInteractionService;
        this.favoriteService = favoriteService;
        this.commentService = commentService;
    }
    async getRecommendList(page = 1, size = 20, userId) {
        try {
            const offset = (page - 1) * size;
            const cacheKey = `recommend:list:${page}:${size}`;
            if (!userId) {
                const cachedData = await this.cacheManager.get(cacheKey);
                if (cachedData) {
                    return cachedData;
                }
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
          e.series_id as seriesId,
          s.short_id as seriesShortId,
          s.title as seriesTitle,
          s.cover_url as seriesCoverUrl,
          s.description as seriesDescription,
          s.score as seriesScore,
          s.starring as seriesStarring,
          s.actor as seriesActor,
          s.up_status as seriesUpStatus,
          @current_time := NOW(),
          (
            (e.like_count * 3 + e.favorite_count * 5) * (0.5 + RAND()) +
            FLOOR(RAND() * 500) +
            GREATEST(0, 300 - DATEDIFF(@current_time, e.created_at) * 10)
          ) as recommendScore
        FROM episodes e
        INNER JOIN series s ON e.series_id = s.id
        WHERE e.status = 'published'
          AND s.is_active = 1
          AND e.episode_number = 1
          AND s.category_id = 1
        ORDER BY recommendScore DESC, RAND()
        LIMIT ? OFFSET ?
      `;
            const episodes = await this.episodeRepo.query(query, [size + 1, offset]);
            const hasMore = episodes.length > size;
            const list = hasMore ? episodes.slice(0, size) : episodes;
            const userInteractions = {};
            if (userId && list.length > 0) {
                const episodeIds = list.map(ep => ep.id);
                const seriesIds = Array.from(new Set(list.map(ep => ep.seriesId)));
                const episodeReactionsMap = await this.episodeInteractionService.getUserReactions(userId, episodeIds);
                const favoritedEpisodesSet = await this.favoriteService.getUserFavoritedEpisodes(userId, episodeIds, seriesIds);
                list.forEach(ep => {
                    const userReaction = episodeReactionsMap.get(ep.id) || null;
                    userInteractions[ep.id] = {
                        liked: userReaction === 'like',
                        disliked: userReaction === 'dislike',
                        favorited: favoritedEpisodesSet.has(ep.id),
                    };
                });
            }
            const shortIds = list.map(ep => ep.shortId);
            const commentCountMap = await this.commentService.getCommentCountsByShortIds(shortIds);
            const enrichedList = await Promise.all(list.map(async (episode) => {
                const urls = await this.episodeUrlRepo.find({
                    where: { episodeId: episode.id },
                    select: ['quality', 'accessKey'],
                });
                const createdAt = date_util_1.DateUtil.formatDateTime(episode.createdAt);
                const baseEpisode = {
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
                    updateStatus: episode.seriesUpStatus || '',
                    playCount: episode.playCount || 0,
                    likeCount: episode.likeCount || 0,
                    dislikeCount: episode.dislikeCount || 0,
                    favoriteCount: episode.favoriteCount || 0,
                    commentCount: commentCountMap.get(episode.shortId) || 0,
                    episodeAccessKey: episode.episodeAccessKey,
                    urls: urls.map(url => ({
                        quality: url.quality,
                        accessKey: url.accessKey,
                    })),
                    topComments: [],
                    recommendScore: parseFloat(episode.recommendScore),
                };
                if (userId && episode.id in userInteractions) {
                    return {
                        ...baseEpisode,
                        userInteraction: userInteractions[episode.id],
                    };
                }
                return baseEpisode;
            }));
            const result = {
                list: enrichedList,
                page,
                size,
                hasMore,
            };
            if (!userId) {
                await this.cacheManager.set(cacheKey, result, 2 * 60 * 1000);
            }
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
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => favorite_service_1.FavoriteService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object, episode_interaction_service_1.EpisodeInteractionService,
        favorite_service_1.FavoriteService,
        comment_service_1.CommentService])
], RecommendService);
//# sourceMappingURL=recommend.service.js.map
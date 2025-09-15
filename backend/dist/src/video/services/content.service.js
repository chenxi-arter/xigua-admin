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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const date_util_1 = require("../../common/utils/date.util");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const category_entity_1 = require("../entity/category.entity");
const watch_progress_service_1 = require("./watch-progress.service");
const cache_keys_util_1 = require("../utils/cache-keys.util");
let ContentService = class ContentService {
    seriesRepo;
    episodeRepo;
    episodeUrlRepo;
    categoryRepo;
    watchProgressService;
    cacheManager;
    constructor(seriesRepo, episodeRepo, episodeUrlRepo, categoryRepo, watchProgressService, cacheManager) {
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.categoryRepo = categoryRepo;
        this.watchProgressService = watchProgressService;
        this.cacheManager = cacheManager;
    }
    async getEpisodeList(seriesIdentifier, isShortId = false, page = 1, size = 20, userId) {
        const idType = isShortId ? 'shortId' : 'id';
        const cacheKey = cache_keys_util_1.CacheKeys.episodeList(seriesIdentifier || 'all', idType, page, size, userId);
        if (!userId) {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                console.log(`💾 剧集列表缓存命中: ${cacheKey}`);
                return cached;
            }
        }
        try {
            let series = null;
            let episodes = [];
            let total = 0;
            const queryBuilder = this.episodeRepo.createQueryBuilder('episode')
                .leftJoinAndSelect('episode.series', 'series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('episode.urls', 'urls')
                .where('episode.status != :status', { status: 'deleted' })
                .orderBy('episode.episodeNumber', 'ASC');
            if (seriesIdentifier) {
                if (isShortId) {
                    queryBuilder.andWhere('series.shortId = :shortId', { shortId: seriesIdentifier });
                }
                else {
                    queryBuilder.andWhere('series.id = :id', { id: parseInt(seriesIdentifier) });
                }
            }
            const offset = (page - 1) * size;
            const [episodeResults, totalCount] = await queryBuilder
                .skip(offset)
                .take(size)
                .getManyAndCount();
            episodes = episodeResults;
            total = totalCount;
            if (episodes.length > 0) {
                series = episodes[0].series;
            }
            let seriesInfo = null;
            if (series) {
                const seriesTags = await this.getSeriesTags(series);
                seriesInfo = {
                    starring: series.starring || '',
                    id: series.id,
                    channeName: series.category?.name || '',
                    channeID: series.categoryId || 0,
                    title: series.title,
                    coverUrl: series.coverUrl || '',
                    mediaUrl: '',
                    fileName: '',
                    mediaId: '',
                    postTime: date_util_1.DateUtil.formatDateTime(series.createdAt),
                    contentType: series.category?.name || '',
                    actor: series.actor || '',
                    shareCount: 0,
                    director: series.director || '',
                    description: series.description || '',
                    comments: 0,
                    updateStatus: series.upStatus || '',
                    watch_progress: 0,
                    playCount: series.playCount || 0,
                    isHot: false,
                    isVip: false,
                    tags: seriesTags
                };
            }
            let userProgress = null;
            if (userId && series) {
                userProgress = await this.getUserSeriesProgress(userId, series.id);
                console.log(`[DEBUG] 用户观看进度: currentEpisode=${userProgress?.currentEpisode}, currentEpisodeShortId=${userProgress?.currentEpisodeShortId}`);
            }
            else {
                userProgress = {
                    currentEpisode: 1,
                    currentEpisodeShortId: episodes.length > 0 ? episodes[0].shortId : '',
                    watchProgress: 0,
                    watchPercentage: 0,
                    totalWatchTime: 0,
                    lastWatchTime: date_util_1.DateUtil.formatDateTime(new Date()),
                    isCompleted: false
                };
            }
            let tags = [];
            if (series) {
                tags = await this.getSeriesTags(series);
            }
            const episodeProgressMap = {};
            let latestUpdatedAt = new Date(0);
            if (userId && episodes.length > 0) {
                const episodeIds = episodes.map(ep => ep.id);
                const progressList = await this.watchProgressService.getUserWatchProgressByEpisodeIds(userId, episodeIds);
                progressList.forEach(progress => {
                    const episode = episodes.find((ep) => ep.id === progress.episodeId);
                    if (episode) {
                        let watchPercentage = 0;
                        if (episode.duration > 0) {
                            watchPercentage = Math.round((progress.stopAtSecond / episode.duration) * 100);
                        }
                        const isWatched = watchPercentage >= 90;
                        episodeProgressMap[progress.episodeId] = {
                            watchProgress: progress.stopAtSecond,
                            watchPercentage,
                            isWatched,
                            lastWatchTime: date_util_1.DateUtil.formatDateTime(progress.updatedAt)
                        };
                        if (progress.updatedAt > latestUpdatedAt) {
                            latestUpdatedAt = progress.updatedAt;
                        }
                    }
                });
            }
            const episodeList = episodes.map((ep) => {
                const progress = episodeProgressMap[ep.id] || {
                    watchProgress: 0,
                    watchPercentage: 0,
                    isWatched: false,
                    lastWatchTime: ''
                };
                return {
                    id: ep.id,
                    shortId: ep.shortId,
                    episodeNumber: ep.episodeNumber,
                    episodeTitle: String(ep.episodeNumber).padStart(2, '0'),
                    title: ep.title,
                    duration: ep.duration,
                    status: ep.status,
                    createdAt: date_util_1.DateUtil.formatDateTime(ep.createdAt),
                    updatedAt: date_util_1.DateUtil.formatDateTime(ep.updatedAt),
                    seriesId: ep.seriesId,
                    seriesTitle: ep.series?.title || '',
                    seriesShortId: ep.series?.shortId || '',
                    likeCount: ep.likeCount || 0,
                    dislikeCount: ep.dislikeCount || 0,
                    favoriteCount: ep.favoriteCount || 0,
                    watchProgress: progress.watchProgress,
                    watchPercentage: progress.watchPercentage,
                    isWatched: progress.isWatched,
                    lastWatchTime: progress.lastWatchTime,
                    episodeAccessKey: ep.accessKey,
                    urls: ep.urls?.map(url => ({
                        quality: url.quality,
                        accessKey: url.accessKey
                    })) || [],
                };
            });
            const response = {
                code: 200,
                data: {
                    seriesInfo,
                    userProgress,
                    list: episodeList,
                    total,
                    page,
                    size,
                    hasMore: total > page * size,
                    tags: tags || [],
                    currentEpisode: userProgress ? String(userProgress.currentEpisode).padStart(2, '0') : '01'
                },
                msg: null
            };
            if (!userId) {
                const cacheTTL = 1800;
                await this.cacheManager.set(cacheKey, response, cacheTTL);
                console.log(`💾 剧集列表已缓存: ${cacheKey}, TTL: ${cacheTTL}s`);
            }
            return response;
        }
        catch (error) {
            console.error('获取剧集列表失败:', error);
            throw new Error('获取剧集列表失败');
        }
    }
    async getEpisodeByShortId(shortId) {
        try {
            return await this.episodeRepo.findOne({
                where: { shortId },
                relations: ['series']
            });
        }
        catch (error) {
            console.error('通过ShortID获取剧集失败:', error);
            return null;
        }
    }
    async getSeriesDetail(id) {
        const cacheKey = cache_keys_util_1.CacheKeys.seriesDetail(id);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`💾 系列详情缓存命中: ${cacheKey}`);
            return cached;
        }
        try {
            const series = await this.seriesRepo.findOne({
                where: { id },
                relations: ['category', 'episodes']
            });
            if (!series) {
                throw new common_1.BadRequestException('系列不存在');
            }
            const result = {
                code: 200,
                data: {
                    id: series.id,
                    shortId: series.shortId,
                    title: series.title,
                    description: series.description,
                    coverUrl: series.coverUrl,
                    categoryId: series.categoryId,
                    categoryName: series.category?.name || '',
                    episodeCount: series.episodes?.length || 0,
                    totalEpisodes: series.totalEpisodes,
                    status: series.upStatus || (series.statusOption?.name || ''),
                    upStatus: series.upStatus,
                    score: series.score,
                    playCount: series.playCount,
                    starring: series.starring,
                    actor: series.actor,
                    director: series.director,
                    releaseDate: series.releaseDate,
                    isCompleted: series.isCompleted,
                    createdAt: date_util_1.DateUtil.formatDateTime(series.createdAt)
                },
                msg: null
            };
            await this.cacheManager.set(cacheKey, result, 900000);
            console.log(`💾 系列详情已缓存: ${cacheKey}`);
            return result;
        }
        catch (error) {
            console.error('获取系列详情失败:', error);
            throw error;
        }
    }
    async getSeriesTags(series) {
        const tags = [];
        try {
            const genreTags = await this.seriesRepo
                .createQueryBuilder('s')
                .leftJoin('series_genre_options', 'sgo', 'sgo.series_id = s.id')
                .leftJoin('filter_options', 'fo', 'fo.id = sgo.option_id')
                .select('fo.name', 'name')
                .where('s.id = :seriesId', { seriesId: series.id })
                .andWhere('fo.filter_type_id = 2')
                .andWhere('fo.is_active = 1')
                .orderBy('fo.display_order', 'ASC')
                .getRawMany();
            genreTags.forEach((tag) => {
                if (tag.name)
                    tags.push(tag.name);
            });
            const deduped = Array.from(new Set(tags));
            return deduped.slice(0, 5);
        }
        catch (error) {
            console.error('获取系列标签失败:', error);
        }
        return [];
    }
    async clearProgressRelatedCache(episodeId) {
        try {
            const episode = await this.episodeRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            if (episode && episode.series) {
                const seriesId = episode.series.id;
                const seriesShortId = episode.series.shortId;
                const patterns = [
                    `episode_list:${seriesId}:*`,
                    `episode_list:${seriesShortId}:*`,
                ];
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
                console.log(`🧹 清理内容相关缓存: episodeId=${episodeId}, seriesId=${seriesId}`);
            }
        }
        catch (error) {
            console.error('清理内容相关缓存失败:', error);
        }
    }
    async getUserSeriesProgress(userId, seriesId) {
        try {
            const episodes = await this.episodeRepo.find({
                where: { series: { id: seriesId } },
                order: { episodeNumber: 'ASC' },
                relations: ['series']
            });
            if (episodes.length === 0) {
                return null;
            }
            const episodeIds = episodes.map(ep => ep.id);
            const progressList = await this.watchProgressService.getUserWatchProgressByEpisodeIds(userId, episodeIds);
            let totalWatchTime = 0;
            let currentEpisode = 0;
            let currentEpisodeShortId = '';
            let watchProgress = 0;
            let watchPercentage = 0;
            let lastWatchTime = new Date(0);
            let completedEpisodes = 0;
            const MIN_VALID_PROGRESS_SECONDS = Number(process.env.PROGRESS_MIN_SECONDS ?? '2');
            const MIN_VALID_PROGRESS_PERCENT = Number(process.env.PROGRESS_MIN_PERCENT ?? '0.01');
            let lastValidWatchTime = new Date(0);
            let validEpisodeNumber = 0;
            let validEpisodeShortId = '';
            let validWatchProgress = 0;
            let validWatchPercentage = 0;
            progressList.forEach(progress => {
                const episode = episodes.find(ep => ep.id === progress.episodeId);
                if (episode) {
                    totalWatchTime += progress.stopAtSecond;
                    if (progress.updatedAt > lastWatchTime) {
                        lastWatchTime = progress.updatedAt;
                        currentEpisode = episode.episodeNumber;
                        currentEpisodeShortId = episode.shortId;
                        watchProgress = progress.stopAtSecond;
                        if (episode.duration > 0) {
                            watchPercentage = Math.round((progress.stopAtSecond / episode.duration) * 100);
                        }
                    }
                    const meetsSeconds = progress.stopAtSecond >= MIN_VALID_PROGRESS_SECONDS;
                    const meetsPercent = episode.duration > 0 && (progress.stopAtSecond / episode.duration) >= MIN_VALID_PROGRESS_PERCENT;
                    if (meetsSeconds || meetsPercent) {
                        if (progress.updatedAt > lastValidWatchTime) {
                            lastValidWatchTime = progress.updatedAt;
                            validEpisodeNumber = episode.episodeNumber;
                            validEpisodeShortId = episode.shortId;
                            validWatchProgress = progress.stopAtSecond;
                            if (episode.duration > 0) {
                                validWatchPercentage = Math.round((progress.stopAtSecond / episode.duration) * 100);
                            }
                        }
                    }
                    if (episode.duration > 0 && (progress.stopAtSecond / episode.duration) >= 0.9) {
                        completedEpisodes++;
                    }
                }
            });
            const useValid = lastValidWatchTime.getTime() > 0;
            return {
                currentEpisode: useValid ? validEpisodeNumber : (currentEpisode > 0 ? currentEpisode : 1),
                currentEpisodeShortId: useValid ? validEpisodeShortId : (currentEpisodeShortId || (episodes.length > 0 ? episodes[0].shortId : '')),
                watchProgress: useValid ? validWatchProgress : watchProgress,
                watchPercentage: useValid ? validWatchPercentage : watchPercentage,
                totalWatchTime,
                lastWatchTime: date_util_1.DateUtil.formatDateTime(useValid ? lastValidWatchTime : (lastWatchTime.getTime() > 0 ? lastWatchTime : new Date())),
                isCompleted: completedEpisodes === episodes.length && episodes.length > 0
            };
        }
        catch (error) {
            console.error('获取用户系列播放进度失败:', error);
            return null;
        }
    }
    formatDateTime(date) {
        if (!date)
            return '';
        const beijingTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (8 * 3600000));
        const year = beijingTime.getFullYear();
        const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
        const day = String(beijingTime.getDate()).padStart(2, '0');
        const hours = String(beijingTime.getHours()).padStart(2, '0');
        const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        watch_progress_service_1.WatchProgressService, Object])
], ContentService);
//# sourceMappingURL=content.service.js.map
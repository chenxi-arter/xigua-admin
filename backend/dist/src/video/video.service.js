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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const episode_entity_1 = require("./entity/episode.entity");
const series_entity_1 = require("./entity/series.entity");
const comment_entity_1 = require("./entity/comment.entity");
const playback_service_1 = require("./services/playback.service");
const content_service_1 = require("./services/content.service");
const home_service_1 = require("./services/home.service");
const media_service_1 = require("./services/media.service");
const url_service_1 = require("./services/url.service");
const filter_service_1 = require("./services/filter.service");
const comment_service_1 = require("./services/comment.service");
const series_service_1 = require("./services/series.service");
const category_service_1 = require("./services/category.service");
let VideoService = class VideoService {
    playbackService;
    contentService;
    homeService;
    mediaService;
    urlService;
    filterService;
    commentService;
    seriesService;
    categoryService;
    episodeRepo;
    seriesRepo;
    commentRepo;
    cacheManager;
    constructor(playbackService, contentService, homeService, mediaService, urlService, filterService, commentService, seriesService, categoryService, episodeRepo, seriesRepo, commentRepo, cacheManager) {
        this.playbackService = playbackService;
        this.contentService = contentService;
        this.homeService = homeService;
        this.mediaService = mediaService;
        this.urlService = urlService;
        this.filterService = filterService;
        this.commentService = commentService;
        this.seriesService = seriesService;
        this.categoryService = categoryService;
        this.episodeRepo = episodeRepo;
        this.seriesRepo = seriesRepo;
        this.commentRepo = commentRepo;
        this.cacheManager = cacheManager;
    }
    async saveProgress(userId, episodeId, stopAtSecond) {
        return this.playbackService.saveProgress(userId, episodeId, stopAtSecond);
    }
    async saveProgressWithBrowseHistory(userId, episodeId, stopAtSecond, req) {
        return this.playbackService.saveProgressWithBrowseHistory(userId, episodeId, stopAtSecond, req);
    }
    async getProgress(userId, episodeId) {
        return this.playbackService.getProgress(userId, episodeId);
    }
    async getUserSeriesProgress(userId, seriesId) {
        return this.playbackService.getUserSeriesProgress(userId, seriesId);
    }
    async getEpisodeList(seriesIdentifier, isShortId = false, page = 1, size = 20, userId, req) {
        return this.contentService.getEpisodeList(seriesIdentifier, isShortId, page, size, userId);
    }
    async getEpisodeByShortId(shortId) {
        return this.contentService.getEpisodeByShortId(shortId);
    }
    async getSeriesDetail(id) {
        return this.contentService.getSeriesDetail(id);
    }
    async getHomeVideos(channeid, page) {
        return this.homeService.getHomeVideos(channeid, page);
    }
    async getHomeModules(channeid, page) {
        return this.homeService.getHomeModules(channeid, page);
    }
    async listCategories() {
        return this.homeService.listCategories();
    }
    async listMedia(categoryId, type, userId, sort = 'latest', page = 1, size = 20) {
        return this.mediaService.listMedia(categoryId, type, userId, sort, page, size);
    }
    async listSeriesFull(categoryId, page = 1, size = 20) {
        return this.mediaService.listSeriesFull(categoryId, page, size);
    }
    async listSeriesByCategory(categoryId) {
        return this.mediaService.listSeriesByCategory(categoryId);
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        return this.urlService.createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl);
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        return this.urlService.getEpisodeUrlByAccessKey(accessKey);
    }
    async getEpisodeUrlByKey(prefix, key) {
        return this.urlService.getEpisodeUrlByKey(prefix, key);
    }
    async generateAccessKeysForExisting() {
        return this.urlService.generateAccessKeysForExisting();
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        return this.urlService.updateEpisodeSequel(episodeId, hasSequel);
    }
    async getFiltersTags(channeid) {
        return this.filterService.getFiltersTags(channeid);
    }
    async getFiltersData(channelId, ids, page) {
        return this.filterService.getFiltersData(channelId, ids, page);
    }
    async fuzzySearch(keyword, channelId, page = 1, size = 20) {
        return this.filterService.fuzzySearch(keyword, channelId, page, size);
    }
    async getConditionFilterData(dto) {
        return this.filterService.getFiltersData(dto.titleid || 'drama', dto.ids || '0,0,0,0,0', (dto.page?.toString()) || '1');
    }
    async clearFilterCache(channeid) {
        return this.filterService.clearFilterCache(channeid);
    }
    async addComment(userId, episodeId, content, appearSecond) {
        return this.commentService.addComment(userId, episodeId, content, appearSecond);
    }
    async getSeriesByCategory(categoryId, page = 1, pageSize = 20) {
        return this.seriesService.getSeriesByCategory(categoryId, page, pageSize);
    }
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }
    async getCategoriesWithStats() {
        return this.categoryService.getCategoriesWithStats();
    }
    async softDeleteSeries(seriesId, deletedBy) {
        try {
            const series = await this.seriesRepo.findOne({ where: { id: seriesId, isActive: 1 } });
            if (!series) {
                return { success: false, message: '剧集不存在或已被删除' };
            }
            series.isActive = 0;
            series.deletedAt = new Date();
            if (deletedBy) {
                series.deletedBy = deletedBy;
            }
            await this.seriesRepo.save(series);
            this.clearSeriesRelatedCache(seriesId);
            return { success: true, message: '剧集已成功删除' };
        }
        catch (error) {
            console.error('软删除剧集失败:', error);
            return { success: false, message: '删除失败，请稍后重试' };
        }
    }
    async restoreSeries(seriesId) {
        try {
            const series = await this.seriesRepo.findOne({ where: { id: seriesId, isActive: 0 } });
            if (!series) {
                return { success: false, message: '剧集不存在或未被删除' };
            }
            series.isActive = 1;
            series.deletedAt = null;
            series.deletedBy = null;
            await this.seriesRepo.save(series);
            this.clearSeriesRelatedCache(seriesId);
            return { success: true, message: '剧集已成功恢复' };
        }
        catch (error) {
            console.error('恢复剧集失败:', error);
            return { success: false, message: '恢复失败，请稍后重试' };
        }
    }
    async getDeletedSeries(page = 1, size = 20) {
        try {
            const offset = (page - 1) * size;
            const [series, total] = await this.seriesRepo.findAndCount({
                where: { isActive: 0 },
                relations: ['category'],
                order: { deletedAt: 'DESC' },
                skip: offset,
                take: size
            });
            const list = series.map(s => ({
                id: s.id,
                shortId: s.shortId,
                title: s.title,
                categoryName: s.category?.name || '',
                deletedAt: s.deletedAt?.toISOString(),
                deletedBy: s.deletedBy,
                createdAt: s.createdAt.toISOString()
            }));
            return {
                list,
                total,
                page,
                size
            };
        }
        catch (error) {
            console.error('获取已删除剧集列表失败:', error);
            throw new Error('获取已删除剧集列表失败');
        }
    }
    clearProgressRelatedCache(episodeId) {
        console.log(`清理缓存请求: episodeId=${episodeId}`);
    }
    clearSeriesRelatedCache(seriesId) {
        console.log(`清理系列缓存请求: seriesId=${seriesId}`);
        setImmediate(() => {
        });
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(9, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(10, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(11, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(12, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [playback_service_1.PlaybackService,
        content_service_1.ContentService,
        home_service_1.HomeService,
        media_service_1.MediaService,
        url_service_1.UrlService,
        filter_service_1.FilterService,
        comment_service_1.CommentService,
        series_service_1.SeriesService,
        category_service_1.CategoryService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], VideoService);
//# sourceMappingURL=video.service.js.map
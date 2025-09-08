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
const category_entity_1 = require("./entity/category.entity");
const series_entity_1 = require("./entity/series.entity");
const episode_entity_1 = require("./entity/episode.entity");
const short_video_entity_1 = require("./entity/short-video.entity");
const filter_option_entity_1 = require("./entity/filter-option.entity");
const watch_progress_service_1 = require("./services/watch-progress.service");
const comment_service_1 = require("./services/comment.service");
const episode_service_1 = require("./services/episode.service");
const category_service_1 = require("./services/category.service");
const filter_service_1 = require("./services/filter.service");
const series_service_1 = require("./services/series.service");
const banner_service_1 = require("./services/banner.service");
const browse_history_service_1 = require("./services/browse-history.service");
const cache_keys_util_1 = require("./utils/cache-keys.util");
let VideoService = class VideoService {
    catRepo;
    seriesRepo;
    shortRepo;
    epRepo;
    filterOptionRepo;
    cacheManager;
    watchProgressService;
    commentService;
    episodeService;
    categoryService;
    filterService;
    seriesService;
    bannerService;
    browseHistoryService;
    constructor(catRepo, seriesRepo, shortRepo, epRepo, filterOptionRepo, cacheManager, watchProgressService, commentService, episodeService, categoryService, filterService, seriesService, bannerService, browseHistoryService) {
        this.catRepo = catRepo;
        this.seriesRepo = seriesRepo;
        this.shortRepo = shortRepo;
        this.epRepo = epRepo;
        this.filterOptionRepo = filterOptionRepo;
        this.cacheManager = cacheManager;
        this.watchProgressService = watchProgressService;
        this.commentService = commentService;
        this.episodeService = episodeService;
        this.categoryService = categoryService;
        this.filterService = filterService;
        this.seriesService = seriesService;
        this.bannerService = bannerService;
        this.browseHistoryService = browseHistoryService;
    }
    async listCategories() {
        const cacheKey = 'categories:all';
        const cachedCategories = await this.cacheManager.get(cacheKey);
        if (cachedCategories) {
            console.log('📦 从缓存获取分类列表');
            return cachedCategories;
        }
        const categories = await this.categoryService.getAllCategories();
        try {
            await this.cacheManager.set(cacheKey, categories, 3600);
            console.log('💾 分类列表已缓存，TTL: 1小时');
        }
        catch (cacheError) {
            console.error('分类列表缓存失败:', cacheError);
        }
        return categories;
    }
    async listSeriesByCategory(categoryId) {
        const cacheKey = `series_by_category:${categoryId}`;
        const cachedSeries = await this.cacheManager.get(cacheKey);
        if (cachedSeries) {
            console.log(`📦 从缓存获取分类系列列表: categoryId=${categoryId}`);
            return cachedSeries;
        }
        const result = await this.seriesService.getSeriesByCategory(categoryId);
        try {
            await this.cacheManager.set(cacheKey, result.series, 1800);
            console.log(`💾 分类系列列表已缓存: categoryId=${categoryId}, TTL: 30分钟`);
        }
        catch (cacheError) {
            console.error('分类系列列表缓存失败:', cacheError);
        }
        return result.series;
    }
    async getSeriesDetail(seriesId) {
        const cacheKey = `series_detail:${seriesId}`;
        const cachedDetail = await this.cacheManager.get(cacheKey);
        if (cachedDetail) {
            console.log(`📦 从缓存获取系列详情: seriesId=${seriesId}`);
            return cachedDetail;
        }
        const result = await this.seriesService.getSeriesDetail(seriesId);
        if (result) {
            try {
                await this.cacheManager.set(cacheKey, result, 900);
                console.log(`💾 系列详情已缓存: seriesId=${seriesId}, TTL: 15分钟`);
            }
            catch (cacheError) {
                console.error('系列详情缓存失败:', cacheError);
            }
        }
        return result;
    }
    async saveProgress(userId, episodeId, stopAtSecond) {
        const result = await this.watchProgressService.updateWatchProgress(userId, episodeId, stopAtSecond);
        await this.clearProgressRelatedCache(episodeId);
        return result;
    }
    async getProgress(userId, episodeId) {
        const progressList = await this.watchProgressService.getUserWatchProgress(userId, episodeId);
        const progress = progressList.length > 0 ? progressList[0] : null;
        return { stopAtSecond: progress?.stopAtSecond || 0 };
    }
    async getUserSeriesProgress(userId, seriesId) {
        try {
            const episodes = await this.epRepo.find({
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
                    if (episode.duration > 0 && (progress.stopAtSecond / episode.duration) >= 0.9) {
                        completedEpisodes++;
                    }
                }
            });
            return {
                currentEpisode,
                currentEpisodeShortId,
                watchProgress,
                watchPercentage,
                totalWatchTime,
                lastWatchTime: lastWatchTime.toISOString(),
                isCompleted: completedEpisodes >= episodes.length
            };
        }
        catch (error) {
            console.error('获取用户系列播放进度失败:', error);
            return null;
        }
    }
    async getEpisodeByShortId(episodeShortId) {
        return this.episodeService.getEpisodeByShortId(episodeShortId);
    }
    async clearVideoRelatedCache(videoId, categoryId) {
        try {
            await this.cacheManager.del(cache_keys_util_1.CacheKeys.videoDetails(videoId));
            for (let page = 1; page <= 3; page++) {
                await this.cacheManager.del(cache_keys_util_1.CacheKeys.homeVideos(1, page));
            }
            await this.filterService.clearFilterCache();
            if (categoryId) {
                console.log('Clearing cache for category:', categoryId);
            }
        }
        catch (error) {
            console.error('清除缓存失败:', error);
        }
    }
    async clearAllListCache() {
        try {
            for (let page = 1; page <= 3; page++) {
                await this.cacheManager.del(cache_keys_util_1.CacheKeys.homeVideos(1, page));
            }
            await this.filterService.clearFilterCache();
        }
        catch (error) {
            console.error('清除列表缓存失败:', error);
        }
    }
    async addComment(userId, episodeId, content, appearSecond) {
        const result = await this.commentService.addComment(userId, episodeId, content, appearSecond);
        await this.clearCommentRelatedCache(episodeId);
        return result;
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        const result = await this.episodeService.createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl);
        await this.clearVideoRelatedCache(episodeId.toString());
        return result;
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        return this.episodeService.getEpisodeUrlByAccessKey(accessKey);
    }
    async getEpisodeUrlByKey(prefix, raw) {
        if (prefix === 'ep') {
            return this.episodeService.getEpisodeUrlByEpisodeKey(raw);
        }
        if (prefix === 'url') {
            return this.episodeService.getEpisodeUrlByUrlKey(raw);
        }
        throw new Error('不支持的 key 前缀，使用 ep: 或 url:');
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        await this.epRepo.update(episodeId, { hasSequel });
        await this.clearVideoRelatedCache(episodeId.toString());
        return { ok: true };
    }
    async generateAccessKeysForExisting() {
        return this.episodeService.generateAccessKeysForExisting();
    }
    async listMedia(categoryId, type, userId, sort = 'latest', page = 1, size = 20) {
        const skip = (page - 1) * size;
        if (type === 'short') {
            const qb = this.shortRepo
                .createQueryBuilder('sv')
                .leftJoinAndSelect('sv.category', 'c')
                .orderBy({
                'sv.likeCount': sort === 'like' ? 'DESC' : sort === 'play' ? 'DESC' : 'ASC',
                'sv.createdAt': 'DESC',
            })
                .skip(skip)
                .take(size);
            if (categoryId) {
                qb.where('sv.category_id = :categoryId', { categoryId });
            }
            return qb.getManyAndCount();
        }
        const qb = this.seriesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.category', 'c')
            .leftJoinAndSelect('s.episodes', 'ep')
            .orderBy({
            's.createdAt': 'DESC',
        })
            .skip(skip)
            .take(size);
        if (categoryId) {
            qb.where('s.category_id = :categoryId', { categoryId });
        }
        const [rows, total] = await qb.getManyAndCount();
        return {
            list: rows.map(r => ({
                id: r.id,
                title: r.title,
                coverUrl: r.coverUrl,
                totalEpisodes: r.totalEpisodes,
                categoryName: r.category?.name || '',
                latestEpisode: r.episodes?.[0]?.episodeNumber || 0,
            })),
            total,
            page,
            size,
        };
    }
    async listSeriesFull(categoryId, page = 1, size = 20) {
        console.log(1121212);
        const skip = (page - 1) * size;
        const qb = this.seriesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.category', 'c')
            .leftJoinAndSelect('s.episodes', 'ep')
            .orderBy('s.createdAt', 'DESC')
            .addOrderBy('ep.episodeNumber', 'ASC')
            .skip(skip)
            .take(size);
        if (categoryId) {
            qb.where('s.category_id = :categoryId', { categoryId });
        }
        const [rows, total] = await qb.getManyAndCount();
        return {
            list: rows.map(series => ({
                id: series.id,
                title: series.title,
                description: series.description,
                coverUrl: series.coverUrl,
                totalEpisodes: series.totalEpisodes,
                categoryName: series.category?.name || '',
                createdAt: series.createdAt,
                episodes: series.episodes.map(ep => ({
                    id: ep.id,
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    duration: ep.duration,
                    status: ep.status,
                })),
            })),
            total,
            page,
            size,
        };
    }
    async getHomeVideos(channeid, page = 1) {
        const pageSize = 20;
        const cacheKey = `home_videos_${channeid || 'all'}_page_${page}`;
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            console.log(`从缓存获取首页数据: ${cacheKey}`);
            return cachedResult;
        }
        const categoryInfo = await this.findCategoryInfo(channeid);
        const dataBlocks = [];
        if (page === 1) {
            const bannerBlock = await this.createBannerBlock(categoryInfo.numericId);
            dataBlocks.push(bannerBlock);
            const filterBlock = this.createSearchFilterBlock();
            dataBlocks.push(filterBlock);
            const adBlock = this.createAdvertisementBlock();
            dataBlocks.push(adBlock);
        }
        const videoBlock = await this.createVideoListBlock(categoryInfo.numericId, categoryInfo.name, page, pageSize);
        if (!videoBlock.list || videoBlock.list.length === 0) {
            const finalResult = {
                data: null,
                code: 200,
                msg: null,
            };
            await this.cacheManager.set(cacheKey, finalResult, 5 * 60 * 1000);
            console.log(`首页数据已缓存（无数据）: ${cacheKey}`);
            return finalResult;
        }
        dataBlocks.push(videoBlock);
        const finalResult = {
            data: {
                list: dataBlocks,
            },
            code: 200,
            msg: null,
        };
        await this.cacheManager.set(cacheKey, finalResult, 5 * 60 * 1000);
        console.log(`首页数据已缓存: ${cacheKey}`);
        return finalResult;
    }
    async findCategoryInfo(channeid) {
        if (!channeid) {
            return { name: "全部", numericId: undefined };
        }
        const category = await this.catRepo.findOne({
            where: { id: channeid, isEnabled: true }
        });
        if (category) {
            return {
                name: category.name,
                numericId: category.id
            };
        }
        throw new Error(`频道ID ${channeid} 不存在或已禁用`);
    }
    async createBannerBlock(categoryId) {
        const banners = await this.bannerService.getActiveBanners(categoryId, 5);
        return {
            type: 0,
            name: "轮播图",
            filters: [],
            banners: banners || [],
            list: [],
        };
    }
    createSearchFilterBlock() {
        return {
            type: 1001,
            name: "搜索过滤器",
            filters: [
                { channeID: 1, name: "短剧", title: "全部", ids: "0,0,0,0,0" },
                { channeID: 1, name: "短剧", title: "最新上传", ids: "0,0,0,0,0" },
                { channeID: 1, name: "短剧", title: "人气高", ids: "1,0,0,0,0" },
                { channeID: 1, name: "短剧", title: "评分高", ids: "2,0,0,0,0" },
                { channeID: 1, name: "短剧", title: "最新更新", ids: "3,0,0,0,0" },
            ],
            banners: [],
            list: [],
        };
    }
    createAdvertisementBlock() {
        return {
            type: -1,
            name: "广告",
            filters: [],
            banners: [],
            list: [],
        };
    }
    async createVideoListBlock(categoryId, categoryName, page, pageSize) {
        const videoList = await this.getVideoList(categoryId, page, pageSize);
        return {
            type: 3,
            name: categoryName,
            filters: [],
            banners: [],
            list: videoList,
        };
    }
    async getMovieVideos(catid, page = 1) {
        const categoryId = catid ? parseInt(catid, 10) : 2;
        return this.getModuleVideos('movie', categoryId, page);
    }
    async getDramaVideos(catid, page = 1) {
        const categoryId = catid ? parseInt(catid, 10) : 1;
        return this.getModuleVideos('drama', categoryId, page);
    }
    async getVarietyVideos(catid, page = 1) {
        const categoryId = catid ? parseInt(catid, 10) : 3;
        return this.getModuleVideos('variety', categoryId, page);
    }
    async getModuleVideos(moduleType, categoryId, page = 1) {
        const size = 20;
        const cacheKey = `${moduleType}_videos_${categoryId}_${page}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const category = await this.catRepo.findOne({ where: { id: categoryId } });
        const categoryName = category?.name || '未知分类';
        const blocks = [];
        const banners = await this.getTopSeries(5, categoryId);
        blocks.push({
            type: 0,
            name: "轮播图",
            filters: [],
            banners: banners.map(series => ({
                showURL: series.coverUrl || '',
                title: series.title,
                id: series.id,
                shortId: series.shortId,
                channeID: categoryId,
                url: `/video/details/${series.shortId || series.id}`,
            })),
            list: [],
        });
        blocks.push({
            type: 1001,
            name: "搜索过滤器",
            filters: [
                {
                    channeID: categoryId,
                    name: categoryName,
                    title: "全部",
                    ids: "0,0,0,0,0",
                },
                {
                    channeID: categoryId,
                    name: categoryName,
                    title: "最新上传",
                    ids: "0,0,0,0,0",
                },
                {
                    channeID: categoryId,
                    name: categoryName,
                    title: "人气高",
                    ids: "1,0,0,0,0",
                },
                {
                    channeID: categoryId,
                    name: categoryName,
                    title: "评分高",
                    ids: "2,0,0,0,0",
                },
                {
                    channeID: categoryId,
                    name: categoryName,
                    title: "最新更新",
                    ids: "3,0,0,0,0",
                },
            ],
            banners: [],
            list: [],
        });
        blocks.push({
            type: -1,
            name: "广告",
            filters: [],
            banners: [],
            list: [],
        });
        const videoList = await this.getVideoList(categoryId, page, size);
        blocks.push({
            type: 3,
            name: categoryName,
            filters: [],
            banners: [],
            list: videoList,
        });
        const result = {
            data: {
                list: blocks,
            },
            code: 200,
            msg: null,
        };
        await this.cacheManager.set(cacheKey, result, 300000);
        return result;
    }
    async getTopSeries(limit = 5, categoryId) {
        const queryBuilder = this.seriesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.category', 'c')
            .orderBy('s.playCount', 'DESC')
            .addOrderBy('s.score', 'DESC')
            .take(limit);
        if (categoryId) {
            queryBuilder.where('s.category_id = :categoryId', { categoryId });
        }
        return queryBuilder.getMany();
    }
    async getVideoList(categoryId, page = 1, size = 20) {
        const skip = (page - 1) * size;
        const seriesQb = this.seriesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.category', 'c')
            .leftJoinAndSelect('s.episodes', 'ep')
            .orderBy('s.createdAt', 'DESC')
            .skip(skip)
            .take(size);
        if (categoryId) {
            seriesQb.where('s.category_id = :categoryId', { categoryId });
        }
        const series = await seriesQb.getMany();
        const shortQb = this.shortRepo
            .createQueryBuilder('sv')
            .leftJoinAndSelect('sv.category', 'c')
            .orderBy('sv.createdAt', 'DESC')
            .skip(skip)
            .take(size);
        if (categoryId) {
            shortQb.where('sv.category_id = :categoryId', { categoryId });
        }
        const shorts = await shortQb.getMany();
        const seriesItems = series.map((s) => ({
            id: s.id,
            shortId: s.shortId || `series_${s.id}`,
            coverUrl: s.coverUrl,
            title: s.title,
            score: s.score?.toString() || "0.0",
            playCount: s.playCount || 0,
            url: s.id.toString(),
            type: s.category?.name || "剧情",
            isSerial: true,
            upStatus: s.upStatus || (s.totalEpisodes ? `更新到${s.totalEpisodes}集` : "全集"),
            upCount: s.upCount || 0,
            author: s.starring || s.director || '未知',
            description: s.description || '暂无简介',
            cidMapper: s.category?.id?.toString() || '1',
            isRecommend: false,
            createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
        }));
        const shortItems = shorts.map((sv) => ({
            id: sv.id,
            shortId: sv.shortId || `short_${sv.id}`,
            coverUrl: sv.coverUrl,
            title: sv.title,
            score: "0.0",
            playCount: sv.playCount || 0,
            url: sv.id.toString(),
            type: sv.category?.name || "短视频",
            isSerial: false,
            upStatus: "全集",
            upCount: 0,
            author: sv.platformName || '官方平台',
            description: sv.description || '暂无简介',
            cidMapper: sv.category?.id?.toString() || '1',
            isRecommend: false,
            createdAt: sv.createdAt?.toISOString() || new Date().toISOString(),
        }));
        return [...seriesItems, ...shortItems].slice(0, size);
    }
    async getFiltersTags(channeid) {
        return this.filterService.getFiltersTags(channeid);
    }
    async clearFilterCache(channeid) {
        if (channeid) {
            await this.filterService.clearFilterCache(channeid);
        }
        else {
            await this.filterService.clearAllFilterTagsCache();
        }
    }
    async getFiltersData(channeid, ids, page) {
        return this.filterService.getFiltersData(channeid, ids, page);
    }
    async fuzzySearch(keyword, channeid, page = 1, size = 20) {
        return this.filterService.fuzzySearch(keyword, channeid, page, size);
    }
    async getConditionFilterData(dto) {
        try {
            const categoryMap = {
                'drama': 'drama',
                'movie': 'movie',
                'variety': 'variety',
                'home': 'drama'
            };
            const categoryId = categoryMap[dto.titleid || 'drama'] || 'movie';
            const ids = dto.ids || '0,0,0,0,0';
            const pageNum = dto.page || 1;
            const pageSize = dto.size || 21;
            const offset = (pageNum - 1) * pageSize;
            const filterIds = this.parseFilterIds(ids);
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('category.category_id = :categoryId', { categoryId })
                .andWhere('series.isActive = :isActive', { isActive: 1 });
            await this.applyConditionFilters(queryBuilder, filterIds);
            this.applySorting(queryBuilder, filterIds.sortType);
            const [series, total] = await queryBuilder
                .skip(offset)
                .take(pageSize)
                .getManyAndCount();
            const items = series.map((s) => ({
                id: s.id,
                shortId: s.shortId || '',
                coverUrl: s.coverUrl || '',
                title: s.title,
                description: s.description || '',
                score: s.score?.toString() || '0.0',
                playCount: s.playCount || 0,
                totalEpisodes: s.totalEpisodes || 0,
                isSerial: (s.episodes && s.episodes.length > 1) || false,
                upStatus: s.upStatus || '已完结',
                upCount: s.upCount || 0,
                status: s.upStatus || 'on-going',
                starring: s.starring || '',
                actor: s.actor || '',
                director: s.director || '',
                region: '',
                language: '',
                releaseDate: s.releaseDate ? (s.releaseDate instanceof Date ? s.releaseDate.toISOString() : new Date(s.releaseDate).toISOString()) : undefined,
                isCompleted: s.isCompleted || false,
                cidMapper: s.category?.id?.toString() || '0',
                categoryName: s.category?.name || '',
                isRecommend: false,
                duration: '未知',
                createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
                updateTime: s.updatedAt?.toISOString() || new Date().toISOString(),
                episodeCount: s.episodes?.length || 0,
                tags: []
            }));
            const response = {
                code: 200,
                data: {
                    list: items,
                    total,
                    page: pageNum,
                    size: pageSize,
                    hasMore: total > pageNum * pageSize
                },
                msg: null
            };
            return response;
        }
        catch (error) {
            console.error('获取条件筛选数据失败:', error);
            return {
                code: 500,
                data: {
                    list: [],
                    total: 0,
                    page: dto.page || 1,
                    size: dto.size || 21,
                    hasMore: false
                },
                msg: '获取数据失败'
            };
        }
    }
    async applyConditionFilters(queryBuilder, filterIds) {
        await this.filterService.applyFiltersToQueryBuilder(queryBuilder, filterIds, '1');
    }
    parseFilterIds(ids) {
        const parts = ids.split(',').map(id => parseInt(id) || 0);
        return {
            sortType: parts[0] || 0,
            categoryId: parts[1] || 0,
            regionId: parts[2] || 0,
            languageId: parts[3] || 0,
            yearId: parts[4] || 0,
            statusId: parts[5] || 0,
        };
    }
    applySorting(queryBuilder, sortType) {
        switch (sortType) {
            case 1:
                queryBuilder.orderBy('series.createdAt', 'DESC');
                break;
            case 2:
                queryBuilder.orderBy('series.playCount', 'DESC');
                break;
            case 3:
                queryBuilder.orderBy('series.score', 'DESC');
                break;
            case 4:
                queryBuilder.orderBy('series.updatedAt', 'DESC');
                break;
            default:
                queryBuilder.orderBy('series.createdAt', 'DESC');
        }
    }
    async createFilterOption(data) {
        await Promise.resolve();
        console.log('Creating filter option:', data);
        return { success: true, data };
    }
    async updateFilterOption(id, data) {
        await Promise.resolve();
        console.log('Updating filter option:', id, data);
        return { success: true, id, data };
    }
    async deleteFilterOption(id) {
        await Promise.resolve();
        console.log('Deleting filter option:', id);
        return { success: true, id };
    }
    async batchCreateFilterOptions(options) {
        await Promise.resolve();
        console.log('Batch creating filter options:', options);
        return { success: true, count: options.length };
    }
    async getEpisodeList(seriesIdentifier, isShortId = false, page = 1, size = 20, userId, req) {
        try {
            const offset = (page - 1) * size;
            const cacheKey = `episode_list:${seriesIdentifier || 'all'}:${isShortId ? 'shortId' : 'id'}:${page}:${size}:${userId || 'public'}`;
            const cachedData = await this.cacheManager.get(cacheKey);
            if (cachedData) {
                console.log(`📦 从缓存获取剧集列表: ${cacheKey}`);
                return cachedData;
            }
            let queryBuilder = this.epRepo.createQueryBuilder('episode')
                .leftJoinAndSelect('episode.series', 'series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.regionOption', 'regionOption')
                .leftJoinAndSelect('series.languageOption', 'languageOption')
                .leftJoinAndSelect('series.statusOption', 'statusOption')
                .leftJoinAndSelect('series.yearOption', 'yearOption')
                .leftJoinAndSelect('episode.urls', 'urls')
                .orderBy('episode.episodeNumber', 'ASC');
            if (seriesIdentifier) {
                if (isShortId) {
                    queryBuilder = queryBuilder.where('series.shortId = :seriesShortId', { seriesShortId: seriesIdentifier });
                }
                else {
                    const seriesId = parseInt(seriesIdentifier, 10);
                    queryBuilder = queryBuilder.where('series.id = :seriesId', { seriesId });
                }
            }
            const [episodes, total] = await queryBuilder
                .skip(offset)
                .take(size)
                .getManyAndCount();
            let seriesInfo = null;
            let tags = [];
            if (episodes.length > 0 && episodes[0].series) {
                const series = episodes[0].series;
                let typeName = series.category?.name || '';
                let regionName = '';
                if (series.regionOption) {
                    regionName = series.regionOption.name;
                }
                let languageName = '';
                if (series.languageOption) {
                    languageName = series.languageOption.name;
                }
                let yearName = '';
                if (series.releaseDate) {
                    yearName = await this.filterService.resolveYearNameFromDate(series.releaseDate);
                }
                let statusName = '';
                if (series.statusOption) {
                    statusName = series.statusOption.name;
                }
                tags = [typeName, regionName, languageName, yearName, statusName].filter(Boolean);
                seriesInfo = {
                    starring: series.starring || '',
                    id: series.id,
                    channeName: series.category?.name || '',
                    channeID: series.categoryId || 0,
                    title: series.title,
                    coverUrl: series.coverUrl || '',
                    mediaUrl: '',
                    fileName: `series-${series.id}`,
                    mediaId: `${series.id}_0,1,4,146`,
                    postTime: (series.releaseDate instanceof Date ? series.releaseDate.toISOString() : null) || series.createdAt?.toISOString() || new Date().toISOString(),
                    contentType: series.category?.name || '电视剧',
                    actor: series.actor || '',
                    shareCount: 0,
                    director: series.director || '',
                    description: series.description || '',
                    comments: 0,
                    updateStatus: series.upStatus || '',
                    watch_progress: 0,
                    playCount: series.playCount || 0,
                    isHot: series.score > 8.5,
                    isVip: false,
                    tags,
                };
            }
            let userProgress = null;
            let episodeProgressMap = new Map();
            if (userId && episodes.length > 0) {
                const seriesId = episodes[0].series?.id;
                if (seriesId) {
                    try {
                        const episodeIds = episodes.map(ep => ep.id);
                        const progressList = await this.watchProgressService.getUserWatchProgressByEpisodeIds(userId, episodeIds);
                        progressList.forEach(progress => {
                            episodeProgressMap.set(progress.episodeId, progress);
                        });
                        const seriesProgress = await this.getUserSeriesProgress(userId, seriesId);
                        if (seriesProgress) {
                            userProgress = {
                                currentEpisode: seriesProgress.currentEpisode,
                                currentEpisodeShortId: seriesProgress.currentEpisodeShortId,
                                watchProgress: seriesProgress.watchProgress,
                                watchPercentage: seriesProgress.watchPercentage,
                                totalWatchTime: seriesProgress.totalWatchTime,
                                lastWatchTime: seriesProgress.lastWatchTime,
                                isCompleted: seriesProgress.isCompleted
                            };
                        }
                        else {
                            userProgress = {
                                currentEpisode: 1,
                                currentEpisodeShortId: episodes.length > 0 ? episodes[0].shortId : '',
                                watchProgress: 0,
                                watchPercentage: 0,
                                totalWatchTime: 0,
                                lastWatchTime: new Date().toISOString(),
                                isCompleted: false
                            };
                        }
                    }
                    catch (error) {
                        console.error('获取用户播放进度失败:', error);
                        userProgress = {
                            currentEpisode: 1,
                            currentEpisodeShortId: episodes.length > 0 ? episodes[0].shortId : '',
                            watchProgress: 0,
                            watchPercentage: 0,
                            totalWatchTime: 0,
                            lastWatchTime: new Date().toISOString(),
                            isCompleted: false
                        };
                    }
                }
            }
            else {
                userProgress = {
                    currentEpisode: 1,
                    currentEpisodeShortId: episodes.length > 0 ? episodes[0].shortId : '',
                    watchProgress: 0,
                    watchPercentage: 0,
                    totalWatchTime: 0,
                    lastWatchTime: new Date().toISOString(),
                    isCompleted: false
                };
            }
            const episodeList = episodes.map((ep) => {
                const progress = episodeProgressMap.get(ep.id);
                const watchProgress = progress?.stopAtSecond || 0;
                const duration = ep.duration || 0;
                const watchPercentage = duration > 0 ? Math.round((watchProgress / duration) * 100) : 0;
                return {
                    id: ep.id,
                    shortId: ep.shortId,
                    episodeNumber: ep.episodeNumber,
                    episodeTitle: ep.episodeNumber.toString().padStart(2, '0'),
                    title: ep.title || `第${ep.episodeNumber}集`,
                    duration: duration,
                    status: ep.status || 'active',
                    createdAt: ep.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: ep.updatedAt?.toISOString() || new Date().toISOString(),
                    seriesId: ep.series?.id || 0,
                    seriesTitle: ep.series?.title || '',
                    seriesShortId: ep.series?.shortId || '',
                    episodeAccessKey: ep.accessKey,
                    watchProgress: watchProgress,
                    watchPercentage: watchPercentage,
                    isWatched: watchPercentage >= 90,
                    lastWatchTime: progress?.updatedAt?.toISOString() || null,
                    urls: ep.urls?.map(url => ({
                        quality: url.quality,
                        accessKey: url.accessKey
                    })) || [],
                };
            });
            if (userId && episodes.length > 0) {
                const seriesId = episodes[0].series?.id;
                if (seriesId) {
                    const lastEpisodeNumber = episodeList[episodeList.length - 1]?.episodeNumber;
                    this.browseHistoryService.recordBrowseHistory(userId, seriesId, 'episode_list', lastEpisodeNumber, req).catch(error => {
                        console.error('记录浏览历史失败:', error);
                    });
                }
            }
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
                    currentEpisode: (() => {
                        const num = (userProgress?.currentEpisode && userProgress.currentEpisode > 0)
                            ? userProgress.currentEpisode
                            : 1;
                        return String(num).padStart(2, '0');
                    })()
                },
                msg: null
            };
            try {
                const cacheTTL = userId ? 300 : 1800;
                await this.cacheManager.set(cacheKey, response, cacheTTL);
                console.log(`💾 剧集列表已缓存: ${cacheKey}, TTL: ${cacheTTL}s`);
            }
            catch (cacheError) {
                console.error('缓存存储失败:', cacheError);
            }
            return response;
        }
        catch (error) {
            console.error('获取剧集列表失败:', error);
            return {
                code: 500,
                data: {
                    seriesInfo: null,
                    userProgress: null,
                    list: [],
                    total: 0,
                    page,
                    size,
                    hasMore: false
                },
                msg: '获取剧集列表失败'
            };
        }
    }
    async clearProgressRelatedCache(episodeId) {
        try {
            const episode = await this.epRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            if (episode?.series?.id) {
                const seriesId = episode.series.id;
                const cachePatterns = [
                    `episode_list:${seriesId}:id:*:*:public`,
                    `episode_list:${seriesId}:id:*:*:*`,
                    `series_detail:${seriesId}`,
                    `series_by_category:*`
                ];
                for (const pattern of cachePatterns) {
                    await this.cacheManager.del(`episode_list:${seriesId}:id:1:20:public`);
                    await this.cacheManager.del(`episode_list:${seriesId}:id:1:20:${seriesId}`);
                }
                console.log(`🧹 已清理剧集 ${episodeId} 相关的缓存`);
            }
        }
        catch (error) {
            console.error('清理缓存失败:', error);
        }
    }
    async clearSeriesRelatedCache(seriesId) {
        try {
            const cacheKeys = [
                `series_detail:${seriesId}`,
                `series_by_category:*`,
                `episode_list:${seriesId}:*`
            ];
            for (const key of cacheKeys) {
                if (!key.includes('*')) {
                    await this.cacheManager.del(key);
                }
            }
            console.log(`🧹 已清理系列 ${seriesId} 相关的缓存`);
        }
        catch (error) {
            console.error('清理系列缓存失败:', error);
        }
    }
    async clearCommentRelatedCache(episodeId) {
        try {
            const episode = await this.epRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            if (episode?.series?.id) {
                const seriesId = episode.series.id;
                const cacheKeys = [
                    `episode_list:${seriesId}:id:1:20:public`,
                    `episode_list:${seriesId}:id:1:20:*`,
                    `series_detail:${seriesId}`
                ];
                for (const key of cacheKeys) {
                    if (!key.includes('*')) {
                        await this.cacheManager.del(key);
                    }
                }
                console.log(`🧹 已清理评论相关的缓存: episodeId=${episodeId}, seriesId=${seriesId}`);
            }
        }
        catch (error) {
            console.error('清理评论缓存失败:', error);
        }
    }
    async softDeleteSeries(seriesId, deletedBy) {
        try {
            const series = await this.seriesRepo.findOne({ where: { id: seriesId, isActive: 1 } });
            if (!series) {
                return { success: false, message: '剧集不存在或已被删除' };
            }
            const updateData = {
                isActive: 0,
                deletedAt: new Date(),
            };
            if (deletedBy) {
                updateData.deletedBy = deletedBy;
            }
            await this.seriesRepo.update(seriesId, updateData);
            return { success: true, message: '剧集删除成功' };
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
            await this.seriesRepo.update(seriesId, {
                isActive: 1,
                deletedAt: undefined,
                deletedBy: undefined
            });
            return { success: true, message: '剧集恢复成功' };
        }
        catch (error) {
            console.error('恢复剧集失败:', error);
            return { success: false, message: '恢复失败，请稍后重试' };
        }
    }
    async getDeletedSeries(page = 1, size = 10) {
        try {
            const [series, total] = await this.seriesRepo.findAndCount({
                where: { isActive: 0 },
                relations: ['category'],
                order: { deletedAt: 'DESC' },
                skip: (page - 1) * size,
                take: size
            });
            return {
                success: true,
                data: {
                    list: series,
                    total,
                    page,
                    size,
                    hasMore: total > page * size
                }
            };
        }
        catch (error) {
            console.error('获取已删除剧集失败:', error);
            return { success: false, message: '获取失败，请稍后重试' };
        }
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(2, (0, typeorm_1.InjectRepository)(short_video_entity_1.ShortVideo)),
    __param(3, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(4, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object, watch_progress_service_1.WatchProgressService,
        comment_service_1.CommentService,
        episode_service_1.EpisodeService,
        category_service_1.CategoryService,
        filter_service_1.FilterService,
        series_service_1.SeriesService,
        banner_service_1.BannerService,
        browse_history_service_1.BrowseHistoryService])
], VideoService);
//# sourceMappingURL=video.service.js.map
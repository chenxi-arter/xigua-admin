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
exports.SeriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const debug_util_1 = require("../../common/utils/debug.util");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const category_entity_1 = require("../entity/category.entity");
const cache_keys_util_1 = require("../utils/cache-keys.util");
let SeriesService = class SeriesService {
    seriesRepo;
    episodeRepo;
    categoryRepo;
    cacheManager;
    constructor(seriesRepo, episodeRepo, categoryRepo, cacheManager) {
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
        this.categoryRepo = categoryRepo;
        this.cacheManager = cacheManager;
    }
    async getSeriesByCategory(categoryId, page = 1, pageSize = 20) {
        const cacheKey = `${cache_keys_util_1.CacheKeys.categories()}_series_${categoryId}_${page}_${pageSize}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const offset = (page - 1) * pageSize;
            const [series, total] = await this.seriesRepo.findAndCount({
                where: { category: { id: categoryId } },
                relations: ['category', 'episodes'],
                order: { createdAt: 'DESC' },
                skip: offset,
                take: pageSize,
            });
            const result = { series, total };
            await this.cacheManager.set(cacheKey, result, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return result;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('根据分类获取系列列表失败', error);
            throw new Error('根据分类获取系列列表失败');
        }
    }
    async getSeriesDetail(seriesId) {
        const cacheKey = cache_keys_util_1.CacheKeys.seriesDetail(seriesId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const series = await this.seriesRepo.findOne({
                where: { id: seriesId },
                relations: ['category', 'episodes', 'episodes.urls'],
            });
            if (series) {
                await this.cacheManager.set(cacheKey, series, cache_keys_util_1.CacheKeys.TTL.LONG);
            }
            return series;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('获取系列详情失败', error);
            return null;
        }
    }
    async getPopularSeries(limit = 20, categoryId) {
        const cacheKey = categoryId
            ? `${cache_keys_util_1.CacheKeys.topSeries(limit)}_category_${categoryId}`
            : cache_keys_util_1.CacheKeys.topSeries(limit);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const queryBuilder = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .orderBy('series.playCount', 'DESC')
                .addOrderBy('series.score', 'DESC')
                .limit(limit);
            if (categoryId) {
                queryBuilder.where('series.categoryId = :categoryId', { categoryId });
            }
            const series = await queryBuilder.getMany();
            await this.cacheManager.set(cacheKey, series, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return series;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('获取热门系列失败', error);
            throw new Error('获取热门系列失败');
        }
    }
    async getLatestSeries(limit = 20, categoryId) {
        const cacheKey = categoryId
            ? `latest_series_${limit}_category_${categoryId}`
            : `latest_series_${limit}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const queryBuilder = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .orderBy('series.updatedAt', 'DESC')
                .addOrderBy('series.createdAt', 'DESC')
                .addOrderBy('series.id', 'DESC')
                .limit(limit);
            if (categoryId) {
                queryBuilder.where('series.categoryId = :categoryId', { categoryId });
            }
            const series = await queryBuilder.getMany();
            await this.cacheManager.set(cacheKey, series, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return series;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('获取最新系列失败', error);
            throw new Error('获取最新系列失败');
        }
    }
    async searchSeries(keyword, page = 1, pageSize = 20, categoryId) {
        try {
            const offset = (page - 1) * pageSize;
            const queryBuilder = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('series.title LIKE :keyword OR series.description LIKE :keyword', {
                keyword: `%${keyword}%`
            })
                .orderBy('series.playCount', 'DESC')
                .skip(offset)
                .take(pageSize);
            if (categoryId) {
                queryBuilder.andWhere('series.categoryId = :categoryId', { categoryId });
            }
            const [series, total] = await queryBuilder.getManyAndCount();
            return { series, total };
        }
        catch (error) {
            debug_util_1.DebugUtil.error('搜索系列失败', error);
            throw new Error('搜索系列失败');
        }
    }
    async getRecommendedSeries(userId, limit = 10) {
        const cacheKey = userId
            ? `recommended_series_${userId}_${limit}`
            : `recommended_series_${limit}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const series = await this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('series.score >= :minScore', { minScore: 7.0 })
                .orderBy('series.score', 'DESC')
                .addOrderBy('series.playCount', 'DESC')
                .limit(limit)
                .getMany();
            await this.cacheManager.set(cacheKey, series, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return series;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('获取推荐系列失败', error);
            throw new Error('获取推荐系列失败');
        }
    }
    async incrementPlayCount(seriesId) {
        try {
            await this.seriesRepo.increment({ id: seriesId }, 'playCount', 1);
            await this.clearSeriesCache(seriesId);
        }
        catch (error) {
            debug_util_1.DebugUtil.error('增加播放次数失败', error);
        }
    }
    async updateSeriesScore(seriesId, score) {
        try {
            await this.seriesRepo.update(seriesId, { score });
            await this.clearSeriesCache(seriesId);
        }
        catch (error) {
            debug_util_1.DebugUtil.error('更新系列评分失败', error);
            throw new Error('更新系列评分失败');
        }
    }
    async createSeries(seriesData) {
        try {
            const series = this.seriesRepo.create(seriesData);
            const savedSeries = await this.seriesRepo.save(series);
            await this.clearSeriesCache();
            return savedSeries;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('创建系列失败', error);
            throw new Error('创建系列失败');
        }
    }
    async updateSeries(seriesId, updateData) {
        try {
            await this.seriesRepo.update(seriesId, updateData);
            const updatedSeries = await this.getSeriesDetail(seriesId);
            if (!updatedSeries) {
                throw new Error('系列不存在');
            }
            await this.clearSeriesCache(seriesId);
            return updatedSeries;
        }
        catch (error) {
            debug_util_1.DebugUtil.error('更新系列失败', error);
            throw new Error('更新系列失败');
        }
    }
    async deleteSeries(seriesId) {
        try {
            const episodeCount = await this.episodeRepo.count({
                where: { series: { id: seriesId } },
            });
            if (episodeCount > 0) {
                throw new Error('该系列下还有剧集，无法删除');
            }
            await this.seriesRepo.delete(seriesId);
            await this.clearSeriesCache(seriesId);
        }
        catch (error) {
            debug_util_1.DebugUtil.error('删除系列失败', error);
            throw new Error('删除系列失败');
        }
    }
    async clearSeriesCache(seriesId) {
        try {
            if (seriesId) {
                const patterns = [
                    cache_keys_util_1.CacheKeys.seriesDetail(seriesId),
                    `latest_series_*`,
                    `recommended_series_*`,
                    `${cache_keys_util_1.CacheKeys.topSeries(20)}*`
                ];
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
            }
            else {
                const patterns = cache_keys_util_1.CacheKeys.getPatternKeys('series_all');
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
            }
        }
        catch (error) {
            debug_util_1.DebugUtil.error('清除系列缓存失败', error);
        }
    }
};
exports.SeriesService = SeriesService;
exports.SeriesService = SeriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], SeriesService);
//# sourceMappingURL=series.service.js.map
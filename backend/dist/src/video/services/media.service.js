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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const date_util_1 = require("../../common/utils/date.util");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const series_entity_1 = require("../entity/series.entity");
const category_entity_1 = require("../entity/category.entity");
const cache_keys_util_1 = require("../utils/cache-keys.util");
let MediaService = class MediaService {
    seriesRepo;
    categoryRepo;
    cacheManager;
    constructor(seriesRepo, categoryRepo, cacheManager) {
        this.seriesRepo = seriesRepo;
        this.categoryRepo = categoryRepo;
        this.cacheManager = cacheManager;
    }
    async listMedia(categoryId, type, userId, sort = 'latest', page = 1, size = 20) {
        try {
            const offset = (page - 1) * size;
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .where('series.isActive = :isActive', { isActive: 1 });
            if (categoryId && categoryId > 0) {
                queryBuilder.andWhere('series.categoryId = :categoryId', { categoryId });
            }
            if (type) {
            }
            switch (sort) {
                case 'latest':
                    queryBuilder.orderBy('series.createdAt', 'DESC');
                    break;
                case 'like':
                    queryBuilder.orderBy('series.score', 'DESC');
                    break;
                case 'play':
                    queryBuilder.orderBy('series.playCount', 'DESC');
                    break;
                default:
                    queryBuilder.orderBy('series.createdAt', 'DESC');
            }
            const [series, total] = await queryBuilder
                .skip(offset)
                .take(size)
                .getManyAndCount();
            const list = series.map(s => ({
                id: s.id,
                shortId: s.shortId,
                title: s.title,
                description: s.description,
                coverUrl: s.coverUrl,
                type: s.category?.name || '',
                categoryId: s.categoryId,
                episodeCount: s.totalEpisodes,
                status: s.upStatus || (s.statusOption?.name || ''),
                score: s.score,
                playCount: s.playCount,
                starring: s.starring,
                director: s.director,
                createdAt: date_util_1.DateUtil.formatDateTime(s.createdAt)
            }));
            return {
                code: 200,
                data: {
                    list,
                    total,
                    page,
                    size,
                    hasMore: total > page * size
                },
                msg: null
            };
        }
        catch (error) {
            console.error('获取媒体列表失败:', error);
            throw new Error('获取媒体列表失败');
        }
    }
    async listSeriesFull(categoryId, page = 1, size = 20) {
        const cacheKey = cache_keys_util_1.CacheKeys.seriesList(categoryId, page, size);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`💾 系列列表缓存命中: ${cacheKey}`);
            return cached;
        }
        try {
            const offset = (page - 1) * size;
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .where('series.isActive = :isActive', { isActive: 1 })
                .orderBy('series.createdAt', 'DESC');
            if (categoryId && categoryId > 0) {
                queryBuilder.andWhere('series.categoryId = :categoryId', { categoryId });
            }
            const [series, total] = await queryBuilder
                .skip(offset)
                .take(size)
                .getManyAndCount();
            const result = {
                code: 200,
                data: {
                    list: series.map(s => ({
                        id: s.id,
                        shortId: s.shortId,
                        title: s.title,
                        description: s.description,
                        coverUrl: s.coverUrl,
                        categoryId: s.categoryId,
                        categoryName: s.category?.name || '',
                        episodeCount: s.totalEpisodes,
                        status: s.upStatus || (s.statusOption?.name || ''),
                        score: s.score,
                        playCount: s.playCount,
                        createdAt: date_util_1.DateUtil.formatDateTime(s.createdAt)
                    })),
                    total,
                    page,
                    size,
                    hasMore: total > page * size
                },
                msg: null
            };
            await this.cacheManager.set(cacheKey, result, 1800000);
            console.log(`💾 系列列表已缓存: ${cacheKey}`);
            return result;
        }
        catch (error) {
            console.error('获取系列列表失败:', error);
            throw new Error('获取系列列表失败');
        }
    }
    async listSeriesByCategory(categoryId) {
        const cacheKey = cache_keys_util_1.CacheKeys.seriesByCategory(categoryId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`💾 分类系列缓存命中: ${cacheKey}`);
            return cached;
        }
        try {
            const series = await this.seriesRepo.find({
                where: {
                    categoryId,
                    isActive: 1
                },
                relations: ['category'],
                order: { createdAt: 'DESC' },
                take: 50
            });
            const result = {
                code: 200,
                data: {
                    list: series.map(s => ({
                        id: s.id,
                        shortId: s.shortId,
                        title: s.title,
                        description: s.description,
                        coverUrl: s.coverUrl,
                        categoryId: s.categoryId,
                        episodeCount: s.totalEpisodes,
                        status: s.upStatus || (s.statusOption?.name || ''),
                        createdAt: date_util_1.DateUtil.formatDateTime(s.createdAt)
                    })),
                    total: series.length,
                    categoryName: series[0]?.category?.name || ''
                },
                msg: null
            };
            await this.cacheManager.set(cacheKey, result, 1800000);
            console.log(`💾 分类系列已缓存: ${cacheKey}`);
            return result;
        }
        catch (error) {
            console.error('根据分类获取系列列表失败:', error);
            throw new Error('根据分类获取系列列表失败');
        }
    }
    async getVideoList(categoryId, page = 1, size = 20) {
        try {
            const offset = (page - 1) * size;
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .where('series.isActive = :isActive', { isActive: 1 })
                .orderBy('series.createdAt', 'DESC')
                .skip(offset)
                .take(size);
            if (categoryId && categoryId > 0) {
                queryBuilder.andWhere('series.categoryId = :categoryId', { categoryId });
            }
            const series = await queryBuilder.getMany();
            return series.map(s => ({
                id: s.id,
                shortId: s.shortId,
                coverUrl: s.coverUrl || '',
                title: s.title,
                score: s.score ? s.score.toString() : '0',
                playCount: s.playCount || 0,
                url: s.shortId || s.id.toString(),
                type: s.category?.name || '',
                isSerial: true,
                upStatus: s.upStatus || '',
                upCount: 0,
                author: s.starring || '',
                description: s.description || '',
                cidMapper: s.categoryId?.toString() || '',
                isRecommend: s.score >= 8.0,
                createdAt: date_util_1.DateUtil.formatDateTime(s.createdAt)
            }));
        }
        catch (error) {
            console.error('获取视频列表失败:', error);
            return [];
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
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], MediaService);
//# sourceMappingURL=media.service.js.map
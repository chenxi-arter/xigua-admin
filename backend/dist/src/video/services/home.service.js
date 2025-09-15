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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const date_util_1 = require("../../common/utils/date.util");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const series_entity_1 = require("../entity/series.entity");
const category_entity_1 = require("../entity/category.entity");
const filter_service_1 = require("./filter.service");
const banner_service_1 = require("./banner.service");
const cache_keys_util_1 = require("../utils/cache-keys.util");
let HomeService = class HomeService {
    seriesRepo;
    categoryRepo;
    filterService;
    bannerService;
    cacheManager;
    constructor(seriesRepo, categoryRepo, filterService, bannerService, cacheManager) {
        this.seriesRepo = seriesRepo;
        this.categoryRepo = categoryRepo;
        this.filterService = filterService;
        this.bannerService = bannerService;
        this.cacheManager = cacheManager;
    }
    async getHomeVideos(channeid, page) {
        const cacheKey = cache_keys_util_1.CacheKeys.homeVideos(channeid, page);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`💾 首页视频缓存命中: ${cacheKey}`);
            return cached;
        }
        try {
            const result = await this.getHomeModules(channeid, page);
            await this.cacheManager.set(cacheKey, result, 300000);
            console.log(`💾 首页视频已缓存: ${cacheKey}`);
            return result;
        }
        catch (error) {
            console.error('获取首页视频失败:', error);
            throw new Error('获取首页视频失败');
        }
    }
    async getHomeModules(channeid, page) {
        try {
            const contentBlocks = [];
            if (page === 1) {
                const banners = await this.bannerService.getActiveBanners(channeid, 5);
                if (banners.length > 0) {
                    contentBlocks.push({
                        type: 0,
                        name: "轮播图",
                        filters: [],
                        banners: banners,
                        list: []
                    });
                }
                const filterTags = await this.filterService.getFiltersTags(channeid.toString());
                contentBlocks.push({
                    type: 1001,
                    name: "搜索过滤器",
                    filters: filterTags.data?.list || [],
                    banners: [],
                    list: []
                });
                contentBlocks.push({
                    type: -1,
                    name: "广告",
                    filters: [],
                    banners: [],
                    list: []
                });
            }
            const videoList = await this.getVideoList(channeid, page, 20);
            contentBlocks.push({
                type: 3,
                name: "视频列表",
                filters: [],
                banners: [],
                list: videoList
            });
            return {
                code: 200,
                msg: "success",
                data: {
                    list: contentBlocks
                }
            };
        }
        catch (error) {
            console.error('获取首页模块失败:', error);
            throw new Error('获取首页模块失败');
        }
    }
    async listCategories() {
        const cacheKey = cache_keys_util_1.CacheKeys.categories();
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`💾 分类列表缓存命中: ${cacheKey}`);
            return cached;
        }
        try {
            const categories = await this.categoryRepo.find({
                where: { isEnabled: true },
                order: { id: 'ASC' }
            });
            const result = {
                ret: 200,
                data: {
                    versionNo: Math.floor(Date.now() / 1000),
                    list: categories.map(cat => ({
                        channeid: cat.id,
                        name: cat.name,
                        routeName: cat.routeName || cat.name.toLowerCase()
                    }))
                },
                msg: null
            };
            await this.cacheManager.set(cacheKey, result, 3600000);
            console.log(`💾 分类列表已缓存: ${cacheKey}`);
            return result;
        }
        catch (error) {
            console.error('获取分类列表失败:', error);
            throw new Error('获取分类列表失败');
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
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        filter_service_1.FilterService,
        banner_service_1.BannerService, Object])
], HomeService);
//# sourceMappingURL=home.service.js.map
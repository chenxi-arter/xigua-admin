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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const category_entity_1 = require("../entity/category.entity");
const series_entity_1 = require("../entity/series.entity");
const cache_keys_util_1 = require("../utils/cache-keys.util");
const app_logger_service_1 = require("../../common/logger/app-logger.service");
const query_optimizer_util_1 = require("../../common/utils/query-optimizer.util");
let CategoryService = class CategoryService {
    categoryRepo;
    seriesRepo;
    cacheManager;
    logger;
    constructor(categoryRepo, seriesRepo, cacheManager, appLogger) {
        this.categoryRepo = categoryRepo;
        this.seriesRepo = seriesRepo;
        this.cacheManager = cacheManager;
        this.logger = appLogger.createChildLogger('CategoryService');
    }
    async getAllCategories() {
        const cacheKey = cache_keys_util_1.CacheKeys.categories();
        const startTime = Date.now();
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.logCacheOperation('GET', cacheKey, true);
                return cached;
            }
            this.logger.logCacheOperation('GET', cacheKey, false);
            const queryBuilder = this.categoryRepo.createQueryBuilder('category');
            query_optimizer_util_1.QueryOptimizer.addSorting(queryBuilder, 'category.name', 'ASC');
            const categories = await queryBuilder.getMany();
            const duration = Date.now() - startTime;
            this.logger.logDatabaseOperation('SELECT', 'category', { count: categories.length }, duration);
            await this.cacheManager.set(cacheKey, categories, cache_keys_util_1.CacheKeys.TTL.VERY_LONG);
            this.logger.logCacheOperation('SET', cacheKey, undefined, cache_keys_util_1.CacheKeys.TTL.VERY_LONG);
            return categories;
        }
        catch (error) {
            this.logger.error('获取分类列表失败', error.stack);
            throw new Error('获取分类列表失败');
        }
    }
    async getCategoryById(id) {
        const cacheKey = `${cache_keys_util_1.CacheKeys.categories()}_detail_${id}`;
        const startTime = Date.now();
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.logCacheOperation('GET', cacheKey, true);
                return cached;
            }
            this.logger.logCacheOperation('GET', cacheKey, false);
            const category = await this.categoryRepo.findOne({
                where: { id },
            });
            const duration = Date.now() - startTime;
            this.logger.logDatabaseOperation('SELECT', 'category', { id, found: !!category }, duration);
            if (category) {
                await this.cacheManager.set(cacheKey, category, cache_keys_util_1.CacheKeys.TTL.LONG);
                this.logger.logCacheOperation('SET', cacheKey, undefined, cache_keys_util_1.CacheKeys.TTL.LONG);
            }
            return category;
        }
        catch (error) {
            this.logger.error(`获取分类详情失败: ${id}`, error.stack);
            throw new Error('获取分类详情失败');
        }
    }
    async getCategorySeriesCount(categoryId) {
        const cacheKey = `${cache_keys_util_1.CacheKeys.categories()}_stats_${categoryId}`;
        let count = await this.cacheManager.get(cacheKey);
        if (count !== undefined) {
            return count;
        }
        try {
            count = await this.seriesRepo.count({
                where: { category: { id: categoryId } },
            });
            await this.cacheManager.set(cacheKey, count, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return count;
        }
        catch (error) {
            console.error('获取分类剧集数量失败:', error instanceof Error ? error.stack : error);
            return 0;
        }
    }
    async getCategoriesWithStats() {
        const cacheKey = 'categories:with_stats';
        const result = await this.cacheManager.get(cacheKey);
        if (result) {
            return result;
        }
        const categories = await this.categoryRepo.find({
            order: { name: 'ASC' },
        });
        const categoriesWithStats = await Promise.all(categories.map(async (category) => {
            const seriesCount = await this.getCategorySeriesCount(category.id);
            return {
                ...category,
                seriesCount: typeof seriesCount === 'number' ? seriesCount : 0,
            };
        }));
        await this.cacheManager.set(cacheKey, categoriesWithStats, 1800000);
        return categoriesWithStats;
    }
    async createCategory(name) {
        const existingCategory = await this.categoryRepo.findOne({
            where: { name },
        });
        if (existingCategory) {
            throw new Error('分类名称已存在');
        }
        const category = this.categoryRepo.create({
            name,
        });
        const savedCategory = await this.categoryRepo.save(category);
        await this.clearCategoryCache();
        return savedCategory;
    }
    async updateCategory(id, name) {
        const category = await this.categoryRepo.findOne({
            where: { id },
        });
        if (!category) {
            throw new Error('分类不存在');
        }
        if (name && name !== category.name) {
            const existingCategory = await this.categoryRepo.findOne({
                where: { name },
            });
            if (existingCategory) {
                throw new Error('分类名称已存在');
            }
        }
        if (name)
            category.name = name;
        const updatedCategory = await this.categoryRepo.save(category);
        await this.clearCategoryCache();
        await this.cacheManager.del(`category:${id}`);
        return updatedCategory;
    }
    async deleteCategory(id) {
        const category = await this.categoryRepo.findOne({
            where: { id },
        });
        if (!category) {
            throw new Error('分类不存在');
        }
        const seriesCount = await this.getCategorySeriesCount(id);
        if (typeof seriesCount === 'number' && seriesCount > 0) {
            throw new Error('该分类下还有剧集，无法删除');
        }
        await this.categoryRepo.remove(category);
        await this.clearCategoryCache();
        await this.cacheManager.del(`category:${id}`);
        await this.cacheManager.del(`category:${id}:series_count`);
        return { ok: true };
    }
    async clearCategoryCache() {
        await this.cacheManager.del('categories:all');
        await this.cacheManager.del('categories:with_stats');
    }
    async getPopularCategories(limit = 10) {
        const cacheKey = `categories:popular:${limit}`;
        const result = await this.cacheManager.get(cacheKey);
        if (result) {
            return result;
        }
        const categoriesWithStats = await this.getCategoriesWithStats();
        const popularCategories = categoriesWithStats
            .sort((a, b) => b.seriesCount - a.seriesCount)
            .slice(0, limit);
        await this.cacheManager.set(cacheKey, popularCategories, 3600000);
        return popularCategories;
    }
    async getRawCategories() {
        const cacheKey = 'categories:raw';
        const startTime = Date.now();
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.logCacheOperation('GET', cacheKey, true);
                return cached;
            }
            this.logger.logCacheOperation('GET', cacheKey, false);
            const categories = await this.categoryRepo.find({
                where: { isEnabled: true },
                order: { id: 'ASC' }
            });
            const duration = Date.now() - startTime;
            this.logger.logDatabaseOperation('SELECT', 'category', { count: categories.length }, duration);
            await this.cacheManager.set(cacheKey, categories, cache_keys_util_1.CacheKeys.TTL.LONG);
            this.logger.logCacheOperation('SET', cacheKey, undefined, cache_keys_util_1.CacheKeys.TTL.LONG);
            return categories;
        }
        catch (error) {
            this.logger.error('获取原始分类数据失败', error.stack);
            throw new Error('获取原始分类数据失败');
        }
    }
    async getCategoryList(versionNo) {
        const cacheKey = cache_keys_util_1.CacheKeys.categories() + ':list';
        const startTime = Date.now();
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.logCacheOperation('GET', cacheKey, true);
                return cached;
            }
            this.logger.logCacheOperation('GET', cacheKey, false);
            const categories = await this.categoryRepo.find({
                where: { isEnabled: true },
                order: { categoryId: 'ASC' }
            });
            const duration = Date.now() - startTime;
            this.logger.logDatabaseOperation('SELECT', 'category', { count: categories.length }, duration);
            const formattedList = categories.map(category => ({
                channeid: category.id,
                name: category.name,
                routeName: category.routeName
            }));
            const result = {
                ret: 200,
                data: {
                    versionNo: versionNo || 20240112,
                    list: formattedList
                },
                msg: null
            };
            await this.cacheManager.set(cacheKey, result, cache_keys_util_1.CacheKeys.TTL.LONG);
            this.logger.logCacheOperation('SET', cacheKey, undefined, cache_keys_util_1.CacheKeys.TTL.LONG);
            return result;
        }
        catch (error) {
            this.logger.error('获取分类列表失败', error.stack);
            throw new Error('获取分类列表失败');
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, app_logger_service_1.AppLoggerService])
], CategoryService);
//# sourceMappingURL=category.service.js.map
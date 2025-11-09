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
exports.SearchSuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const series_entity_1 = require("../entity/series.entity");
let SearchSuggestionsService = class SearchSuggestionsService {
    seriesRepo;
    cacheManager;
    constructor(seriesRepo, cacheManager) {
        this.seriesRepo = seriesRepo;
        this.cacheManager = cacheManager;
    }
    async getHotSearchSuggestions(limit = 10, categoryId, daysRange = 30) {
        const cacheKey = `hot_search:${limit}:${categoryId || 'all'}:${daysRange}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached.slice(0, limit);
        }
        try {
            let queryBuilder = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .where('series.isActive = :isActive', { isActive: 1 });
            if (categoryId) {
                queryBuilder = queryBuilder.andWhere('series.categoryId = :categoryId', { categoryId });
            }
            if (daysRange > 0) {
                queryBuilder = queryBuilder.andWhere('series.updatedAt >= DATE_SUB(NOW(), INTERVAL :days DAY)', { days: daysRange });
            }
            queryBuilder = queryBuilder
                .addSelect('(series.playCount * 0.7 + CAST(series.score AS DECIMAL(10,2)) * 1000 * 0.3)', 'hotScore')
                .orderBy('hotScore', 'DESC')
                .addOrderBy('series.updatedAt', 'DESC')
                .limit(limit);
            const series = await queryBuilder.getMany();
            const suggestions = series.map(s => ({
                id: s.id,
                title: s.title,
                shortId: s.shortId || '',
                categoryName: s.category?.name || '',
                playCount: s.playCount || 0,
                score: String(s.score || '0.0'),
            }));
            await this.cacheManager.set(cacheKey, suggestions, 21600000);
            return suggestions;
        }
        catch (error) {
            console.error('获取热门搜索词失败:', error);
            return [];
        }
    }
    async getPopularSearchTerms(limit = 10) {
        return [];
    }
};
exports.SearchSuggestionsService = SearchSuggestionsService;
exports.SearchSuggestionsService = SearchSuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], SearchSuggestionsService);
//# sourceMappingURL=search-suggestions.service.js.map
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
exports.FilterService = void 0;
const common_1 = require("@nestjs/common");
const date_util_1 = require("../../common/utils/date.util");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const cache_keys_util_1 = require("../utils/cache-keys.util");
const filter_query_builder_util_1 = require("../utils/filter-query-builder.util");
let FilterService = class FilterService {
    filterTypeRepo;
    filterOptionRepo;
    seriesRepo;
    episodeRepo;
    cacheManager;
    constructor(filterTypeRepo, filterOptionRepo, seriesRepo, episodeRepo, cacheManager) {
        this.filterTypeRepo = filterTypeRepo;
        this.filterOptionRepo = filterOptionRepo;
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
        this.cacheManager = cacheManager;
    }
    async getFiltersTags(channelId) {
        const cacheKey = cache_keys_util_1.CacheKeys.filterTags(channelId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const filterTypes = await this.filterTypeRepo
                .createQueryBuilder('filterType')
                .leftJoinAndSelect('filterType.options', 'option', 'option.isActive = :isActive', { isActive: true })
                .where('filterType.isActive = :isActive', { isActive: true })
                .orderBy('filterType.indexPosition', 'ASC')
                .addOrderBy('option.displayOrder', 'ASC')
                .getMany();
            console.log('DEBUG: Raw query results:');
            filterTypes.forEach((ft, i) => {
                console.log(`  ${i + 1}. FilterType ${ft.id} - ${ft.name} (${ft.options?.length || 0} options)`);
                ft.options?.forEach((opt, j) => {
                    console.log(`    ${j + 1}. Option ${opt.id}: ${opt.name} (display_order: ${opt.displayOrder}, filter_type_id: ${opt.filterTypeId})`);
                });
            });
            const filterGroups = [];
            for (const filterType of filterTypes) {
                const items = [];
                if (filterType.options && filterType.options.length > 0) {
                    const sortedOptions = filterType.options
                        .filter(option => option.isActive)
                        .sort((a, b) => (a.displayOrder || a.sortOrder || 0) - (b.displayOrder || b.sortOrder || 0));
                    for (const option of sortedOptions) {
                        const displayOrder = option.displayOrder !== null && option.displayOrder !== undefined ? option.displayOrder : (option.sortOrder || 0);
                        items.push({
                            index: displayOrder,
                            classifyId: displayOrder,
                            classifyName: option.name,
                            isDefaultSelect: option.isDefault || displayOrder === 0,
                        });
                    }
                }
                filterGroups.push({
                    name: filterType.name,
                    list: items,
                });
            }
            const response = {
                data: {
                    list: filterGroups,
                },
                code: 200,
                msg: null,
            };
            await this.cacheManager.set(cacheKey, response, cache_keys_util_1.CacheKeys.TTL.MEDIUM);
            return response;
        }
        catch (error) {
            console.error('获取筛选器标签失败:', error);
            throw new Error('获取筛选器标签失败');
        }
    }
    async getFiltersData(channelId, ids, page) {
        if (!channelId || channelId.trim() === '') {
            return {
                data: { list: [], total: 0, page: 1, size: 20, hasMore: false },
                code: 400,
                msg: 'channeid参数不能为空',
            };
        }
        try {
            const pageNum = parseInt(page) || 1;
            const pageSize = 20;
            const offset = (pageNum - 1) * pageSize;
            const filterIds = this.parseFilterIds(ids);
            const rawTokens = ids.split(',');
            const idTokens = Array(6).fill('0');
            for (let i = 0; i < Math.min(6, rawTokens.length); i++) {
                idTokens[i] = (rawTokens[i] ?? '0');
            }
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.regionOption', 'regionOption')
                .leftJoinAndSelect('series.languageOption', 'languageOption')
                .leftJoinAndSelect('series.statusOption', 'statusOption')
                .leftJoinAndSelect('series.yearOption', 'yearOption')
                .where('series.isActive = :isActive', { isActive: 1 })
                .distinct(true);
            queryBuilder.leftJoin('series_genre_options', 'sgo', 'sgo.series_id = series.id');
            await this.applyFilters(queryBuilder, filterIds, channelId, idTokens);
            this.applySorting(queryBuilder, filterIds.typeId);
            const [series, total] = await queryBuilder
                .skip(offset)
                .take(pageSize)
                .getManyAndCount();
            if (!series || series.length === 0) {
                const response = {
                    data: { list: [], total: 0, page: pageNum, size: pageSize, hasMore: false },
                    code: 200,
                    msg: '暂无相关数据',
                };
                return response;
            }
            const seriesIds = series.map(s => s.id);
            const now = new Date();
            const tzOffsetMs = now.getTimezoneOffset() * 60000;
            const localNow = new Date(now.getTime() - tzOffsetMs);
            const dayStartLocal = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate());
            const dayEndLocal = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate() + 1);
            const dayStart = new Date(dayStartLocal.getTime() + tzOffsetMs);
            const dayEnd = new Date(dayEndLocal.getTime() + tzOffsetMs);
            let upCountMap = {};
            if (seriesIds.length > 0) {
                const rows = await this.episodeRepo.createQueryBuilder('ep')
                    .select('ep.series_id', 'seriesId')
                    .addSelect('COUNT(*)', 'cnt')
                    .where('ep.series_id IN (:...ids)', { ids: seriesIds })
                    .andWhere('ep.status = :published', { published: 'published' })
                    .andWhere('ep.created_at >= :start AND ep.created_at < :end', { start: dayStart, end: dayEnd })
                    .groupBy('ep.series_id')
                    .getRawMany();
                upCountMap = rows.reduce((acc, r) => {
                    acc[Number(r.seriesId)] = Number(r.cnt) || 0;
                    return acc;
                }, {});
            }
            let statMap = {};
            if (seriesIds.length > 0) {
                const rows2 = await this.episodeRepo.createQueryBuilder('ep')
                    .select('ep.series_id', 'seriesId')
                    .addSelect('SUM(ep.like_count)', 'likeSum')
                    .addSelect('SUM(ep.dislike_count)', 'dislikeSum')
                    .addSelect('SUM(ep.favorite_count)', 'favoriteSum')
                    .where('ep.series_id IN (:...ids)', { ids: seriesIds })
                    .andWhere('ep.status = :published', { published: 'published' })
                    .groupBy('ep.series_id')
                    .getRawMany();
                statMap = rows2.reduce((acc, r) => {
                    acc[Number(r.seriesId)] = {
                        like: Number(r.likeSum) || 0,
                        dislike: Number(r.dislikeSum) || 0,
                        favorite: Number(r.favoriteSum) || 0,
                    };
                    return acc;
                }, {});
            }
            const items = series.map(s => ({
                id: s.id,
                shortId: s.shortId || '',
                coverUrl: s.coverUrl || '',
                title: s.title,
                score: s.score?.toString() || '0.0',
                playCount: s.playCount || 0,
                url: s.id.toString(),
                type: s.category?.name || '未分类',
                isSerial: (s.totalEpisodes && s.totalEpisodes > 1) || false,
                upStatus: s.upStatus || (s.statusOption?.name ? `${s.statusOption.name}` : '已完结'),
                upCount: upCountMap[s.id] ?? 0,
                likeCount: statMap[s.id]?.like ?? 0,
                dislikeCount: statMap[s.id]?.dislike ?? 0,
                favoriteCount: statMap[s.id]?.favorite ?? 0,
                author: s.starring || s.actor || '',
                description: s.description || '',
                cidMapper: s.category?.id?.toString() || '0',
                isRecommend: false,
                createdAt: s.createdAt ? date_util_1.DateUtil.formatDateTime(s.createdAt) : date_util_1.DateUtil.formatDateTime(new Date()),
            }));
            const response = {
                data: {
                    list: items,
                    total,
                    page: pageNum,
                    size: pageSize,
                    hasMore: total > pageNum * pageSize,
                },
                code: 200,
                msg: null,
            };
            return response;
        }
        catch (error) {
            console.error('获取筛选器数据失败:', error);
            throw new Error('获取筛选器数据失败');
        }
    }
    parseFilterIds(ids) {
        const parts = ids.split(',').map(id => parseInt(id) || 0);
        return {
            typeId: parts[0] || 0,
            genreId: parts[1] || 0,
            regionId: parts[2] || 0,
            languageId: parts[3] || 0,
            yearId: parts[4] || 0,
            statusId: parts[5] || 0,
        };
    }
    async applyFiltersToQueryBuilder(queryBuilder, filterIds, channelId) {
        await this.applyFilters(queryBuilder, filterIds, channelId);
    }
    async applyFilters(queryBuilder, filterIds, channelId, idTokens) {
        filter_query_builder_util_1.FilterQueryBuilderUtil.applyChannel(queryBuilder, channelId);
        const filterTypes = await this.filterTypeRepo.find({
            order: { indexPosition: 'ASC' },
            where: { isActive: true }
        });
        const idsArray = [
            filterIds.typeId,
            filterIds.genreId,
            filterIds.regionId,
            filterIds.languageId,
            filterIds.yearId,
            filterIds.statusId
        ];
        for (let i = 0; i < Math.min(filterTypes.length, idsArray.length); i++) {
            const filterType = filterTypes[i];
            const optionId = idsArray[i];
            if (optionId > 0) {
                const option = await this.filterOptionRepo.findOne({
                    where: {
                        filterTypeId: filterType.id,
                        displayOrder: optionId,
                        isActive: true
                    }
                });
                if (option) {
                    console.log(`[DEBUG] 应用筛选: ${filterType.code}, display_order: ${optionId}, option_id: ${option.id}, option_name: ${option.name}`);
                    const isNumericChannel = /^\d+$/.test(channelId);
                    const hasChannelCategory = isNumericChannel && parseInt(channelId, 10) > 0;
                    if (filterType.code === 'type' && hasChannelCategory) {
                        continue;
                    }
                    switch (filterType.code) {
                        case 'type': {
                            break;
                        }
                        case 'genre': {
                            const raw = idTokens?.[1] || '';
                            const displayOrders = raw.includes('-')
                                ? raw.split('-').map(x => parseInt(x) || 0).filter(x => x > 0)
                                : [optionId].filter(x => x > 0);
                            if (displayOrders.length) {
                                const genreRow = await this.filterTypeRepo.findOne({ where: { code: 'genre', isActive: true } });
                                if (genreRow) {
                                    const opts = await this.filterOptionRepo.createQueryBuilder('fo')
                                        .select('fo.id', 'id')
                                        .where('fo.filter_type_id = :ftid', { ftid: genreRow.id })
                                        .andWhere('fo.display_order IN (:...dos)', { dos: displayOrders })
                                        .andWhere('fo.is_active = 1')
                                        .getRawMany();
                                    const genreIds = opts.map((r) => Number(r.id)).filter(Boolean);
                                    if (genreIds.length) {
                                        if (displayOrders.length === 1) {
                                            queryBuilder.andWhere('sgo.option_id IN (:...genreIds)', { genreIds });
                                        }
                                        else {
                                            queryBuilder.andWhere('sgo.option_id IN (:...genreIds)', { genreIds });
                                            queryBuilder.groupBy('series.id');
                                            queryBuilder.having('COUNT(DISTINCT sgo.option_id) = :requiredCount', { requiredCount: genreIds.length });
                                        }
                                    }
                                    else {
                                        queryBuilder.andWhere('1 = 0');
                                    }
                                }
                            }
                            break;
                        }
                        case 'region':
                            filter_query_builder_util_1.FilterQueryBuilderUtil.applyRegion(queryBuilder, option.id);
                            break;
                        case 'language':
                            filter_query_builder_util_1.FilterQueryBuilderUtil.applyLanguage(queryBuilder, option.id);
                            break;
                        case 'year':
                            filter_query_builder_util_1.FilterQueryBuilderUtil.applyYear(queryBuilder, option.id);
                            break;
                        case 'status':
                            filter_query_builder_util_1.FilterQueryBuilderUtil.applyStatus(queryBuilder, option.id);
                            break;
                        default:
                            break;
                    }
                }
                else {
                    console.log(`[DEBUG] 未找到筛选选项: filter_type_id=${filterType.id}, display_order=${optionId}`);
                    queryBuilder.andWhere('1 = 0');
                }
            }
        }
    }
    async applyFilterByType() { }
    applySorting(queryBuilder, typeId) {
        filter_query_builder_util_1.FilterQueryBuilderUtil.applySorting(queryBuilder, typeId);
    }
    async resolveYearNameFromDate(date) {
        if (!date)
            return '';
        const year = (date instanceof Date ? date : new Date(date)).getFullYear().toString();
        let yearOption = await this.filterOptionRepo.findOne({ where: { value: year } });
        if (!yearOption) {
            yearOption = await this.filterOptionRepo.findOne({ where: { name: year + '年' } });
        }
        return yearOption?.name || year;
    }
    async clearFilterCache(channelId) {
        try {
            if (channelId) {
                const patterns = [
                    cache_keys_util_1.CacheKeys.filterTags(channelId),
                    `${cache_keys_util_1.CacheKeys.filterData(channelId, '*', '*')}*`
                ];
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
            }
            else {
                const patterns = cache_keys_util_1.CacheKeys.getPatternKeys('filter_all');
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
            }
        }
        catch (error) {
            console.error('清除筛选器缓存失败:', error);
        }
    }
    async clearAllFilterTagsCache() {
        try {
            const commonChannels = ['1', '2', '3', '4', '5'];
            for (const channelId of commonChannels) {
                await this.cacheManager.del(cache_keys_util_1.CacheKeys.filterTags(channelId));
            }
            console.log('已清除所有筛选器标签缓存');
        }
        catch (error) {
            console.error('清除筛选器标签缓存失败:', error);
        }
    }
    async fuzzySearch(keyword, categoryId, page = 1, size = 20) {
        console.log('模糊搜索开始:', { keyword, categoryId, page, size });
        if (!keyword || keyword.trim() === '') {
            console.log('搜索关键词为空');
            return {
                code: 400,
                data: {
                    list: [],
                    total: 0,
                    page: 1,
                    size: 20,
                    hasMore: false
                },
                msg: '搜索关键词不能为空'
            };
        }
        try {
            const offset = (page - 1) * size;
            console.log('查询参数:', { offset, size });
            const trimmedKeyword = keyword.trim();
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .leftJoinAndSelect('series.regionOption', 'regionOption')
                .leftJoinAndSelect('series.languageOption', 'languageOption')
                .leftJoinAndSelect('series.statusOption', 'statusOption')
                .leftJoinAndSelect('series.yearOption', 'yearOption')
                .where('series.title LIKE :keyword', { keyword: `%${trimmedKeyword}%` })
                .andWhere('series.isActive = :isActive', { isActive: 1 });
            if (categoryId && categoryId.trim() !== '') {
                queryBuilder.andWhere('series.category_id = :categoryId', { categoryId: parseInt(categoryId) });
            }
            queryBuilder
                .addSelect(`
          CASE 
            WHEN series.title = :keyword THEN 1
            WHEN series.title LIKE CONCAT(:keyword, '%') THEN 2
            WHEN series.title LIKE CONCAT('%', :keyword, '%') THEN 3
            ELSE 4
          END
        `, 'matchPriority')
                .addSelect('LOCATE(:keyword, series.title)', 'matchPosition')
                .addSelect('CHAR_LENGTH(series.title)', 'titleLength')
                .orderBy('matchPriority', 'ASC')
                .addOrderBy('matchPosition', 'ASC')
                .addOrderBy('titleLength', 'ASC')
                .addOrderBy('series.createdAt', 'DESC');
            console.log('SQL查询:', queryBuilder.getSql());
            console.log('查询参数:', queryBuilder.getParameters());
            const [series, total] = await queryBuilder
                .skip(offset)
                .take(size)
                .getManyAndCount();
            console.log('查询结果:', { count: series?.length || 0, total });
            if (!series || series.length === 0) {
                console.log('未找到相关结果');
                const response = {
                    code: 200,
                    data: {
                        list: [],
                        total: 0,
                        page,
                        size,
                        hasMore: false
                    },
                    msg: '未找到相关结果'
                };
                return response;
            }
            const items = series.map(s => ({
                id: s.id,
                shortId: s.shortId || '',
                coverUrl: s.coverUrl || '',
                title: s.title,
                score: s.score?.toString() || '0.0',
                playCount: s.playCount || 0,
                url: s.id.toString(),
                type: s.category?.name || '未分类',
                isSerial: (s.episodes && s.episodes.length > 1) || false,
                upStatus: s.upStatus || (s.statusOption?.name ? `${s.statusOption.name}` : '已完结'),
                upCount: 0,
                author: s.starring || s.actor || '',
                description: s.description || '',
                cidMapper: s.category?.id?.toString() || '0',
                isRecommend: false,
                createdAt: s.createdAt ? date_util_1.DateUtil.formatDateTime(s.createdAt) : date_util_1.DateUtil.formatDateTime(new Date()),
                channeid: s.categoryId || 0
            }));
            const response = {
                code: 200,
                data: {
                    list: items,
                    total,
                    page,
                    size,
                    hasMore: total > page * size
                },
                msg: null
            };
            console.log('返回结果:', { itemCount: items.length, total, hasMore: response.data.hasMore });
            return response;
        }
        catch (error) {
            console.error('模糊搜索失败:', error);
            return {
                code: 500,
                data: {
                    list: [],
                    total: 0,
                    page,
                    size,
                    hasMore: false
                },
                msg: '搜索失败，请稍后重试'
            };
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
exports.FilterService = FilterService;
exports.FilterService = FilterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(filter_type_entity_1.FilterType)),
    __param(1, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __param(2, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(3, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], FilterService);
//# sourceMappingURL=filter.service.js.map
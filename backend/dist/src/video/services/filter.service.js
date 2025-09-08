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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const series_entity_1 = require("../entity/series.entity");
const cache_keys_util_1 = require("../utils/cache-keys.util");
const filter_query_builder_util_1 = require("../utils/filter-query-builder.util");
let FilterService = class FilterService {
    filterTypeRepo;
    filterOptionRepo;
    seriesRepo;
    cacheManager;
    constructor(filterTypeRepo, filterOptionRepo, seriesRepo, cacheManager) {
        this.filterTypeRepo = filterTypeRepo;
        this.filterOptionRepo = filterOptionRepo;
        this.seriesRepo = seriesRepo;
        this.cacheManager = cacheManager;
    }
    async getFiltersTags(channelId) {
        const cacheKey = cache_keys_util_1.CacheKeys.filterTags(channelId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            let filterTypes;
            if (channelId && channelId !== '0' && channelId !== '1') {
                filterTypes = await this.filterTypeRepo.find({
                    relations: ['options'],
                    order: { sortOrder: 'ASC' },
                });
            }
            else {
                filterTypes = await this.filterTypeRepo.find({
                    relations: ['options'],
                    order: { sortOrder: 'ASC' },
                });
            }
            const filterGroups = [];
            for (const filterType of filterTypes) {
                const items = [
                    {
                        index: 0,
                        classifyId: 0,
                        classifyName: '全部',
                        isDefaultSelect: true,
                    },
                ];
                if (filterType.options && filterType.options.length > 0) {
                    const sortedOptions = filterType.options.sort((a, b) => a.sortOrder - b.sortOrder);
                    let filteredOptions = sortedOptions;
                    if (channelId && channelId !== '0' && channelId !== '1') {
                        const channelNum = parseInt(channelId);
                        if (channelNum === 2) {
                            filteredOptions = sortedOptions.slice(0, Math.min(3, sortedOptions.length));
                        }
                        else if (channelNum === 3) {
                            filteredOptions = sortedOptions.slice(0, Math.min(5, sortedOptions.length));
                        }
                        else if (channelNum >= 4) {
                            filteredOptions = [...sortedOptions].reverse();
                        }
                    }
                    for (let i = 0; i < filteredOptions.length; i++) {
                        const option = filteredOptions[i];
                        items.push({
                            index: i + 1,
                            classifyId: option.id,
                            classifyName: option.name,
                            isDefaultSelect: false,
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
            await this.cacheManager.set(cacheKey, response, cache_keys_util_1.CacheKeys.TTL.SHORT);
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
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('series.isActive = :isActive', { isActive: 1 });
            await this.applyFilters(queryBuilder, filterIds, channelId);
            this.applySorting(queryBuilder, filterIds.sortType);
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
                upStatus: s.upStatus || '已完结',
                upCount: s.upCount || 0,
                author: s.starring || s.actor || '',
                description: s.description || '',
                cidMapper: s.category?.id?.toString() || '0',
                isRecommend: false,
                createdAt: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString(),
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
            sortType: parts[0] || 0,
            categoryId: parts[1] || 0,
            regionId: parts[2] || 0,
            languageId: parts[3] || 0,
            yearId: parts[4] || 0,
            statusId: parts[5] || 0,
        };
    }
    async applyFiltersToQueryBuilder(queryBuilder, filterIds, channelId) {
        await this.applyFilters(queryBuilder, filterIds, channelId);
    }
    async applyFilters(queryBuilder, filterIds, channelId) {
        filter_query_builder_util_1.FilterQueryBuilderUtil.applyChannel(queryBuilder, channelId);
        const filterTypes = await this.filterTypeRepo.find({
            order: { sortOrder: 'ASC' },
            where: { isActive: true }
        });
        const idsArray = [
            filterIds.sortType,
            filterIds.categoryId,
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
                        sortOrder: optionId,
                        isActive: true
                    }
                });
                if (option) {
                    console.log(`[DEBUG] 应用筛选: ${filterType.code}, sort_order: ${optionId}, option_id: ${option.id}, option_name: ${option.name}`);
                    const isNumericChannel = /^\d+$/.test(channelId);
                    const hasChannelCategory = isNumericChannel && parseInt(channelId, 10) > 0;
                    if (filterType.code === 'type' && hasChannelCategory) {
                        continue;
                    }
                    switch (filterType.code) {
                        case 'type':
                            filter_query_builder_util_1.FilterQueryBuilderUtil.applyType(queryBuilder, option.id);
                            break;
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
                        case 'sort':
                            break;
                        default:
                            break;
                    }
                }
                else {
                    console.log(`[DEBUG] 未找到筛选选项: filter_type_id=${filterType.id}, sort_order=${optionId}`);
                }
            }
        }
    }
    async applyFilterByType() { }
    applySorting(queryBuilder, sortType) {
        filter_query_builder_util_1.FilterQueryBuilderUtil.applySorting(queryBuilder, sortType);
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
    async fuzzySearch(keyword, channeid, page = 1, size = 20) {
        console.log('模糊搜索开始:', { keyword, channeid, page, size });
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
            const queryBuilder = this.seriesRepo.createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('series.title LIKE :keyword', { keyword: `%${keyword.trim()}%` })
                .andWhere('series.isActive = :isActive', { isActive: 1 });
            if (channeid && channeid.trim() !== '') {
                queryBuilder.andWhere('series.category_id = :channeid', { channeid: parseInt(channeid) });
            }
            queryBuilder.orderBy('series.createdAt', 'DESC');
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
                upStatus: s.upStatus || '已完结',
                upCount: s.upCount || 0,
                author: s.starring || s.actor || '',
                description: s.description || '',
                cidMapper: s.category?.id?.toString() || '0',
                isRecommend: false,
                createdAt: s.createdAt ? s.createdAt.toISOString() : new Date().toISOString(),
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
};
exports.FilterService = FilterService;
exports.FilterService = FilterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(filter_type_entity_1.FilterType)),
    __param(1, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __param(2, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], FilterService);
//# sourceMappingURL=filter.service.js.map
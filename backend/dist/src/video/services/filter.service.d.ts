import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { FilterType } from '../entity/filter-type.entity';
import { FilterOption } from '../entity/filter-option.entity';
import { Series } from '../entity/series.entity';
import { FilterTagsResponse } from '../dto/filter-tags.dto';
import { FilterDataResponse } from '../dto/filter-data.dto';
import { FuzzySearchResponse } from '../dto/fuzzy-search.dto';
export declare class FilterService {
    private readonly filterTypeRepo;
    private readonly filterOptionRepo;
    private readonly seriesRepo;
    private readonly cacheManager;
    constructor(filterTypeRepo: Repository<FilterType>, filterOptionRepo: Repository<FilterOption>, seriesRepo: Repository<Series>, cacheManager: Cache);
    getFiltersTags(channelId: string): Promise<FilterTagsResponse>;
    getFiltersData(channelId: string, ids: string, page: string): Promise<FilterDataResponse>;
    private parseFilterIds;
    applyFiltersToQueryBuilder(queryBuilder: any, filterIds: {
        sortType: number;
        categoryId: number;
        regionId: number;
        languageId: number;
        yearId: number;
        statusId: number;
    }, channelId: string): Promise<void>;
    private applyFilters;
    private applyFilterByType;
    private applySorting;
    resolveYearNameFromDate(date?: Date | string): Promise<string>;
    clearFilterCache(channelId?: string): Promise<void>;
    clearAllFilterTagsCache(): Promise<void>;
    fuzzySearch(keyword: string, channeid?: string, page?: number, size?: number): Promise<FuzzySearchResponse>;
}

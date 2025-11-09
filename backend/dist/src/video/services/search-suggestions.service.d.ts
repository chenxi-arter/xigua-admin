import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Series } from '../entity/series.entity';
export declare class SearchSuggestionsService {
    private readonly seriesRepo;
    private readonly cacheManager;
    constructor(seriesRepo: Repository<Series>, cacheManager: Cache);
    getHotSearchSuggestions(limit?: number, categoryId?: number, daysRange?: number): Promise<Array<{
        id: number;
        title: string;
        shortId: string;
        categoryName: string;
        playCount: number;
        score: string;
    }>>;
    getPopularSearchTerms(limit?: number): Promise<string[]>;
}

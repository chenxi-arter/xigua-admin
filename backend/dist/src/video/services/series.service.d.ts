import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Series } from '../entity/series.entity';
import { Episode } from '../entity/episode.entity';
import { Category } from '../entity/category.entity';
export declare class SeriesService {
    private readonly seriesRepo;
    private readonly episodeRepo;
    private readonly categoryRepo;
    private readonly cacheManager;
    constructor(seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>, categoryRepo: Repository<Category>, cacheManager: Cache);
    getSeriesByCategory(categoryId: number, page?: number, pageSize?: number): Promise<{
        series: Series[];
        total: number;
    }>;
    getSeriesDetail(seriesId: number): Promise<Series | null>;
    getPopularSeries(limit?: number, categoryId?: number): Promise<Series[]>;
    getLatestSeries(limit?: number, categoryId?: number): Promise<Series[]>;
    searchSeries(keyword: string, page?: number, pageSize?: number, categoryId?: number): Promise<{
        series: Series[];
        total: number;
    }>;
    getRecommendedSeries(userId?: number, limit?: number): Promise<Series[]>;
    incrementPlayCount(seriesId: number): Promise<void>;
    updateSeriesScore(seriesId: number, score: number): Promise<void>;
    createSeries(seriesData: Partial<Series>): Promise<Series>;
    updateSeries(seriesId: number, updateData: Partial<Series>): Promise<Series>;
    deleteSeries(seriesId: number): Promise<void>;
    clearSeriesCache(seriesId?: number): Promise<void>;
}

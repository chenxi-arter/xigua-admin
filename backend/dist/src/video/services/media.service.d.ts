import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Series } from '../entity/series.entity';
import { Category } from '../entity/category.entity';
export declare class MediaService {
    private readonly seriesRepo;
    private readonly categoryRepo;
    private readonly cacheManager;
    constructor(seriesRepo: Repository<Series>, categoryRepo: Repository<Category>, cacheManager: Cache);
    listMedia(categoryId?: number, type?: 'short' | 'series', userId?: number, sort?: 'latest' | 'like' | 'play', page?: number, size?: number): Promise<{
        code: number;
        data: {
            list: {
                id: number;
                shortId: string;
                title: string;
                description: string;
                coverUrl: string;
                type: string;
                categoryId: number;
                episodeCount: number;
                status: string;
                score: number;
                playCount: number;
                starring: string;
                director: string;
                createdAt: string;
            }[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
        msg: null;
    }>;
    listSeriesFull(categoryId?: number, page?: number, size?: number): Promise<{}>;
    listSeriesByCategory(categoryId: number): Promise<{}>;
    private getVideoList;
    private formatDateTime;
}

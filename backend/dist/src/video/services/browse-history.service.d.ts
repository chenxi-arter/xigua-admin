import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { BrowseHistory } from '../entity/browse-history.entity';
import { Series } from '../entity/series.entity';
import { User } from '../../user/entity/user.entity';
import { WatchProgress } from '../entity/watch-progress.entity';
import { Episode } from '../entity/episode.entity';
import { Request } from 'express';
export declare class BrowseHistoryService {
    private readonly browseHistoryRepo;
    private readonly seriesRepo;
    private readonly userRepo;
    private readonly watchProgressRepo;
    private readonly episodeRepo;
    private readonly cacheManager;
    constructor(browseHistoryRepo: Repository<BrowseHistory>, seriesRepo: Repository<Series>, userRepo: Repository<User>, watchProgressRepo: Repository<WatchProgress>, episodeRepo: Repository<Episode>, cacheManager: Cache);
    recordBrowseHistory(userId: number, seriesId: number, browseType?: string, lastEpisodeNumber?: number | null, req?: Request): Promise<void>;
    getUserBrowseHistory(userId: number, page?: number, size?: number, categoryId?: number): Promise<{
        list: any[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>;
    getRecentBrowsedSeries(userId: number, limit?: number): Promise<any[]>;
    cleanupExpiredBrowseHistory(): Promise<void>;
    getSystemStats(): Promise<{
        totalRecords: number;
        activeUsers: number;
        totalOperations: number;
    }>;
    private clearBrowseHistoryCache;
    private getClientIp;
    private checkIpBlacklist;
    private checkUserOperationLimit;
    deleteBrowseHistory(userId: number, seriesId?: number): Promise<void>;
    findSeriesByShortId(shortId: string): Promise<Series | null>;
    private getBrowseTypeDescription;
    private getWatchStatus;
    private formatDateTime;
    private checkAndEnforceUserRecordLimit;
}

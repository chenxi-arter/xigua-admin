import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Episode } from '../entity/episode.entity';
import { WatchProgress } from '../entity/watch-progress.entity';
import { WatchProgressService } from './watch-progress.service';
export declare class PlaybackService {
    private readonly episodeRepo;
    private readonly watchProgressRepo;
    private readonly watchProgressService;
    private readonly cacheManager;
    constructor(episodeRepo: Repository<Episode>, watchProgressRepo: Repository<WatchProgress>, watchProgressService: WatchProgressService, cacheManager: Cache);
    saveProgress(userId: number, episodeId: number, stopAtSecond: number): Promise<{
        ok: boolean;
    }>;
    saveProgressWithBrowseHistory(userId: number, episodeId: number, stopAtSecond: number, req?: any): Promise<{
        ok: boolean;
    }>;
    getProgress(userId: number, episodeId: number): Promise<{
        stopAtSecond: number;
    }>;
    getUserSeriesProgress(userId: number, seriesId: number): Promise<{
        currentEpisode: number;
        currentEpisodeShortId: string;
        watchProgress: number;
        watchPercentage: number;
        totalWatchTime: number;
        lastWatchTime: string;
        isCompleted: boolean;
    } | null>;
    private clearProgressRelatedCache;
    private formatDateTime;
}

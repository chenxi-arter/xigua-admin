import { Repository } from 'typeorm';
import { WatchProgress } from '../entity/watch-progress.entity';
import { Episode } from '../entity/episode.entity';
import { WatchLog } from '../entity/watch-log.entity';
import { DauService } from '../../admin/services/dau.service';
export declare class WatchProgressService {
    private readonly watchProgressRepo;
    private readonly episodeRepo;
    private readonly watchLogRepo;
    private readonly dauService;
    constructor(watchProgressRepo: Repository<WatchProgress>, episodeRepo: Repository<Episode>, watchLogRepo: Repository<WatchLog>, dauService: DauService);
    updateWatchProgress(userId: number, episodeId: number, stopAtSecond: number): Promise<{
        readonly ok: false;
        readonly reason: "episode_not_found";
    } | {
        readonly ok: true;
        readonly reason?: undefined;
    }>;
    getUserWatchProgress(userId: number, episodeId?: number): Promise<{
        userId: number;
        episodeId: number;
        stopAtSecond: number;
        updatedAt: Date;
        episode: {
            id: number;
            title: string;
            episodeNumber: number;
            series: {
                id: number;
                title: string;
                coverUrl: string;
            };
        };
    }[]>;
    getRecentWatchedEpisodes(userId: number, limit?: number): Promise<{
        userId: number;
        episodeId: number;
        stopAtSecond: number;
        updatedAt: Date;
        episode: {
            id: number;
            title: string;
            episodeNumber: number;
            series: {
                id: number;
                title: string;
                coverUrl: string;
            };
        };
    }[]>;
    getUserWatchProgressByEpisodeIds(userId: number, episodeIds: number[]): Promise<WatchProgress[]>;
    deleteWatchProgress(userId: number, episodeId: number): Promise<{
        ok: boolean;
    }>;
    clearAllWatchProgress(userId: number): Promise<{
        ok: boolean;
        deletedCount: number;
    }>;
    getEpisodeWatchStats(episodeId: number): Promise<{
        totalWatchers: number;
        completedWatchers: number;
        completionRate: number;
    }>;
}

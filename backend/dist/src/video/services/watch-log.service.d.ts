import { Repository } from 'typeorm';
import { WatchLog } from '../entity/watch-log.entity';
export declare class WatchLogService {
    private readonly watchLogRepo;
    constructor(watchLogRepo: Repository<WatchLog>);
    logWatch(userId: number, episodeId: number, startPosition: number, endPosition: number, watchDate?: Date): Promise<WatchLog>;
    getUserWatchLogs(userId: number, startDate: Date, endDate: Date): Promise<WatchLog[]>;
    getUserDailyWatchDuration(userId: number, date: Date): Promise<number>;
    getEpisodeWatchStats(episodeId: number, startDate: Date, endDate: Date): Promise<{
        totalWatchDuration: number;
        totalWatchers: number;
        avgWatchDuration: number;
    }>;
    getDailyWatchStats(startDate: Date, endDate: Date): Promise<Array<{
        date: string;
        totalWatchDuration: number;
        dau: number;
        avgWatchDuration: number;
    }>>;
    getSeriesWatchStats(seriesId: number, startDate: Date, endDate: Date): Promise<{
        totalWatchDuration: number;
        totalWatchers: number;
        avgWatchDuration: number;
    }>;
}

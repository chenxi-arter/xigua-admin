import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { BrowseHistory } from '../../video/entity/browse-history.entity';
import { Episode } from '../../video/entity/episode.entity';
export declare class AnalyticsService {
    private readonly userRepo;
    private readonly wpRepo;
    private readonly bhRepo;
    private readonly episodeRepo;
    constructor(userRepo: Repository<User>, wpRepo: Repository<WatchProgress>, bhRepo: Repository<BrowseHistory>, episodeRepo: Repository<Episode>);
    getDAU(date?: Date): Promise<number>;
    getWAU(endDate?: Date): Promise<number>;
    getMAU(endDate?: Date): Promise<number>;
    getRetentionRate(retentionDays?: number, cohortDate?: Date): Promise<{
        totalUsers: number;
        retainedUsers: number;
        retentionRate: number;
    }>;
    getRetentionTrend(days?: number, retentionDays?: number): Promise<Array<{
        date: string;
        totalUsers: number;
        retainedUsers: number;
        retentionRate: number;
    }>>;
    getCompletionRate(): Promise<{
        totalWatchRecords: number;
        completedRecords: number;
        completionRate: number;
    }>;
    getAverageWatchDuration(): Promise<{
        averageWatchProgress: number;
        averageWatchPercentage: number;
        totalWatchTime: number;
    }>;
    getRegistrationStats(days?: number): Promise<{
        totalNewUsers: number;
        dailyAverage: number;
        trend: Array<{
            date: string;
            count: number;
        }>;
    }>;
    getActiveUsersStats(): Promise<{
        dau: number;
        wau: number;
        mau: number;
        dau7DayAvg: number;
        sticky: number;
    }>;
    getContentPlayStats(): Promise<{
        totalPlayCount: number;
        uniqueWatchedEpisodes: number;
        averagePlayCountPerEpisode: number;
        top10Episodes: Array<{
            episodeId: number;
            shortId: string;
            title: string;
            playCount: number;
        }>;
    }>;
    getComprehensiveStats(): Promise<{
        activeUsers: {
            dau: number;
            wau: number;
            mau: number;
            dau7DayAvg: number;
            sticky: number;
        };
        retention: {
            day1: {
                totalUsers: number;
                retainedUsers: number;
                retentionRate: number;
            };
            day7: {
                totalUsers: number;
                retainedUsers: number;
                retentionRate: number;
            };
        };
        content: {
            totalPlayCount: number;
            uniqueWatchedEpisodes: number;
            averagePlayCountPerEpisode: number;
        };
        watching: {
            averageWatchProgress: number;
            averageWatchPercentage: number;
            totalWatchTime: number;
            completionRate: number;
        };
        registration: {
            today: number;
            yesterday: number;
            last7Days: number;
            last30Days: number;
        };
    }>;
}

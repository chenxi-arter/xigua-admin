import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { WatchLog } from '../../video/entity/watch-log.entity';
import { BrowseHistory } from '../../video/entity/browse-history.entity';
import { Episode } from '../../video/entity/episode.entity';
export declare class AnalyticsService {
    private readonly userRepo;
    private readonly wpRepo;
    private readonly watchLogRepo;
    private readonly bhRepo;
    private readonly episodeRepo;
    constructor(userRepo: Repository<User>, wpRepo: Repository<WatchProgress>, watchLogRepo: Repository<WatchLog>, bhRepo: Repository<BrowseHistory>, episodeRepo: Repository<Episode>);
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
    getOperationalMetrics(startDate: Date, endDate: Date): Promise<Array<{
        date: string;
        newUsers: number;
        nextDayRetention: number;
        dau: number;
        averageWatchTime: number;
        newUserSource: string;
    }>>;
    getContentMetrics(startDate: Date, endDate: Date, limit?: number): Promise<Array<{
        date: string;
        videoId: string;
        videoTitle: string;
        playCount: number;
        completionRate: number;
        averageWatchTime: number;
        likeCount: number;
        shareCount: number;
        favoriteCount: number;
    }>>;
    getUserSourceStats(startDate: Date, endDate: Date): Promise<Array<{
        promoCode: string;
        totalUsers: number;
        activeUsers: number;
        conversionRate: number;
    }>>;
}

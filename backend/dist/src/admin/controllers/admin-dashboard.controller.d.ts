import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
import { Series } from '../../video/entity/series.entity';
import { Episode } from '../../video/entity/episode.entity';
import { Banner } from '../../video/entity/banner.entity';
import { Comment } from '../../video/entity/comment.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { BrowseHistory } from '../../video/entity/browse-history.entity';
import { AnalyticsService } from '../services/analytics.service';
export declare class AdminDashboardController {
    private readonly userRepo;
    private readonly rtRepo;
    private readonly seriesRepo;
    private readonly episodeRepo;
    private readonly bannerRepo;
    private readonly commentRepo;
    private readonly wpRepo;
    private readonly bhRepo;
    private readonly analyticsService;
    constructor(userRepo: Repository<User>, rtRepo: Repository<RefreshToken>, seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>, bannerRepo: Repository<Banner>, commentRepo: Repository<Comment>, wpRepo: Repository<WatchProgress>, bhRepo: Repository<BrowseHistory>, analyticsService: AnalyticsService);
    overview(from?: string, to?: string): Promise<{
        users: {
            total: number;
            new24h: number;
            activeLogins: number;
            lastLoginAtLatest: Date | null;
        };
        series: {
            total: number;
        };
        episodes: {
            total: number;
        };
        banners: {
            total: number;
        };
        comments: {
            total: number;
            new24h: number;
        };
        plays: {
            totalPlayCount: number;
            last24hVisits: number;
        };
        range: {
            usersInRange: number;
            visitsInRange: number;
            playActiveInRange: number;
        } | undefined;
    }>;
    timeseries(from?: string, to?: string): Promise<{
        series: Record<string, any>[];
    }>;
    private mergeSeries;
    top(metric?: 'series_play' | 'series_visit', limit?: number, from?: string, to?: string): Promise<{
        items: {
            seriesId: number;
            title: string;
            visitCount: number;
        }[];
    } | {
        items: {
            seriesId: number;
            title: string;
            playCount: number;
        }[];
    }>;
    recent(limit?: number): Promise<{
        users: User[];
        series: Series[];
        episodes: Episode[];
        comments: Comment[];
    }>;
    getStats(): Promise<{
        code: number;
        data: {
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
        };
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getActiveUsers(): Promise<{
        code: number;
        data: {
            dau: number;
            wau: number;
            mau: number;
            dau7DayAvg: number;
            sticky: number;
        };
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getRetention(retentionDays?: string, cohortDate?: string): Promise<{
        code: number;
        data: {
            totalUsers: number;
            retainedUsers: number;
            retentionRate: number;
        };
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getRetentionTrend(days?: string, retentionDays?: string): Promise<{
        code: number;
        data: {
            date: string;
            totalUsers: number;
            retainedUsers: number;
            retentionRate: number;
        }[];
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getContentStats(): Promise<{
        code: number;
        data: {
            totalPlayCount: number;
            uniqueWatchedEpisodes: number;
            averagePlayCountPerEpisode: number;
            top10Episodes: Array<{
                episodeId: number;
                shortId: string;
                title: string;
                playCount: number;
            }>;
        };
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getWatchStats(): Promise<{
        code: number;
        data: {
            totalWatchRecords: number;
            completedRecords: number;
            completionRate: number;
            averageWatchProgress: number;
            averageWatchPercentage: number;
            totalWatchTime: number;
        };
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
}

import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
import { Series } from '../../video/entity/series.entity';
import { Episode } from '../../video/entity/episode.entity';
import { Banner } from '../../video/entity/banner.entity';
import { Comment } from '../../video/entity/comment.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { BrowseHistory } from '../../video/entity/browse-history.entity';
export declare class AdminDashboardController {
    private readonly userRepo;
    private readonly rtRepo;
    private readonly seriesRepo;
    private readonly episodeRepo;
    private readonly bannerRepo;
    private readonly commentRepo;
    private readonly wpRepo;
    private readonly bhRepo;
    constructor(userRepo: Repository<User>, rtRepo: Repository<RefreshToken>, seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>, bannerRepo: Repository<Banner>, commentRepo: Repository<Comment>, wpRepo: Repository<WatchProgress>, bhRepo: Repository<BrowseHistory>);
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
        range: any;
    }>;
    timeseries(from?: string, to?: string, granularity?: 'day' | 'week'): Promise<any>;
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
}

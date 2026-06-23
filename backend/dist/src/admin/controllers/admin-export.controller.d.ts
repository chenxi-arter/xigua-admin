import { Repository } from 'typeorm';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { WatchLog } from '../../video/entity/watch-log.entity';
import { User } from '../../user/entity/user.entity';
import { EpisodeReaction } from '../../video/entity/episode-reaction.entity';
import { Favorite } from '../../user/entity/favorite.entity';
import { Episode } from '../../video/entity/episode.entity';
import { Series } from '../../video/entity/series.entity';
import { Comment } from '../../video/entity/comment.entity';
import { UserOnlineDaily } from '../../user/entity/user-online-daily.entity';
import { ExportSeriesDetailsDto, SeriesDetailData } from '../dto/export-series-details.dto';
import { WatchLogService } from '../../video/services/watch-log.service';
import { AnalyticsService } from '../services/analytics.service';
export declare class AdminExportController {
    private readonly wpRepo;
    private readonly watchLogRepo;
    private readonly userRepo;
    private readonly reactionRepo;
    private readonly favoriteRepo;
    private readonly episodeRepo;
    private readonly seriesRepo;
    private readonly commentRepo;
    private readonly onlineDailyRepo;
    private readonly watchLogService;
    private readonly analyticsService;
    constructor(wpRepo: Repository<WatchProgress>, watchLogRepo: Repository<WatchLog>, userRepo: Repository<User>, reactionRepo: Repository<EpisodeReaction>, favoriteRepo: Repository<Favorite>, episodeRepo: Repository<Episode>, seriesRepo: Repository<Series>, commentRepo: Repository<Comment>, onlineDailyRepo: Repository<UserOnlineDaily>, watchLogService: WatchLogService, analyticsService: AnalyticsService);
    getPlayStats(startDate: string, endDate: string): Promise<{
        code: number;
        data: any[];
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getUserStats(startDate: string, endDate: string): Promise<{
        code: number;
        data: any[];
        message: string;
        timestamp: string;
    } | {
        code: number;
        data: null;
        message: string;
        timestamp: string;
    }>;
    getSeriesDetails(query: ExportSeriesDetailsDto): Promise<{
        code: number;
        message: string;
        timestamp: string;
        data: SeriesDetailData[];
    }>;
    getOverviewStats(startDate: string, endDate: string): Promise<{
        code: number;
        data: {
            date: string;
            new_users: number;
            content_active_users: number;
            watch_progress_updates: number;
            total_users: number;
            new_user_ratio: number;
            next_day_content_retention: number | null;
            avg_session_duration: number;
            avg_daily_duration: number | null;
            avg_daily_watch_sessions: number | null;
        }[];
        message?: undefined;
    } | {
        code: number;
        data: null;
        message: string;
    }>;
    private formatDate;
}

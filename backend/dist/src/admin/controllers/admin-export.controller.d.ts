import { Repository } from 'typeorm';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { User } from '../../user/entity/user.entity';
import { EpisodeReaction } from '../../video/entity/episode-reaction.entity';
import { Favorite } from '../../user/entity/favorite.entity';
import { Episode } from '../../video/entity/episode.entity';
import { Series } from '../../video/entity/series.entity';
import { Comment } from '../../video/entity/comment.entity';
import { ExportSeriesDetailsDto, SeriesDetailData } from '../dto/export-series-details.dto';
export declare class AdminExportController {
    private readonly wpRepo;
    private readonly userRepo;
    private readonly reactionRepo;
    private readonly favoriteRepo;
    private readonly episodeRepo;
    private readonly seriesRepo;
    private readonly commentRepo;
    constructor(wpRepo: Repository<WatchProgress>, userRepo: Repository<User>, reactionRepo: Repository<EpisodeReaction>, favoriteRepo: Repository<Favorite>, episodeRepo: Repository<Episode>, seriesRepo: Repository<Series>, commentRepo: Repository<Comment>);
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
    private formatDate;
}

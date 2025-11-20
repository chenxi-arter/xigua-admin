import { Repository } from 'typeorm';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
import { User } from '../../user/entity/user.entity';
import { EpisodeReaction } from '../../video/entity/episode-reaction.entity';
import { Favorite } from '../../user/entity/favorite.entity';
import { Comment } from '../../video/entity/comment.entity';
export declare class ExportOptimizationService {
    private readonly wpRepo;
    private readonly userRepo;
    private readonly reactionRepo;
    private readonly favoriteRepo;
    private readonly commentRepo;
    constructor(wpRepo: Repository<WatchProgress>, userRepo: Repository<User>, reactionRepo: Repository<EpisodeReaction>, favoriteRepo: Repository<Favorite>, commentRepo: Repository<Comment>);
    getPlayStatsOptimized(startDate: string, endDate: string): Promise<any>;
    getUserStatsOptimized(startDate: string, endDate: string): Promise<any>;
    getSeriesDetailsOptimized(startDate: string, endDate: string, categoryId?: number, limit?: number): Promise<any>;
    private formatDate;
}

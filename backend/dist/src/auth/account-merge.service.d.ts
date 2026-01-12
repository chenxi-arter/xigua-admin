import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { WatchProgress } from '../video/entity/watch-progress.entity';
import { Favorite } from '../user/entity/favorite.entity';
import { EpisodeReaction } from '../video/entity/episode-reaction.entity';
import { Comment } from '../video/entity/comment.entity';
import { CommentLike } from '../video/entity/comment-like.entity';
import { RefreshToken } from './entity/refresh-token.entity';
export declare class AccountMergeService {
    private readonly userRepo;
    private readonly watchProgressRepo;
    private readonly favoriteRepo;
    private readonly episodeReactionRepo;
    private readonly commentRepo;
    private readonly commentLikeRepo;
    private readonly refreshTokenRepo;
    private readonly dataSource;
    private readonly logger;
    constructor(userRepo: Repository<User>, watchProgressRepo: Repository<WatchProgress>, favoriteRepo: Repository<Favorite>, episodeReactionRepo: Repository<EpisodeReaction>, commentRepo: Repository<Comment>, commentLikeRepo: Repository<CommentLike>, refreshTokenRepo: Repository<RefreshToken>, dataSource: DataSource);
    mergeGuestToUser(guestUserId: number, targetUserId: number): Promise<{
        watchProgress: number;
        favorites: number;
        episodeReactions: number;
        comments: number;
        commentLikes: number;
    }>;
    canMergeAccount(guestUserId: number): Promise<boolean>;
}

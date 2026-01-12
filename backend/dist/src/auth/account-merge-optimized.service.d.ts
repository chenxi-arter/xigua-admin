import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';
export declare class AccountMergeOptimizedService {
    private readonly userRepo;
    private readonly dataSource;
    private readonly logger;
    constructor(userRepo: Repository<User>, dataSource: DataSource);
    mergeGuestToUser(guestUserId: number, targetUserId: number): Promise<{
        watchProgress: number;
        favorites: number;
        episodeReactions: number;
        comments: number;
        commentLikes: number;
        deletedDuplicates: number;
        duration: number;
    }>;
    canMergeAccount(guestUserId: number): Promise<boolean>;
    getMergePreview(guestUserId: number): Promise<{
        watchProgress: any;
        favorites: any;
        episodeReactions: any;
        comments: any;
        commentLikes: any;
        total: any;
    }>;
}

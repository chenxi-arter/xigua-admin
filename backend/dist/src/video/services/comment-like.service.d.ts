import { Repository } from 'typeorm';
import { CommentLike } from '../entity/comment-like.entity';
import { Comment } from '../entity/comment.entity';
export declare class CommentLikeService {
    private readonly commentLikeRepo;
    private readonly commentRepo;
    constructor(commentLikeRepo: Repository<CommentLike>, commentRepo: Repository<Comment>);
    likeComment(userId: number, commentId: number): Promise<{
        success: boolean;
        message: string;
        likeCount: number;
    }>;
    unlikeComment(userId: number, commentId: number): Promise<{
        success: boolean;
        message: string;
        likeCount: number;
    }>;
    hasLiked(userId: number, commentId: number): Promise<boolean>;
    batchCheckLiked(userId: number, commentIds: number[]): Promise<Map<number, boolean>>;
    getLikeUsers(commentId: number, page?: number, size?: number): Promise<{
        users: {
            userId: number;
            username: string;
            nickname: string;
            photoUrl: string | null;
            likedAt: Date;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
}

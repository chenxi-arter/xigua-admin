import { Repository } from 'typeorm';
import { CommentLike } from '../entity/comment-like.entity';
import { Comment } from '../entity/comment.entity';
export declare class CommentLikeService {
    private readonly commentLikeRepo;
    private readonly commentRepo;
    private static getPhotoUrl;
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
            photoUrl: string;
            likedAt: Date;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getUserUnreadLikes(userId: number, page?: number, size?: number): Promise<{
        list: {
            id: number;
            likedAt: Date;
            isRead: boolean;
            likerUserId: number;
            likerUsername: string | null;
            likerNickname: string | null;
            likerPhotoUrl: string;
            commentId: number | null;
            commentContent: string | null;
            episodeShortId: string | null;
            episodeNumber: any;
            episodeTitle: any;
            seriesShortId: any;
            seriesTitle: any;
            seriesCoverUrl: any;
        }[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        totalPages: number;
    }>;
    markLikesAsRead(userId: number, likeIds?: number[]): Promise<{
        ok: boolean;
        affected: number;
    }>;
    getUnreadLikeCount(userId: number): Promise<number>;
}

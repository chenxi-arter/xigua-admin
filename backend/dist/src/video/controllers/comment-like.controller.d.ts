import { BaseController } from './base.controller';
import { CommentLikeService } from '../services/comment-like.service';
export declare class CommentLikeController extends BaseController {
    private readonly commentLikeService;
    constructor(commentLikeService: CommentLikeService);
    toggleLike(req: any, commentId: number, action?: 'like' | 'unlike'): Promise<void | import("./base.controller").ApiResponse<any>>;
    getLikeUsers(commentId: number, page?: number, size?: number): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
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
    }>>;
    getMyUnreadLikes(req: any, page?: string, size?: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        list: {
            id: number;
            likedAt: Date;
            isRead: boolean;
            likerUserId: number;
            likerUsername: string | null;
            likerNickname: string | null;
            likerPhotoUrl: string | null;
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
    }>>;
    markLikesAsRead(req: any, likeIds?: number[]): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        ok: boolean;
        affected: number;
    }>>;
    getUnreadLikeCount(req: any): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        count: number;
    }>>;
}

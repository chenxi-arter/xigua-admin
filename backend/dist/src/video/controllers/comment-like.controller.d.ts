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
}

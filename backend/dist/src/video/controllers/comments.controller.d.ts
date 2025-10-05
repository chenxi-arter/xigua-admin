import { BaseController } from './base.controller';
import { VideoService } from '../video.service';
import { CommentService } from '../services/comment.service';
export declare class CommentsController extends BaseController {
    private readonly videoService;
    private readonly commentService;
    constructor(videoService: VideoService, commentService: CommentService);
    listByEpisodeShortId(episodeShortId?: string, page?: string, size?: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        comments: {
            id: number;
            content: string;
            appearSecond: number;
            replyCount: number;
            createdAt: Date;
            username: string | null;
            nickname: string | null;
            photoUrl: string | null;
            recentReplies: {
                id: number;
                content: string;
                floorNumber: number;
                createdAt: Date;
                username: string | null;
                nickname: string | null;
            }[];
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>>;
}

import { BaseController } from './base.controller';
import { VideoService } from '../video.service';
import { CommentService } from '../services/comment.service';
export declare class CommentsController extends BaseController {
    private readonly videoService;
    private readonly commentService;
    constructor(videoService: VideoService, commentService: CommentService);
    listByEpisodeShortId(req: any, episodeShortId?: string, page?: string, size?: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        comments: (Record<string, any> | {
            id: number;
            content: string;
            appearSecond: number;
            replyCount: number;
            createdAt: Date;
            username: string;
            nickname: string;
            photoUrl: string;
            recentReplies: never[];
            isFake: boolean;
        })[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
        fakeCount: number;
    }>>;
}

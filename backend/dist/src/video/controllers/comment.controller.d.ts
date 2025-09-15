import { VideoService } from '../video.service';
import { BaseController } from './base.controller';
export declare class CommentController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
    addComment(req: any, episodeIdentifier: string | number, content: string, appearSecond?: number): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<import("../entity/comment.entity").Comment>>;
}

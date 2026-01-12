import { VideoService } from '../video.service';
import { BaseController } from './base.controller';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
export declare class CommentController extends BaseController {
    private readonly videoService;
    private readonly userRepo;
    constructor(videoService: VideoService, userRepo: Repository<User>);
    addComment(req: any, episodeIdentifier: string | number, content: string, appearSecond?: number): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<import("../entity/comment.entity").Comment>>;
}

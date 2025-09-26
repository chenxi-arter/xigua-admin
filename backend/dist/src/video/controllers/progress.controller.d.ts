import { VideoService } from '../video.service';
import { BaseController } from './base.controller';
export declare class ProgressController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
    saveProgress(req: any, episodeIdentifier: string | number, stopAtSecond: number): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        readonly ok: false;
        readonly reason: "episode_not_found";
    } | {
        readonly ok: true;
        readonly reason?: undefined;
    }>>;
    getProgress(req: any, episodeIdentifier: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        stopAtSecond: number;
    }>>;
}

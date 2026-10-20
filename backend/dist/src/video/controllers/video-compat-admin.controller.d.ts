import { VideoService } from '../video.service';
import { BaseController } from './base.controller';
export declare class VideoCompatAdminController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
    private validateHttpsUrl;
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        code: number;
        data: {
            id: number;
            episodeId: number;
            quality: string;
            accessKey: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
        };
        msg: string;
    }>>;
}

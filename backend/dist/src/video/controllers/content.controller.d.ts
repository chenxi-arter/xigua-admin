import { VideoService } from '../video.service';
import { MediaQueryDto } from '../dto/media-query.dto';
import { EpisodeListDto } from '../dto/episode-list.dto';
import { BaseController } from './base.controller';
export declare class ContentController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
    listMediaUser(req: any, dto: MediaQueryDto): Promise<void | import("./base.controller").ApiResponse<{
        code: number;
        data: {
            list: {
                id: number;
                shortId: string;
                title: string;
                description: string;
                coverUrl: string;
                type: string;
                categoryId: number;
                episodeCount: number;
                status: string;
                score: number;
                playCount: number;
                starring: string;
                director: string;
                createdAt: string;
            }[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
        msg: null;
    }>>;
    getEpisodeList(dto: EpisodeListDto, req: any): Promise<void | import("./base.controller").ApiResponse<import("../dto/episode-list.dto").EpisodeListResponse>>;
}

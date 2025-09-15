import { VideoService } from './video.service';
import { MediaQueryDto } from './dto/media-query.dto';
import { EpisodeListDto } from './dto/episode-list.dto';
export declare class PublicVideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    listSeriesFull(dto: MediaQueryDto): Promise<{}>;
    listSeriesByCategory(categoryId: number): Promise<{}>;
    getSeriesDetail(id: number): Promise<{}>;
    listMedia(dto: MediaQueryDto): Promise<{
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
    }>;
    getPublicEpisodeList(dto: EpisodeListDto): Promise<import("./dto/episode-list.dto").EpisodeListResponse>;
}

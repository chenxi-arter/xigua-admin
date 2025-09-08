import { VideoService } from './video.service';
import { MediaQueryDto } from './dto/media-query.dto';
import { EpisodeListDto } from './dto/episode-list.dto';
export declare class PublicVideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    listSeriesFull(dto: MediaQueryDto): Promise<{
        list: {
            id: number;
            title: string;
            description: string;
            coverUrl: string;
            totalEpisodes: number;
            categoryName: string;
            createdAt: Date;
            episodes: {
                id: number;
                episodeNumber: number;
                title: string;
                duration: number;
                status: string;
            }[];
        }[];
        total: number;
        page: number;
        size: number;
    }>;
    listSeriesByCategory(categoryId: number): Promise<{}>;
    getSeriesDetail(id: number): Promise<{} | null>;
    listMedia(dto: MediaQueryDto): Promise<[import("./entity/short-video.entity").ShortVideo[], number] | {
        list: {
            id: number;
            title: string;
            coverUrl: string;
            totalEpisodes: number;
            categoryName: string;
            latestEpisode: number;
        }[];
        total: number;
        page: number;
        size: number;
    }>;
    getPublicEpisodeList(dto: EpisodeListDto): Promise<import("./dto/episode-list.dto").EpisodeListResponse>;
}

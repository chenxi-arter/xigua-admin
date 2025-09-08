import { VideoService } from './video.service';
import { MediaQueryDto } from './dto/media-query.dto';
import { EpisodeListDto } from './dto/episode-list.dto';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    saveProgress(req: any, episodeIdentifier: string | number, stopAtSecond: number): Promise<{
        ok: boolean;
    }>;
    getProgress(req: any, episodeIdentifier: string): Promise<{
        stopAtSecond: number;
    }>;
    addComment(req: any, episodeIdentifier: string | number, content: string, appearSecond?: number): Promise<import("./entity/comment.entity").Comment>;
    listMediaUser(req: any, dto: MediaQueryDto): Promise<[import("./entity/short-video.entity").ShortVideo[], number] | {
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
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<import("./entity/episode-url.entity").EpisodeUrl>;
    getEpisodeUrlByAccessKey(accessKey: string): Promise<{
        accessKeySource: string;
        episodeId: number;
        episodeShortId: string;
        episodeTitle: string;
        seriesId: number;
        seriesShortId: string;
        urls: {
            id: number;
            quality: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
            accessKey: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    postEpisodeUrlByKey(body: any): Promise<{
        accessKeySource: string;
        episodeId: number;
        episodeShortId: string;
        episodeTitle: string;
        seriesId: number;
        seriesShortId: string;
        urls: {
            id: number;
            quality: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
            accessKey: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<{
        ok: boolean;
    }>;
    generateAccessKeysForExisting(): Promise<{
        updatedUrlKeys: number;
        updatedEpisodeKeys: number;
    }>;
    getEpisodeList(dto: EpisodeListDto, req: any): Promise<import("./dto/episode-list.dto").EpisodeListResponse>;
}

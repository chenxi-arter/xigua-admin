import { VideoService } from './video.service';
import { MediaQueryDto } from './dto/media-query.dto';
import { EpisodeListDto } from './dto/episode-list.dto';
import { BaseController } from './controllers/base.controller';
export declare class VideoController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
    saveProgress(req: any, episodeIdentifier: string | number, stopAtSecond: number): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
        ok: boolean;
    }>>;
    getProgress(req: any, episodeIdentifier: string): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
        stopAtSecond: number;
    }>>;
    addComment(req: any, episodeIdentifier: string | number, content: string, appearSecond?: number): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<import("./entity/comment.entity").Comment>>;
    listMediaUser(req: any, dto: MediaQueryDto): Promise<void | import("./controllers/base.controller").ApiResponse<{
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
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
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
    getEpisodeUrlByAccessKey(accessKey: string): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
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
        accessKeySource: string;
    }>>;
    postEpisodeUrlByKey(body: any): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
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
        accessKeySource: string;
    }>>;
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<void | import("./controllers/base.controller").ApiResponse<null> | import("./controllers/base.controller").ApiResponse<{
        code: number;
        data: {
            episodeId: number;
            hasSequel: boolean;
        };
        msg: string;
    }>>;
    generateAccessKeysForExisting(): Promise<void | import("./controllers/base.controller").ApiResponse<{
        code: number;
        data: {
            updatedCount: number;
            message: string;
        };
        msg: string;
    }>>;
    getEpisodeList(dto: EpisodeListDto, req: any): Promise<void | import("./dto/episode-list.dto").EpisodeListResponse>;
}

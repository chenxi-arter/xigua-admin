import { VideoService } from '../video.service';
import { BaseController } from './base.controller';
export declare class UrlController extends BaseController {
    private readonly videoService;
    constructor(videoService: VideoService);
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
    getEpisodeUrlByAccessKey(accessKey: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
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
    getEpisodeUrlByKey(body: any): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
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
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        code: number;
        data: {
            episodeId: number;
            hasSequel: boolean;
        };
        msg: string;
    }>>;
    generateAccessKeysForExisting(): Promise<void | import("./base.controller").ApiResponse<{
        code: number;
        data: {
            updatedCount: number;
            message: string;
        };
        msg: string;
    }>>;
}

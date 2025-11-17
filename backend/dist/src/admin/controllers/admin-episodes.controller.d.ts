import { Repository } from 'typeorm';
import { Episode } from '../../video/entity/episode.entity';
import { EpisodeUrl } from '../../video/entity/episode-url.entity';
import { R2StorageService } from '../../core/storage/r2-storage.service';
import { EpisodeService } from '../../video/services/episode.service';
import { GetVideoPresignedUrlDto, VideoUploadCompleteDto } from '../dto/presigned-upload.dto';
export declare class AdminEpisodesController {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly storage;
    private readonly episodeService;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, storage: R2StorageService, episodeService: EpisodeService);
    private normalize;
    list(page?: number, size?: number, seriesId?: string, minDuration?: string, maxDuration?: string): Promise<{
        total: number;
        items: {
            seriesTitle: string;
            id: number;
            shortId: string;
            accessKey: string;
            seriesId: number;
            episodeNumber: number;
            title: string;
            duration: number;
            status: string;
            isVertical: boolean;
            series: import("../../video/entity/series.entity").Series;
            urls: EpisodeUrl[];
            watchProgresses: import("../../video/entity/watch-progress.entity").WatchProgress[];
            playCount: number;
            likeCount: number;
            dislikeCount: number;
            favoriteCount: number;
            createdAt: Date;
            updatedAt: Date;
            hasSequel: boolean;
        }[];
        page: number;
        size: number;
    }>;
    create(body: Partial<Episode>): Promise<Episode>;
    getDownloadUrls(id: string): Promise<{
        success: boolean;
        message: string;
        episodeId?: undefined;
        episodeShortId?: undefined;
        episodeTitle?: undefined;
        episodeNumber?: undefined;
        seriesId?: undefined;
        seriesTitle?: undefined;
        duration?: undefined;
        downloadUrls?: undefined;
    } | {
        success: boolean;
        episodeId: number;
        episodeShortId: string;
        episodeTitle: string;
        episodeNumber: number;
        seriesId: number;
        seriesTitle: string;
        duration: number;
        downloadUrls: {
            id: number;
            quality: string;
            cdnUrl: string;
            ossUrl: string;
            originUrl: string;
            subtitleUrl: string | null;
            accessKey: string;
        }[];
        message?: undefined;
    }>;
    getPresignedUploadUrl(id: string, query: GetVideoPresignedUrlDto): Promise<{
        uploadUrl: string;
        fileKey: string;
        publicUrl: string;
        quality: string;
    }>;
    uploadComplete(id: string, body: VideoUploadCompleteDto): Promise<{
        success: boolean;
        message: string;
        publicUrl: string;
        quality: string | undefined;
        fileSize: number | undefined;
    }>;
    update(id: string, body: Partial<Episode>): Promise<Episode | null>;
    remove(id: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    get(id: string): Promise<Episode>;
}

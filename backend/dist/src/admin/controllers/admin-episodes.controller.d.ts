import { Repository } from 'typeorm';
import { Episode } from '../../video/entity/episode.entity';
import { EpisodeUrl } from '../../video/entity/episode-url.entity';
export declare class AdminEpisodesController {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>);
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
    get(id: string): Promise<Episode | null>;
    create(body: Partial<Episode>): Promise<Episode>;
    update(id: string, body: Partial<Episode>): Promise<Episode | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
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
}

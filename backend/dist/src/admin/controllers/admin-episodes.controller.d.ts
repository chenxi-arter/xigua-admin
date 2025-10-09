import { Repository } from 'typeorm';
import { Episode } from '../../video/entity/episode.entity';
import { EpisodeUrl } from '../../video/entity/episode-url.entity';
export declare class AdminEpisodesController {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>);
    private normalize;
    list(page?: number, size?: number, seriesId?: string): Promise<{
        total: number;
        items: Episode[];
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

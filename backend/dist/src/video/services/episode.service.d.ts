import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
export declare class EpisodeService {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly cacheManager;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, cacheManager: Cache);
    private buildEpisodeUrlResponseByEpisodeId;
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<EpisodeUrl>;
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
    getEpisodeUrlByEpisodeKey(accessKey: string): Promise<{
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
    getEpisodeUrlByUrlKey(accessKey: string): Promise<{
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
    getEpisodeById(episodeId: number): Promise<Episode | null>;
    getEpisodeByShortId(episodeShortId: string): Promise<Episode | null>;
    getEpisodeUrls(episodeId: number): Promise<EpisodeUrl[]>;
    incrementPlayCount(episodeId: number): Promise<{
        ok: boolean;
    }>;
    deleteEpisodeUrl(urlId: number): Promise<{
        ok: boolean;
    }>;
    deleteEpisode(episodeId: number): Promise<{
        ok: boolean;
        message: string;
    }>;
    private clearEpisodeCache;
    private clearAllCache;
}

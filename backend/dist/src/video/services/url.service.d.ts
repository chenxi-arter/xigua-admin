import { Cache } from 'cache-manager';
import { PlayCountService } from './play-count.service';
import { Repository } from 'typeorm';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
import { Series } from '../entity/series.entity';
export declare class UrlService {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly seriesRepo;
    private readonly cacheManager;
    private readonly playCountService;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, seriesRepo: Repository<Series>, cacheManager: Cache, playCountService: PlayCountService);
    private incrementSeriesPlayCount;
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<{
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
    }>;
    getEpisodeUrlByAccessKey(accessKey: string): Promise<{
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
    }>;
    getEpisodeUrlByKey(prefix: string, key: string): Promise<{
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
    }>;
    generateAccessKeysForExisting(): Promise<{
        code: number;
        data: {
            updatedCount: number;
            message: string;
        };
        msg: string;
    }>;
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<{
        code: number;
        data: {
            episodeId: number;
            hasSequel: boolean;
        };
        msg: string;
    }>;
}

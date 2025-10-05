import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
import { RecommendEpisodeItem } from '../dto/recommend.dto';
export declare class RecommendService {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly cacheManager;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, cacheManager: Cache);
    getRecommendList(page?: number, size?: number): Promise<{
        list: RecommendEpisodeItem[];
        page: number;
        size: number;
        hasMore: boolean;
    }>;
}

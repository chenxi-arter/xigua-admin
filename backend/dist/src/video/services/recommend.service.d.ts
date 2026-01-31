import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
import { Comment } from '../entity/comment.entity';
import { Series } from '../entity/series.entity';
import { RecommendEpisodeItem } from '../dto/recommend.dto';
import { EpisodeInteractionService } from './episode-interaction.service';
import { FavoriteService } from '../../user/services/favorite.service';
import { CommentService } from './comment.service';
export declare class RecommendService {
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly commentRepo;
    private readonly seriesRepo;
    private readonly cacheManager;
    private readonly episodeInteractionService;
    private readonly favoriteService;
    private readonly commentService;
    constructor(episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, commentRepo: Repository<Comment>, seriesRepo: Repository<Series>, cacheManager: Cache, episodeInteractionService: EpisodeInteractionService, favoriteService: FavoriteService, commentService: CommentService);
    getRecommendList(page?: number, size?: number, userId?: number): Promise<{
        list: RecommendEpisodeItem[];
        page: number;
        size: number;
        hasMore: boolean;
    }>;
    private getSeriesTagsBatch;
}

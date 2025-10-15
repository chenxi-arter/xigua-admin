import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Series } from '../entity/series.entity';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
import { Category } from '../entity/category.entity';
import { WatchProgressService } from './watch-progress.service';
import { EpisodeInteractionService } from './episode-interaction.service';
import { FavoriteService } from '../../user/services/favorite.service';
import { EpisodeListResponse } from '../dto/episode-list.dto';
export declare class ContentService {
    private readonly seriesRepo;
    private readonly episodeRepo;
    private readonly episodeUrlRepo;
    private readonly categoryRepo;
    private readonly watchProgressService;
    private readonly episodeInteractionService;
    private readonly favoriteService;
    private readonly cacheManager;
    constructor(seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>, episodeUrlRepo: Repository<EpisodeUrl>, categoryRepo: Repository<Category>, watchProgressService: WatchProgressService, episodeInteractionService: EpisodeInteractionService, favoriteService: FavoriteService, cacheManager: Cache);
    getEpisodeList(seriesIdentifier?: string, isShortId?: boolean, page?: number, size?: number, userId?: number): Promise<EpisodeListResponse>;
    getEpisodeByShortId(shortId: string): Promise<Episode | null>;
    getSeriesDetail(id: number): Promise<{}>;
    private getSeriesTags;
    private clearProgressRelatedCache;
    private getUserSeriesProgress;
    private formatDateTime;
}

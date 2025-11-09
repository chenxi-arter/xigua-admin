import { FavoriteService } from '../services/favorite.service';
import { Repository } from 'typeorm';
import { Episode } from '../../video/entity/episode.entity';
import { CategoryValidator } from '../../common/validators/category-validator';
export declare class FavoriteController {
    private readonly favoriteService;
    private readonly episodeRepo;
    private readonly categoryValidator;
    constructor(favoriteService: FavoriteService, episodeRepo: Repository<Episode>, categoryValidator: CategoryValidator);
    getFavorites(req: any, page?: string, size?: string, categoryId?: string): Promise<{
        code: number;
        message: string;
        data: null;
    } | {
        code: number;
        message: string;
        data: {
            list: {
                seriesId: number;
                seriesShortId: string;
                seriesTitle: string;
                seriesCoverUrl: string;
                categoryName: string;
                description: string;
                score: string;
                playCount: number;
                totalEpisodeCount: number;
                favoritedEpisodeCount: number;
                upCount: number;
                isCompleted: boolean;
                favoriteTime: string;
            }[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
    }>;
    removeFavorite(req: any, body: {
        shortId: string;
    }): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
            removed: boolean;
            shortId: string;
            seriesId: number;
            favoriteType: string;
        };
    }>;
    getFavoriteStats(req: any): Promise<{
        code: number;
        message: string;
        data: {
            total: number;
            seriesCount: number;
            episodeCount: number;
        };
    }>;
}

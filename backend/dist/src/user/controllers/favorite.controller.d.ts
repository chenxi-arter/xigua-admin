import { FavoriteService } from '../services/favorite.service';
import { Repository } from 'typeorm';
import { Episode } from '../../video/entity/episode.entity';
export declare class FavoriteController {
    private readonly favoriteService;
    private readonly episodeRepo;
    constructor(favoriteService: FavoriteService, episodeRepo: Repository<Episode>);
    getFavorites(req: any, page?: string, size?: string): Promise<{
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
            total: any;
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
            episodeId: number;
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

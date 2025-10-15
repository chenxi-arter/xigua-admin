import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity';
export declare class FavoriteService {
    private readonly favoriteRepo;
    constructor(favoriteRepo: Repository<Favorite>);
    addFavorite(userId: number, seriesId: number, episodeId?: number): Promise<Favorite>;
    removeFavorite(userId: number, seriesId: number, episodeId?: number): Promise<boolean>;
    isFavorited(userId: number, seriesId: number, episodeId?: number): Promise<boolean>;
    getUserFavoritedSeries(userId: number): Promise<Set<number>>;
    getUserFavoritedEpisodes(userId: number, episodeIds: number[], seriesIds: number[]): Promise<Set<number>>;
    getUserFavorites(userId: number, page?: number, size?: number): Promise<{
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
    }>;
    getUserFavoriteStats(userId: number): Promise<{
        total: number;
        seriesCount: number;
        episodeCount: number;
    }>;
}

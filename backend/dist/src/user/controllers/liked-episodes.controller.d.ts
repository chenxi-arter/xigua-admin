import { LikedEpisodesService } from '../services/liked-episodes.service';
import { CategoryValidator } from '../../common/validators/category-validator';
export declare class LikedEpisodesController {
    private readonly likedEpisodesService;
    private readonly categoryValidator;
    constructor(likedEpisodesService: LikedEpisodesService, categoryValidator: CategoryValidator);
    getLikedEpisodes(req: any, page?: string, size?: string, categoryId?: string): Promise<{
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
                likedEpisodeCount: number;
                upCount: number;
                isCompleted: boolean;
                likeTime: string;
            }[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
    }>;
    getLikedStats(req: any): Promise<{
        code: number;
        message: string;
        data: {
            totalLikedEpisodes: number;
            likedSeriesCount: number;
        };
    }>;
}

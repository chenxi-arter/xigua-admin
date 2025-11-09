import { Repository } from 'typeorm';
import { EpisodeReaction } from '../../video/entity/episode-reaction.entity';
export declare class LikedEpisodesService {
    private readonly reactionRepo;
    constructor(reactionRepo: Repository<EpisodeReaction>);
    getUserLikedEpisodes(userId: number, page?: number, size?: number, categoryId?: number): Promise<{
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
    }>;
    getUserLikedStats(userId: number): Promise<{
        totalLikedEpisodes: number;
        likedSeriesCount: number;
    }>;
}

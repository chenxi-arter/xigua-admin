import { Repository } from 'typeorm';
import { WatchProgress } from '../entity/watch-progress.entity';
import { Episode } from '../entity/episode.entity';
import { Series } from '../entity/series.entity';
import { BaseController } from './base.controller';
interface RequestWithUser {
    user?: {
        userId?: number;
    };
}
export declare class CompatBrowseHistoryController extends BaseController {
    private readonly watchProgressRepo;
    private readonly episodeRepo;
    private readonly seriesRepo;
    constructor(watchProgressRepo: Repository<WatchProgress>, episodeRepo: Repository<Episode>, seriesRepo: Repository<Series>);
    getUserBrowseHistory(req: RequestWithUser, page?: string, size?: string): Promise<import("./base.controller").ApiResponse<{
        list: {
            id: number;
            seriesId: number;
            seriesTitle: string;
            seriesShortId: string;
            seriesCoverUrl: string;
            categoryName: string;
            browseType: string;
            browseTypeDesc: string;
            lastEpisodeNumber: number;
            lastEpisodeTitle: string | null;
            visitCount: number;
            durationSeconds: number;
            lastVisitTime: string;
            watchStatus: string;
        }[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>>;
}
export {};

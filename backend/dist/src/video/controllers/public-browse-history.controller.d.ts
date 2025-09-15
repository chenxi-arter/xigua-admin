import { BrowseHistoryService } from '../services/browse-history.service';
import { BaseController } from './base.controller';
export declare class PublicBrowseHistoryController extends BaseController {
    private readonly browseHistoryService;
    constructor(browseHistoryService: BrowseHistoryService);
    getPopularBrowseHistory(limit?: string, categoryId?: string): Promise<void | import("./base.controller").ApiResponse<{
        list: never[];
        total: number;
        message: string;
    }>>;
    getBrowseHistoryStats(): Promise<void | import("./base.controller").ApiResponse<{
        totalViews: number;
        activeUsers: number;
        popularCategories: never[];
        message: string;
    }>>;
    getRecommendations(limit?: string): Promise<void | import("./base.controller").ApiResponse<{
        list: never[];
        total: number;
        message: string;
    }>>;
}

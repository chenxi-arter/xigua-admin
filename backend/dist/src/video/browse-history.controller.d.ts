import { BrowseHistoryService } from './services/browse-history.service';
import { BrowseHistoryCleanupService } from './services/browse-history-cleanup.service';
import { BaseController } from './controllers/base.controller';
export declare class BrowseHistoryController extends BaseController {
    private readonly browseHistoryService;
    private readonly browseHistoryCleanupService;
    constructor(browseHistoryService: BrowseHistoryService, browseHistoryCleanupService: BrowseHistoryCleanupService);
    getUserBrowseHistory(req: any, page?: string, size?: string): Promise<void | import("./controllers/base.controller").ApiResponse<{
        list: any[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>>;
    getRecentBrowsedSeries(req: any, limit?: string): Promise<void | import("./controllers/base.controller").ApiResponse<any[]>>;
    syncBrowseHistory(req: any, seriesShortId: string, browseType?: string, lastEpisodeNumber?: string): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    deleteBrowseHistory(req: any, seriesId: string): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    deleteAllBrowseHistory(req: any): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    getSystemStats(): Promise<{
        code: number;
        data: {
            totalRecords: number;
            activeUsers: number;
            totalOperations: number;
        };
        msg: null;
    }>;
    cleanupExpiredRecords(): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    manualCleanupExcessRecords(): Promise<{
        code: number;
        msg: string;
        data: {
            processedUsers: number;
            totalCleanedRecords: number;
            duration: number;
        };
    } | {
        code: number;
        msg: string;
        data: null;
    }>;
    getCleanupStats(): Promise<{
        code: number;
        msg: string;
        data: {
            totalUsers: number;
            usersWithExcessRecords: number;
            totalExcessRecords: number;
            maxRecordsPerUser: number;
        };
    } | {
        code: number;
        msg: string;
        data: null;
    }>;
}

import { BrowseHistoryService } from './services/browse-history.service';
export declare class BrowseHistoryController {
    private readonly browseHistoryService;
    constructor(browseHistoryService: BrowseHistoryService);
    getUserBrowseHistory(req: any, page?: string, size?: string): Promise<{
        list: any[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>;
    getRecentBrowsedSeries(req: any, limit?: string): Promise<{
        code: number;
        data: any[];
        msg: null;
    }>;
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
}

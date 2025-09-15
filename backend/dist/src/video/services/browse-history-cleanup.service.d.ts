import { Repository } from 'typeorm';
import { BrowseHistory } from '../entity/browse-history.entity';
export declare class BrowseHistoryCleanupService {
    private readonly browseHistoryRepo;
    private readonly logger;
    private readonly MAX_RECORDS_PER_USER;
    constructor(browseHistoryRepo: Repository<BrowseHistory>);
    cleanupExcessBrowseHistory(): Promise<void>;
    private getUsersWithBrowseHistory;
    private cleanupUserBrowseHistory;
    manualCleanup(): Promise<{
        processedUsers: number;
        totalCleanedRecords: number;
        duration: number;
    }>;
    getCleanupStats(): Promise<{
        totalUsers: number;
        usersWithExcessRecords: number;
        totalExcessRecords: number;
        maxRecordsPerUser: number;
    }>;
}

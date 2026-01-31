import { Repository } from 'typeorm';
import { WatchLog } from '../entity/watch-log.entity';
export declare class WatchLogsCleanupService {
    private readonly watchLogRepo;
    private readonly logger;
    constructor(watchLogRepo: Repository<WatchLog>);
    scheduledArchiveOldLogs(): Promise<void>;
    archiveOldLogs(daysToKeep?: number, archiveBeforeDelete?: boolean): Promise<{
        archivedCount: number;
        deletedCount: number;
        duration: number;
    }>;
    private createArchiveTableIfNotExists;
    getCleanupStats(): Promise<{
        totalLogs: number;
        logsOlderThan1Year: number;
        logsOlderThan6Months: number;
        logsOlderThan3Months: number;
        oldestLogDate: Date | null;
        newestLogDate: Date | null;
    }>;
    manualArchive(daysToKeep?: number, archiveBeforeDelete?: boolean): Promise<{
        success: boolean;
        message: string;
        archivedCount: number;
        deletedCount: number;
        duration: number;
    }>;
}

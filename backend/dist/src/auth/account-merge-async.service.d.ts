import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';
interface MergeStatus {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    guestUserId: number;
    targetUserId: number;
    progress?: number;
    stats?: any;
    error?: string;
    startTime?: Date;
    endTime?: Date;
}
export declare class AccountMergeAsyncService {
    private readonly userRepo;
    private readonly dataSource;
    private readonly logger;
    private mergeJobs;
    constructor(userRepo: Repository<User>, dataSource: DataSource);
    queueMerge(guestUserId: number, targetUserId: number): {
        jobId: string;
        message: string;
    };
    private executeMergeInBackground;
    private performMerge;
    getMergeStatus(jobId: string): MergeStatus | null;
    getUserMergeJobs(userId: number): MergeStatus[];
    cleanupCompletedJobs(olderThanHours?: number): void;
}
export {};

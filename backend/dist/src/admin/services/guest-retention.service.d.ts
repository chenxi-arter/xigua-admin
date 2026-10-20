import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { User } from '../../user/entity/user.entity';
export declare const DEFAULT_INACTIVE_MONTHS = 3;
export declare const MIN_INACTIVE_MONTHS = 2;
export declare const MAX_INACTIVE_MONTHS = 60;
export declare const DEFAULT_BATCH_SIZE = 200;
export declare const DEFAULT_MAX_PER_RUN = 5000;
export interface GuestPurgeOptions {
    inactiveMonths?: number;
    batchSize?: number;
    maxPerRun?: number;
    dryRun?: boolean;
}
export interface GuestPurgeImpact {
    comments: number;
    commentLikesGiven: number;
    commentLikesReceived: number;
    repliesToUserComments: number;
    watchProgress: number;
    watchLogs: number;
    browseHistory: number;
    favorites: number;
    episodeReactions: number;
    refreshTokens: number;
    onlineDaily: number;
    advertisingEvents: number;
    advertisingConversions: number;
}
export interface GuestPurgePreview {
    dryRun: true;
    inactiveMonths: number;
    minInactiveMonths: number;
    affectsRecent35Days: boolean;
    cutoff: string;
    totalUsers: number;
    sample: Array<{
        id: number;
        nickname: string | null;
        username: string | null;
        createdAt: Date;
        lastOnlineDate: string | null;
        lastWatchAt: Date | null;
    }>;
    impact: GuestPurgeImpact;
}
export interface GuestPurgeResult {
    dryRun: boolean;
    inactiveMonths: number;
    cutoff: string;
    deletedUsers: number;
    batches: number;
    affected: GuestPurgeImpact;
    truncated: boolean;
    durationMs: number;
}
export declare function isGuestPurgeResult(value: GuestPurgeResult | GuestPurgePreview): value is GuestPurgeResult;
export declare class GuestRetentionService {
    private readonly userRepo;
    private readonly redisClient;
    private readonly logger;
    constructor(userRepo: Repository<User>, redisClient: RedisClientType | null);
    scheduledPurge(): Promise<void>;
    preview(options?: GuestPurgeOptions): Promise<GuestPurgePreview>;
    purge(options?: GuestPurgeOptions): Promise<GuestPurgeResult | GuestPurgePreview>;
    private deleteBatch;
    private buildCandidateWhere;
    private countImpact;
    private clearOnlineCache;
    private emptyImpact;
    private addImpact;
    private normalizeMonths;
    private resolveCutoff;
    private toBeijingDateOnly;
    private readPositiveNumber;
}

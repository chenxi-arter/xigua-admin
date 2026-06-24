import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { User } from '../../user/entity/user.entity';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
import { WatchLog } from '../../video/entity/watch-log.entity';
import { UserOnlineDaily } from '../../user/entity/user-online-daily.entity';
export declare class AdminUsersController {
    private readonly userRepo;
    private readonly refreshTokenRepo;
    private readonly watchLogRepo;
    private readonly onlineDailyRepo;
    private readonly redisClient;
    constructor(userRepo: Repository<User>, refreshTokenRepo: Repository<RefreshToken>, watchLogRepo: Repository<WatchLog>, onlineDailyRepo: Repository<UserOnlineDaily>, redisClient: RedisClientType | null);
    list(page?: number, size?: number, startDate?: string, endDate?: string, loginCount?: string, minLoginCount?: string, maxLoginCount?: string, watchDurationRange?: string, minWatchMinutes?: string, maxWatchMinutes?: string, onlineDurationRange?: string, minOnlineMinutes?: string, maxOnlineMinutes?: string): Promise<{
        total: number;
        items: {
            loginCount: number;
            lastLoginAt: Date | null;
            lastLoginIp: string | null;
            lastLoginDevice: string | null;
            activeLogins: number;
            totalOnlineDuration: number;
            totalOnlineMinutes: number;
            totalWatchDuration: number;
            totalWatchMinutes: number;
            lastActiveAt: Date | null;
            isOnline: boolean;
            id: number;
            email: string;
            telegram_id: number;
            shortId: string;
            first_name: string;
            last_name: string;
            username: string;
            nickname: string;
            photo_url: string | null;
            is_active: boolean;
            isGuest: boolean;
            created_at: Date;
        }[];
        page: number;
        size: number;
    }>;
    get(id: string, startDate?: string, endDate?: string): Promise<any>;
    loginLogs(id: string, page?: number, size?: number): Promise<{
        total: number;
        items: RefreshToken[];
        page: number;
        size: number;
        userSummary: {
            userId: number;
            totalOnlineDuration: number;
            isOnline: boolean;
            lastActiveAt: string | null;
        };
    }>;
    create(body: Partial<User>): Promise<User>;
    update(id: string, body: Partial<User>): Promise<User | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    onlineDaily(id: string, startDate?: string, endDate?: string): Promise<{
        userId: number;
        startDate: string;
        endDate: string;
        totalOnlineDuration: number;
        totalWatchDuration: number;
        days: {
            date: string;
            onlineDuration: number;
            watchDuration: number;
            onlineHours: number;
            onlineMinutes: number;
            watchHours: number;
            watchMinutes: number;
        }[];
    }>;
    private getOnlineDailyStats;
    private toSafeUser;
    private parseDateBoundary;
    private parseOptionalNumber;
    private parseDurationRange;
    private toExclusiveDateOnlyBoundary;
    private clearUserOnlineCache;
    private formatDateOnly;
}

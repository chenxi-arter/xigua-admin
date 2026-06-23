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
    list(page?: number, size?: number): Promise<{
        total: number;
        items: any[];
        page: number;
        size: number;
    }>;
    get(id: string): Promise<any>;
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
        totalDuration: number;
        days: {
            date: string;
            duration: number;
            hours: number;
            minutes: number;
        }[];
    }>;
}

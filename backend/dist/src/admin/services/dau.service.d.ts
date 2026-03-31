import { RedisClientType } from 'redis';
export declare class DauService {
    private readonly redisClient;
    private readonly logger;
    private readonly KEY_TTL_SECONDS;
    constructor(redisClient: RedisClientType | null);
    trackUser(userId: number, date?: Date): Promise<void>;
    getDAU(dateStr?: string): Promise<number | null>;
    getDAUBatch(dates: string[]): Promise<Map<string, number | null>>;
    buildKey(date: Date): string;
}

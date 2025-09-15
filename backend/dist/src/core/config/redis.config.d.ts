export declare class RedisConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    db?: number;
    ttl?: number;
    max?: number;
    connectTimeout?: number;
    lazyConnect?: number;
    retryAttempts?: number;
    retryDelay?: number;
    enableReadyCheck?: boolean;
    maxRetriesPerRequest?: number;
    getRedisConfig(): any;
    getCacheConfig(): any;
}

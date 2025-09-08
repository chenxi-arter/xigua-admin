export declare class RedisConfig {
    host: string;
    port: number;
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
    getRedisConfig(): {
        host: string;
        port: number;
        password: string | undefined;
        db: number | undefined;
        connectTimeout: number | undefined;
        lazyConnect: number | undefined;
        retryAttempts: number | undefined;
        retryDelayOnFailover: number | undefined;
        enableReadyCheck: boolean | undefined;
        maxRetriesPerRequest: number | undefined;
    };
    getCacheConfig(): {
        store: string;
        host: string;
        port: number;
        password: string | undefined;
        db: number | undefined;
        ttl: number | undefined;
        max: number | undefined;
    };
}

export declare class DebugUtil {
    private static readonly isDebugEnabled;
    private static readonly debugCacheEnabled;
    private static readonly debugDatabaseEnabled;
    private static readonly debugServiceEnabled;
    static log(message: string, data?: any): void;
    static cache(message: string, cacheKey?: string): void;
    static database(message: string, query?: string): void;
    static service(serviceName: string, method: string, message: string, data?: any): void;
    static error(message: string, error?: Error): void;
    static performance(operation: string, startTime: number): void;
    static getConfig(): {
        enabled: boolean;
        cache: boolean;
        database: boolean;
        service: boolean;
    };
}

import { Cache } from 'cache-manager';
export declare class CacheMonitorController {
    private readonly cacheManager;
    constructor(cacheManager: Cache);
    getCacheStats(): Promise<{
        code: number;
        data: {
            message: string;
            note: string;
            cacheType: string;
            status: string;
        };
        msg: null;
    } | {
        code: number;
        data: null;
        msg: string;
    }>;
    clearCacheByPattern(pattern: string): Promise<{
        code: number;
        data: {
            message: string;
            note: string;
            pattern: string;
        };
        msg: null;
    } | {
        code: number;
        data: null;
        msg: string;
    }>;
    clearAllCache(): Promise<{
        code: number;
        data: {
            message: string;
            timestamp: string;
        };
        msg: null;
    } | {
        code: number;
        data: null;
        msg: string;
    }>;
    getCacheKeys(pattern?: string): Promise<{
        code: number;
        data: {
            message: string;
            note: string;
            pattern: string;
            keys: never[];
        };
        msg: null;
    } | {
        code: number;
        data: null;
        msg: string;
    }>;
    warmupCache(): Promise<{
        code: number;
        data: {
            message: string;
            timestamp: string;
            tasks: number;
        };
        msg: null;
    } | {
        code: number;
        data: null;
        msg: string;
    }>;
    private warmupCategories;
    private warmupHomeData;
    private warmupPopularSeries;
}

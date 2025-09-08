export declare class CacheConfig {
    static readonly TTL: {
        SHORT: number;
        MEDIUM: number;
        LONG: number;
        EXTENDED: number;
        PERMANENT: number;
    };
    static readonly PREFIX: {
        EPISODE_LIST: string;
        EPISODE_DETAIL: string;
        SERIES_DETAIL: string;
        SERIES_BY_CATEGORY: string;
        HOME_VIDEOS: string;
        CATEGORIES: string;
        FILTER_TAGS: string;
        FILTER_DATA: string;
        FUZZY_SEARCH: string;
        BANNERS: string;
    };
    static readonly STRATEGY: {
        EPISODE_LIST: {
            PUBLIC: number;
            USER: number;
        };
        SERIES_DETAIL: {
            TTL: number;
        };
        HOME_VIDEOS: {
            TTL: number;
        };
        CATEGORIES: {
            TTL: number;
        };
        FILTER_DATA: {
            TTL: number;
        };
    };
    static generateKey(prefix: string, ...params: (string | number)[]): string;
    static episodeListKey(seriesIdentifier: string | undefined, isShortId: boolean, page: number, size: number, userId?: number): string;
    static seriesDetailKey(seriesId: number): string;
    static seriesByCategoryKey(categoryId: number): string;
    static homeVideosKey(channeid?: number, page?: number): string;
    static categoriesKey(): string;
    static getTTL(type: keyof typeof CacheConfig.STRATEGY, subType?: string): number;
}

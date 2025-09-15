export declare class CacheKeys {
    private static readonly PREFIX;
    static readonly TTL: {
        SHORT: number;
        MEDIUM: number;
        LONG: number;
        VERY_LONG: number;
    };
    static homeVideos(categoryId: number, page: number): string;
    static filterData(channelId: string, ids: string, page: string): string;
    static filterTags(channelId: string): string;
    static videoDetails(videoId: string | number): string;
    static categories(): string;
    static tags(): string;
    static seriesDetail(seriesId: number): string;
    static episodeList(seriesIdentifier: string, idType: string, page: number, size: number, userId?: number): string;
    static seriesList(categoryId?: number, page?: number, size?: number): string;
    static seriesByCategory(categoryId: number): string;
    static moduleVideos(moduleType: string, categoryId: number, page: number): string;
    static topSeries(limit: number): string;
    static getPatternKeys(pattern: string): string[];
    static getAllPatterns(): string[];
    static getKeyPattern(pattern: string): string;
    static getAllHomeVideosPattern(): string;
    static getAllFilterPattern(): string;
    static getAllVideoDetailsPattern(): string;
    static getAllCategoriesPattern(): string;
    static getAllTagsPattern(): string;
    static getAllSeriesPattern(): string;
    static withTimestamp(key: string): string;
    static userRelated(userId: number, key: string): string;
    static temporary(key: string): string;
}

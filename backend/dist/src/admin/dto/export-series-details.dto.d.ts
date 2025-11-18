export declare class ExportSeriesDetailsDto {
    startDate: string;
    endDate: string;
    categoryId?: number;
}
export interface SeriesDetailData {
    date: string;
    seriesId: number;
    seriesTitle: string;
    categoryName: string;
    episodeCount: number;
    playCount: number;
    completionRate: number;
    avgWatchDuration: number;
    likeCount: number;
    dislikeCount: number;
    shareCount: number;
    favoriteCount: number;
    commentCount: number;
}

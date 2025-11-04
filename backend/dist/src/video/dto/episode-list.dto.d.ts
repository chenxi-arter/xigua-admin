export declare class EpisodeListDto {
    seriesShortId?: string;
    seriesId?: string;
    page?: string;
    size?: string;
}
export interface EpisodeBasicInfo {
    id: number;
    shortId: string;
    episodeNumber: number;
    episodeTitle: string;
    title: string;
    duration: number;
    status: string;
    isVertical: boolean;
    createdAt: string;
    updatedAt: string;
    seriesId: number;
    seriesTitle: string;
    seriesShortId: string;
    score?: number;
    episodeAccessKey?: string;
    likeCount?: number;
    dislikeCount?: number;
    favoriteCount?: number;
    commentCount?: number;
    watchProgress?: number;
    watchPercentage?: number;
    isWatched?: boolean;
    lastWatchTime?: string;
    urls?: EpisodeUrlInfo[];
    tags?: string[];
}
export interface EpisodeUrlInfo {
    quality: string;
    accessKey: string;
    cdnUrl?: string;
    ossUrl?: string;
    subtitleUrl?: string | null;
}
export interface UserWatchProgress {
    currentEpisode: number;
    currentEpisodeShortId: string;
    watchProgress: number;
    watchPercentage: number;
    totalWatchTime: number;
    lastWatchTime: string;
    isCompleted: boolean;
}
export interface SeriesBasicInfo {
    starring: string;
    id: number;
    channeName: string;
    channeID: number;
    title: string;
    coverUrl: string;
    mediaUrl: string;
    fileName: string;
    mediaId: string;
    postTime: string;
    contentType: string;
    actor: string;
    shareCount: number;
    director: string;
    description: string;
    comments: number;
    updateStatus: string;
    watch_progress: number;
    playCount: number;
    isHot: boolean;
    isVip: boolean;
    tags?: string[];
}
export interface EpisodeListResponse {
    code: number;
    data: {
        seriesInfo?: SeriesBasicInfo | null;
        userProgress?: UserWatchProgress | null;
        list: EpisodeBasicInfo[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        tags?: string[];
        currentEpisode?: string;
    };
    msg: string | null;
}

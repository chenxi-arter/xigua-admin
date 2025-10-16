export declare class RecommendQueryDto {
    page?: string;
    size?: string;
}
export interface RecommendEpisodeItem {
    shortId: string;
    episodeNumber: number;
    episodeTitle: string;
    title: string;
    duration: number;
    status: string;
    isVertical: boolean;
    createdAt: string;
    seriesShortId: string;
    seriesTitle: string;
    seriesCoverUrl: string;
    seriesDescription: string;
    seriesScore: string;
    seriesStarring: string;
    seriesActor: string;
    updateStatus: string;
    playCount: number;
    likeCount: number;
    dislikeCount: number;
    favoriteCount: number;
    commentCount: number;
    episodeAccessKey: string;
    urls: {
        quality: string;
        accessKey: string;
    }[];
    topComments: {
        id: number;
        shortId: string;
        content: string;
        username: string;
        avatar: string;
        createdAt: string;
        likeCount: number;
    }[];
    userInteraction?: {
        liked: boolean;
        disliked: boolean;
        favorited: boolean;
    };
    recommendScore?: number;
}
export interface RecommendResponse {
    code: number;
    data: {
        list: RecommendEpisodeItem[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    };
    msg: string | null;
}

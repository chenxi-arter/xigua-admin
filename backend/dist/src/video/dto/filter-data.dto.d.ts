export declare class FilterDataDto {
    channeid: string;
    ids?: string;
    page?: string;
}
export interface FilterDataItem {
    id: number;
    shortId: string;
    coverUrl: string;
    title: string;
    score: string;
    playCount: number;
    url: string;
    type: string;
    isSerial: boolean;
    upStatus: string;
    upCount: number;
    likeCount?: number;
    dislikeCount?: number;
    favoriteCount?: number;
    author: string;
    description: string;
    cidMapper: string;
    isRecommend: boolean;
    createdAt: string;
}
export interface FilterDataResponse {
    code: number;
    data: {
        list: FilterDataItem[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    };
    msg: string | null;
}

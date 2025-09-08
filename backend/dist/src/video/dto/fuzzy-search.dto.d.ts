export declare class FuzzySearchDto {
    keyword: string;
    channeid?: string;
    page?: number;
    size?: number;
}
export interface FuzzySearchItem {
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
    author: string;
    description: string;
    cidMapper: string;
    isRecommend: boolean;
    createdAt: string;
    channeid: number;
}
export interface FuzzySearchResponse {
    code: number;
    data: {
        list: FuzzySearchItem[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    };
    msg: string | null;
}

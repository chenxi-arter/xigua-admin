export declare class HomeVideosDto {
    channeid?: number;
    page?: number;
}
export interface BannerItem {
    showURL: string;
    title: string;
    id: number;
    shortId: string | null;
    channeID: number;
    url: string;
    isAd: boolean;
}
export interface FilterItem {
    channeID: number;
    name: string;
    title: string;
    ids: string;
}
export interface VideoItem {
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
}
export interface ContentBlock {
    type: number;
    name: string;
    filters?: FilterItem[];
    banners?: BannerItem[];
    list?: VideoItem[];
}
export interface HomeVideosResponse {
    data: {
        list: ContentBlock[];
    };
    code: number;
    msg: string | null;
}

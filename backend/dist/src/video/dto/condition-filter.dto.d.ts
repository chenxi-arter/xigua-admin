export declare class ConditionFilterDto {
    titleid?: string;
    ids?: string;
    page?: number;
    size?: number;
    System?: string;
    AppVersion?: string;
    SystemVersion?: string;
    version?: string;
    DeviceId?: string;
    i18n?: number;
    pub?: string;
    vv?: string;
}
export interface ConditionFilterItem {
    id: number;
    shortId?: string;
    coverUrl: string;
    title: string;
    description?: string;
    score: string;
    playCount: number;
    totalEpisodes?: number;
    isSerial: boolean;
    upStatus: string;
    upCount: number;
    status?: string;
    starring?: string;
    actor?: string;
    director?: string;
    region?: string;
    language?: string;
    releaseDate?: string;
    isCompleted?: boolean;
    cidMapper: string;
    categoryName?: string;
    isRecommend: boolean;
    duration?: string;
    createdAt?: string;
    updateTime?: string;
    episodeCount?: number;
    tags?: string[];
}
export interface ConditionFilterResponse {
    code: number;
    data: {
        list: ConditionFilterItem[];
        total?: number;
        page?: number;
        size?: number;
        hasMore?: boolean;
    };
    msg: string | null;
}

export declare class VideoChooseGatherDto {
    mediaKey?: string;
    System?: string;
    AppVersion?: string;
    SystemVersion?: string;
    version?: string;
    DeviceId?: string;
    i18n?: string;
    pub?: string;
    vv?: string;
}
export interface VideoChooseGatherResponse {
    code: number;
    msg: string | null;
    data: {
        videoInfo: {
            id: number;
            title: string;
            coverUrl: string;
            description: string;
            score: string;
            playCount: number;
            totalEpisodes: number;
            upStatus: string;
            upCount: number;
            starring: string;
            director: string;
            region: string;
            language: string;
            category: string;
        };
        episodes: Array<{
            episodeId: number;
            episodeNumber: number;
            title: string;
            episodeTitle: string;
            duration: number;
            isVip: boolean;
            isLocked: boolean;
            isCurrent: boolean;
            playCount: number;
            hasSequel: boolean;
            mediaKey: string;
            accessKey: string;
        }>;
        currentEpisode: {
            episodeId: number;
            episodeNumber: number;
            title: string;
            mediaKey: string;
            accessKey: string;
        };
        relatedVideos: Array<{
            id: number;
            title: string;
            coverUrl: string;
            score: string;
            playCount: number;
            category: string;
        }>;
    };
}

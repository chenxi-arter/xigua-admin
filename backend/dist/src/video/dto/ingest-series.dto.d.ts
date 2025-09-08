export declare class EpisodeUrlInputDto {
    quality: string;
    ossUrl?: string;
    cdnUrl: string;
    subtitleUrl?: string;
    originUrl: string;
}
export declare class EpisodeInputDto {
    episodeNumber: number;
    title: string;
    duration: number;
    status: string;
    urls: EpisodeUrlInputDto[];
}
export declare class IngestSeriesDto {
    externalId: string;
    title: string;
    description: string;
    coverUrl: string;
    categoryId: number;
    status: string;
    releaseDate: string;
    score?: number;
    playCount?: number;
    starring?: string;
    actor?: string;
    director?: string;
    regionOptionName: string;
    languageOptionName: string;
    statusOptionName: string;
    yearOptionName: string;
    episodes: EpisodeInputDto[];
}

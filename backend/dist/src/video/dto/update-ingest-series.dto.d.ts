export declare class EpisodeUrlUpdateDto {
    quality: string;
    ossUrl?: string;
    cdnUrl?: string;
    subtitleUrl?: string;
    originUrl: string;
}
export declare class EpisodeUpdateDto {
    episodeNumber: number;
    title?: string;
    duration?: number;
    status?: string;
    urls?: EpisodeUrlUpdateDto[];
}
export declare class UpdateIngestSeriesDto {
    externalId: string;
    title?: string;
    description?: string;
    coverUrl?: string;
    categoryId?: number;
    status?: string;
    releaseDate?: string;
    score?: number;
    playCount?: number;
    starring?: string;
    actor?: string;
    director?: string;
    regionOptionName?: string;
    languageOptionName?: string;
    statusOptionName?: string;
    yearOptionName?: string;
    episodes?: EpisodeUpdateDto[];
    removeMissingEpisodes?: boolean;
    removeMissingUrls?: boolean;
}

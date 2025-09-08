import { Episode } from './episode.entity';
export declare class EpisodeUrl {
    id: number;
    episodeId: number;
    quality: string;
    ossUrl: string;
    cdnUrl: string;
    originUrl: string;
    subtitleUrl: string | null;
    accessKey: string;
    createdAt: Date;
    updatedAt: Date;
    episode: Episode;
    ensureAccessKey(): void;
}

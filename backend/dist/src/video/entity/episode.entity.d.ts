import { Series } from './series.entity';
import { EpisodeUrl } from './episode-url.entity';
import { WatchProgress } from './watch-progress.entity';
import { Comment } from './comment.entity';
export declare class Episode {
    id: number;
    shortId: string;
    accessKey: string;
    seriesId: number;
    episodeNumber: number;
    title: string;
    duration: number;
    status: string;
    series: Series;
    urls: EpisodeUrl[];
    watchProgresses: WatchProgress[];
    comments: Comment[];
    playCount: number;
    createdAt: Date;
    updatedAt: Date;
    hasSequel: boolean;
    generateShortId(): void;
}

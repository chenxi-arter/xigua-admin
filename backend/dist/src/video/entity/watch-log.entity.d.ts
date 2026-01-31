import { User } from '../../user/entity/user.entity';
import { Episode } from './episode.entity';
export declare class WatchLog {
    id: number;
    userId: number;
    episodeId: number;
    watchDuration: number;
    startPosition: number;
    endPosition: number;
    watchDate: Date;
    createdAt: Date;
    user: User;
    episode: Episode;
}

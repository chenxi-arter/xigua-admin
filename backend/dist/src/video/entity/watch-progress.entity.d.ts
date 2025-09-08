import { User } from '../../user/entity/user.entity';
import { Episode } from './episode.entity';
export declare class WatchProgress {
    userId: number;
    episodeId: number;
    stopAtSecond: number;
    updatedAt: Date;
    user: User;
    episode: Episode;
}

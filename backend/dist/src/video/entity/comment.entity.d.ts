import { User } from '../../user/entity/user.entity';
import { Episode } from './episode.entity';
export declare class Comment {
    id: number;
    userId: number;
    episodeId: number;
    content: string;
    appearSecond: number;
    createdAt: Date;
    user: User;
    episode: Episode;
}

import { User } from '../../user/entity/user.entity';
import { Episode } from './episode.entity';
export declare class EpisodeReaction {
    id: number;
    userId: number;
    episodeId: number;
    reactionType: 'like' | 'dislike';
    createdAt: Date;
    updatedAt: Date;
    user: User;
    episode: Episode;
}

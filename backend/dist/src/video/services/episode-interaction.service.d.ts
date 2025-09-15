import { Repository } from 'typeorm';
import { Episode } from '../entity/episode.entity';
export type EpisodeReactionType = 'like' | 'dislike' | 'favorite';
export declare class EpisodeInteractionService {
    private readonly episodeRepo;
    constructor(episodeRepo: Repository<Episode>);
    increment(episodeId: number, type: EpisodeReactionType): Promise<void>;
}

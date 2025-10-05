import { Repository } from 'typeorm';
import { Episode } from '../entity/episode.entity';
import { CommentService } from './comment.service';
export type EpisodeReactionType = 'like' | 'dislike' | 'favorite';
export declare class EpisodeInteractionService {
    private readonly episodeRepo;
    private readonly commentService;
    constructor(episodeRepo: Repository<Episode>, commentService: CommentService);
    increment(episodeId: number, type: EpisodeReactionType): Promise<void>;
    addReply(userId: number, episodeShortId: string, parentId: number, content: string): Promise<{
        id: number;
        parentId: number | undefined;
        rootId: number | undefined;
        floorNumber: number;
        content: string;
        createdAt: Date;
        username: string | null;
        nickname: string | null;
        photoUrl: string | null;
        replyToUsername: string | null;
        replyToNickname: string | null;
    }>;
    getCommentReplies(commentId: number, page: number, size: number): Promise<{
        rootComment: {
            id: number;
            content: string;
            username: string | null;
            nickname: string | null;
            photoUrl: string | null;
            replyCount: number;
            createdAt: Date;
        };
        replies: {
            id: number;
            parentId: number | undefined;
            floorNumber: number;
            content: string;
            createdAt: Date;
            username: string | null;
            nickname: string | null;
            photoUrl: string | null;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
}

import { Repository } from 'typeorm';
import { Episode } from '../entity/episode.entity';
import { EpisodeReaction } from '../entity/episode-reaction.entity';
import { CommentService } from './comment.service';
export type EpisodeReactionType = 'like' | 'dislike' | 'favorite';
export declare class EpisodeInteractionService {
    private readonly episodeRepo;
    private readonly reactionRepo;
    private readonly commentService;
    constructor(episodeRepo: Repository<Episode>, reactionRepo: Repository<EpisodeReaction>, commentService: CommentService);
    recordReaction(userId: number, episodeId: number, type: 'like' | 'dislike'): Promise<{
        changed: boolean;
        previousType?: string;
    }>;
    removeReaction(userId: number, episodeId: number): Promise<boolean>;
    getUserReaction(userId: number, episodeId: number): Promise<'like' | 'dislike' | null>;
    getUserReactions(userId: number, episodeIds: number[]): Promise<Map<number, 'like' | 'dislike'>>;
    increment(episodeId: number, type: EpisodeReactionType): Promise<void>;
    addReply(userId: number, episodeShortId: string, parentId: number, content: string): Promise<{
        id: number;
        parentId: number | undefined;
        rootId: number | undefined;
        floorNumber: number;
        content: string;
        likeCount: number;
        createdAt: Date;
        username: any;
        nickname: any;
        photoUrl: string | null;
        replyToUsername: any;
        replyToNickname: any;
    }>;
    getCommentReplies(commentId: number, page: number, size: number, userId?: number): Promise<{
        rootComment: {
            id: number;
            content: string;
            username: any;
            nickname: any;
            photoUrl: string | null;
            replyCount: number;
            likeCount: number;
            liked: boolean | undefined;
            createdAt: Date;
        };
        replies: {
            id: number;
            parentId: number | undefined;
            floorNumber: number;
            content: string;
            likeCount: number;
            liked: boolean | undefined;
            createdAt: Date;
            username: any;
            nickname: any;
            photoUrl: string | null;
            replyToUserId: number | null;
            replyToUsername: any;
            replyToNickname: any;
            replyToPhotoUrl: any;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getUserReceivedReplies(userId: number, page: number, size: number): Promise<{
        list: {
            id: number;
            content: string;
            createdAt: Date;
            episodeNumber: any;
            episodeTitle: any;
            seriesShortId: any;
            seriesTitle: any;
            seriesCoverUrl: any;
            fromUsername: string | null;
            fromNickname: string | null;
            fromPhotoUrl: string | null;
            myComment: any;
            floorNumber: number;
        }[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        totalPages: number;
    }>;
}

import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Comment } from '../entity/comment.entity';
import { Episode } from '../entity/episode.entity';
export declare class CommentService {
    private readonly commentRepo;
    private readonly episodeRepo;
    private readonly cacheManager;
    constructor(commentRepo: Repository<Comment>, episodeRepo: Repository<Episode>, cacheManager: Cache);
    addComment(userId: number, episodeShortId: string, content: string, appearSecond?: number): Promise<Comment>;
    getCommentsByEpisodeShortId(episodeShortId: string, page?: number, size?: number, replyPreviewCount?: number): Promise<{
        comments: {
            id: number;
            content: string;
            appearSecond: number;
            replyCount: number;
            createdAt: Date;
            username: string | null;
            nickname: string | null;
            photoUrl: string | null;
            recentReplies: {
                id: number;
                content: string;
                floorNumber: number;
                createdAt: Date;
                username: string | null;
                nickname: string | null;
            }[];
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
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
    getCommentReplies(commentId: number, page?: number, size?: number): Promise<{
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
    getDanmuByEpisodeShortId(episodeShortId: string): Promise<Comment[]>;
    deleteComment(commentId: number, userId?: number): Promise<{
        ok: boolean;
    }>;
    getUserComments(userId: number, page?: number, size?: number): Promise<{
        comments: Comment[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getCommentStats(episodeShortId: string): Promise<{
        totalComments: number;
        danmuCount: number;
        regularComments: number;
    }>;
    reportComment(commentId: number, reporterId: number, reason: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    likeComment(commentId: number, userId: number): Promise<{
        ok: boolean;
    }>;
    private clearCommentCache;
}

import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Comment } from '../entity/comment.entity';
import { Episode } from '../entity/episode.entity';
export declare class CommentService {
    private readonly commentRepo;
    private readonly episodeRepo;
    private readonly cacheManager;
    constructor(commentRepo: Repository<Comment>, episodeRepo: Repository<Episode>, cacheManager: Cache);
    addComment(userId: number, episodeId: number, content: string, appearSecond?: number): Promise<Comment>;
    getCommentsByEpisode(episodeId: number, page?: number, size?: number): Promise<{
        comments: Comment[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getDanmuByEpisode(episodeId: number): Promise<Comment[]>;
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
    getCommentStats(episodeId: number): Promise<{
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

import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Comment } from '../entity/comment.entity';
import { Episode } from '../entity/episode.entity';
import { FakeCommentService } from './fake-comment.service';
import { CommentLikeService } from './comment-like.service';
export declare class CommentService {
    private readonly commentRepo;
    private readonly episodeRepo;
    private readonly cacheManager;
    private readonly fakeCommentService;
    private readonly commentLikeService;
    constructor(commentRepo: Repository<Comment>, episodeRepo: Repository<Episode>, cacheManager: Cache, fakeCommentService: FakeCommentService, commentLikeService: CommentLikeService);
    addComment(userId: number, episodeShortId: string, content: string, appearSecond?: number): Promise<Comment>;
    getCommentsByEpisodeShortId(episodeShortId: string, page?: number, size?: number, replyPreviewCount?: number, userId?: number): Promise<{
        comments: (Record<string, any> | {
            id: number;
            content: string;
            appearSecond: number;
            replyCount: number;
            createdAt: Date;
            username: string;
            nickname: string;
            photoUrl: string;
            recentReplies: never[];
            isFake: boolean;
        })[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
        fakeCount: number;
    }>;
    addReply(userId: number, episodeShortId: string, parentId: number, content: string): Promise<{
        id: number;
        parentId: number | undefined;
        rootId: number | undefined;
        floorNumber: number;
        content: string;
        likeCount: number;
        createdAt: Date;
        username: string | null;
        nickname: string | null;
        photoUrl: string | null;
        replyToUsername: string | null;
        replyToNickname: string | null;
    }>;
    getCommentReplies(commentId: number, page?: number, size?: number, userId?: number): Promise<{
        rootComment: {
            id: number;
            content: string;
            username: string | null;
            nickname: string | null;
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
            username: string | null;
            nickname: string | null;
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
    getUserReceivedReplies(userId: number, page?: number, size?: number): Promise<{
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
    getCommentCountsByShortIds(episodeShortIds: string[]): Promise<Map<string, number>>;
    getCommentCountByShortId(episodeShortId: string): Promise<number>;
}

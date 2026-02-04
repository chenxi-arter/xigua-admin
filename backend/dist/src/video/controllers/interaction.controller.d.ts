import { Repository } from 'typeorm';
import { BaseController } from '../controllers/base.controller';
import { EpisodeInteractionService, EpisodeReactionType } from '../services/episode-interaction.service';
import { EpisodeService } from '../services/episode.service';
import { VideoService } from '../video.service';
import { FavoriteService } from '../../user/services/favorite.service';
import { User } from '../../user/entity/user.entity';
declare class EpisodeActivityDto {
    shortId: string;
    type: 'play' | EpisodeReactionType;
}
export declare class InteractionController extends BaseController {
    private readonly interactionService;
    private readonly episodeService;
    private readonly videoService;
    private readonly favoriteService;
    private readonly userRepo;
    constructor(interactionService: EpisodeInteractionService, episodeService: EpisodeService, videoService: VideoService, favoriteService: FavoriteService, userRepo: Repository<User>);
    activity(body: EpisodeActivityDto, req: {
        user?: {
            userId?: number;
        };
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        episodeId: number;
        shortId: string;
        type: string;
    }>>;
    removeReaction(body: {
        shortId: string;
    }, req: {
        user?: {
            userId?: number;
        };
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        episodeId: number;
        shortId: string;
        removed: boolean;
    }>>;
    comment(req: {
        user?: {
            userId?: number;
        };
    }, body: {
        shortId: string;
        content: string;
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<import("../entity/comment.entity").Comment>>;
    replyComment(req: {
        user?: {
            userId?: number;
        };
    }, body: {
        episodeShortId: string;
        parentId: number;
        content: string;
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        id: number;
        parentId: number | undefined;
        rootId: number | undefined;
        floorNumber: number;
        content: string;
        likeCount: number;
        createdAt: Date;
        username: any;
        nickname: any;
        photoUrl: string;
        replyToUsername: any;
        replyToNickname: any;
    }>>;
    getCommentReplies(req: any, commentId: string, page?: string, size?: string): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        rootComment: {
            id: number;
            content: string;
            username: any;
            nickname: any;
            photoUrl: string;
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
            photoUrl: string;
            replyToUserId: number | null;
            replyToUsername: any;
            replyToNickname: any;
            replyToPhotoUrl: any;
        }[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }>>;
    getMyReplies(req: {
        user?: {
            userId?: number;
        };
    }, page?: string, size?: string): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        list: {
            id: number;
            content: string;
            createdAt: Date;
            episodeNumber: any;
            episodeTitle: any;
            seriesShortId: any;
            seriesTitle: any;
            seriesCoverUrl: any;
            fromUserId: number;
            fromUsername: any;
            fromNickname: any;
            fromPhotoUrl: string;
            myComment: any;
            floorNumber: number;
        }[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        totalPages: number;
    }>>;
    getMyUnreadReplies(req: {
        user?: {
            userId?: number;
        };
    }, page?: string, size?: string): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        list: {
            id: number;
            content: string;
            createdAt: Date;
            isRead: boolean;
            episodeNumber: any;
            episodeTitle: any;
            seriesShortId: any;
            seriesTitle: any;
            seriesCoverUrl: any;
            fromUserId: number;
            fromUsername: any;
            fromNickname: any;
            fromPhotoUrl: string;
            myComment: any;
            floorNumber: number;
        }[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        totalPages: number;
    }>>;
    markRepliesAsRead(req: {
        user?: {
            userId?: number;
        };
    }, body: {
        replyIds?: number[];
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        ok: boolean;
        affected: number;
    }>>;
    getUnreadReplyCount(req: {
        user?: {
            userId?: number;
        };
    }): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        count: number;
    }>>;
}
export {};

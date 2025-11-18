import { BaseController } from '../controllers/base.controller';
import { EpisodeInteractionService, EpisodeReactionType } from '../services/episode-interaction.service';
import { EpisodeService } from '../services/episode.service';
import { VideoService } from '../video.service';
import { FavoriteService } from '../../user/services/favorite.service';
declare class EpisodeActivityDto {
    shortId: string;
    type: 'play' | EpisodeReactionType;
}
export declare class InteractionController extends BaseController {
    private readonly interactionService;
    private readonly episodeService;
    private readonly videoService;
    private readonly favoriteService;
    constructor(interactionService: EpisodeInteractionService, episodeService: EpisodeService, videoService: VideoService, favoriteService: FavoriteService);
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
        username: string | null;
        nickname: string | null;
        photoUrl: string | null;
        replyToUsername: string | null;
        replyToNickname: string | null;
    }>>;
    getCommentReplies(commentId: string, page?: string, size?: string): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        rootComment: {
            id: number;
            content: string;
            username: string | null;
            nickname: string | null;
            photoUrl: string | null;
            replyCount: number;
            likeCount: number;
            createdAt: Date;
        };
        replies: {
            id: number;
            parentId: number | undefined;
            floorNumber: number;
            content: string;
            likeCount: number;
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
    }>>;
}
export {};

import { CommentService } from './comment.service';
import { CommentLikeService } from './comment-like.service';
export declare class NotificationService {
    private readonly commentService;
    private readonly commentLikeService;
    constructor(commentService: CommentService, commentLikeService: CommentLikeService);
    getUnreadCounts(userId: number): Promise<{
        replies: number;
        likes: number;
        total: number;
    }>;
    getAllUnreadNotifications(userId: number, page?: number, size?: number): Promise<{
        list: ({
            type: "reply";
            time: number;
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
        } | {
            type: "like";
            time: number;
            id: number;
            likedAt: Date;
            isRead: boolean;
            likerUserId: number;
            likerUsername: string | null;
            likerNickname: string | null;
            likerPhotoUrl: string;
            commentId: number | null;
            commentContent: string | null;
            episodeShortId: string | null;
            episodeNumber: any;
            episodeTitle: any;
            seriesShortId: any;
            seriesTitle: any;
            seriesCoverUrl: any;
        })[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
        totalPages: number;
    }>;
}

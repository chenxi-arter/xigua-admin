import { BaseController } from './base.controller';
import { NotificationService } from '../services/notification.service';
export declare class NotificationController extends BaseController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUnreadCount(req: any): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
        replies: number;
        likes: number;
        total: number;
    }>>;
    getAllUnread(req: any, page?: string, size?: string): Promise<void | import("./base.controller").ApiResponse<null> | import("./base.controller").ApiResponse<{
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
            fromUsername: string | null;
            fromNickname: string | null;
            fromPhotoUrl: string | null;
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
            likerPhotoUrl: string | null;
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
    }>>;
}

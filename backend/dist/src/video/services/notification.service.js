"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const comment_like_service_1 = require("./comment-like.service");
let NotificationService = class NotificationService {
    commentService;
    commentLikeService;
    constructor(commentService, commentLikeService) {
        this.commentService = commentService;
        this.commentLikeService = commentLikeService;
    }
    async getUnreadCounts(userId) {
        const [unreadReplies, unreadLikes] = await Promise.all([
            this.commentService.getUnreadReplyCount(userId),
            this.commentLikeService.getUnreadLikeCount(userId),
        ]);
        return {
            replies: unreadReplies,
            likes: unreadLikes,
            total: unreadReplies + unreadLikes,
        };
    }
    async getAllUnreadNotifications(userId, page = 1, size = 20) {
        const [repliesData, likesData] = await Promise.all([
            this.commentService.getUserUnreadReplies(userId, 1, 100),
            this.commentLikeService.getUserUnreadLikes(userId, 1, 100),
        ]);
        const allNotifications = [
            ...repliesData.list.map(item => ({
                ...item,
                type: 'reply',
                time: new Date(item.createdAt).getTime(),
            })),
            ...likesData.list.map(item => ({
                ...item,
                type: 'like',
                time: new Date(item.likedAt).getTime(),
            })),
        ].sort((a, b) => b.time - a.time);
        const total = allNotifications.length;
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedList = allNotifications.slice(start, end);
        return {
            list: paginatedList,
            total,
            page,
            size,
            hasMore: total > page * size,
            totalPages: Math.ceil(total / size),
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        comment_like_service_1.CommentLikeService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map
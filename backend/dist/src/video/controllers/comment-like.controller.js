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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentLikeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const base_controller_1 = require("./base.controller");
const comment_like_service_1 = require("../services/comment-like.service");
let CommentLikeController = class CommentLikeController extends base_controller_1.BaseController {
    commentLikeService;
    constructor(commentLikeService) {
        super();
        this.commentLikeService = commentLikeService;
    }
    async toggleLike(req, commentId, action) {
        try {
            if (!commentId) {
                return this.error('评论ID不能为空', 400);
            }
            let result;
            if (!action) {
                const hasLiked = await this.commentLikeService.hasLiked(req.user.userId, commentId);
                if (hasLiked) {
                    result = await this.commentLikeService.unlikeComment(req.user.userId, commentId);
                }
                else {
                    result = await this.commentLikeService.likeComment(req.user.userId, commentId);
                }
            }
            else {
                if (action === 'like') {
                    result = await this.commentLikeService.likeComment(req.user.userId, commentId);
                }
                else {
                    result = await this.commentLikeService.unlikeComment(req.user.userId, commentId);
                }
            }
            if (!result.success) {
                return this.success(result, result.message, 200);
            }
            return this.success({
                commentId,
                likeCount: result.likeCount,
                liked: action === 'like' || (!action && result.message.includes('点赞成功')),
            }, result.message, 200);
        }
        catch (error) {
            return this.handleServiceError(error, '操作失败');
        }
    }
    async getLikeUsers(commentId, page, size) {
        try {
            if (!commentId) {
                return this.error('评论ID不能为空', 400);
            }
            const pageNum = Math.max(page || 1, 1);
            const sizeNum = Math.max(size || 20, 1);
            const result = await this.commentLikeService.getLikeUsers(commentId, pageNum, sizeNum);
            return this.success(result, '获取成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取点赞用户列表失败');
        }
    }
    async getMyUnreadLikes(req, page, size) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return this.error('未认证', 401);
            const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
            const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
            const result = await this.commentLikeService.getUserUnreadLikes(userId, pageNum, sizeNum);
            return this.success(result, '获取成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取未读点赞失败');
        }
    }
    async markLikesAsRead(req, likeIds) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return this.error('未认证', 401);
            const result = await this.commentLikeService.markLikesAsRead(userId, likeIds);
            return this.success(result, '已标记为已读', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '标记失败');
        }
    }
    async getUnreadLikeCount(req) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return this.error('未认证', 401);
            const count = await this.commentLikeService.getUnreadLikeCount(userId);
            return this.success({ count }, '获取成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取未读点赞数量失败');
        }
    }
};
exports.CommentLikeController = CommentLikeController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('like'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('commentId')),
    __param(2, (0, common_1.Body)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Post)('like-users'),
    __param(0, (0, common_1.Body)('commentId')),
    __param(1, (0, common_1.Body)('page')),
    __param(2, (0, common_1.Body)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "getLikeUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-unread-likes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "getMyUnreadLikes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('likes/mark-read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('likeIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "markLikesAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('unread-like-count'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "getUnreadLikeCount", null);
exports.CommentLikeController = CommentLikeController = __decorate([
    (0, common_1.Controller)('video/comment'),
    __metadata("design:paramtypes", [comment_like_service_1.CommentLikeService])
], CommentLikeController);
//# sourceMappingURL=comment-like.controller.js.map
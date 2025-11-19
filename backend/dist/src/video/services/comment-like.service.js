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
exports.CommentLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_like_entity_1 = require("../entity/comment-like.entity");
const comment_entity_1 = require("../entity/comment.entity");
let CommentLikeService = class CommentLikeService {
    commentLikeRepo;
    commentRepo;
    constructor(commentLikeRepo, commentRepo) {
        this.commentLikeRepo = commentLikeRepo;
        this.commentRepo = commentRepo;
    }
    async likeComment(userId, commentId) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        const existingLike = await this.commentLikeRepo.findOne({
            where: { userId, commentId },
        });
        if (existingLike) {
            return {
                success: false,
                message: '已经点赞过了',
                likeCount: comment.likeCount,
            };
        }
        const like = this.commentLikeRepo.create({
            userId,
            commentId,
        });
        await this.commentLikeRepo.save(like);
        await this.commentRepo.increment({ id: commentId }, 'likeCount', 1);
        return {
            success: true,
            message: '点赞成功',
            likeCount: comment.likeCount + 1,
        };
    }
    async unlikeComment(userId, commentId) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        const existingLike = await this.commentLikeRepo.findOne({
            where: { userId, commentId },
        });
        if (!existingLike) {
            return {
                success: false,
                message: '还未点赞',
                likeCount: comment.likeCount,
            };
        }
        await this.commentLikeRepo.remove(existingLike);
        if (comment.likeCount > 0) {
            await this.commentRepo.decrement({ id: commentId }, 'likeCount', 1);
        }
        return {
            success: true,
            message: '取消点赞成功',
            likeCount: Math.max(0, comment.likeCount - 1),
        };
    }
    async hasLiked(userId, commentId) {
        const like = await this.commentLikeRepo.findOne({
            where: { userId, commentId },
        });
        return !!like;
    }
    async batchCheckLiked(userId, commentIds) {
        if (commentIds.length === 0) {
            return new Map();
        }
        const likes = await this.commentLikeRepo.find({
            where: {
                userId,
                commentId: commentIds.length === 1 ? commentIds[0] : undefined,
            },
            select: ['commentId'],
        });
        let likedCommentIds;
        if (commentIds.length > 1) {
            const result = await this.commentLikeRepo
                .createQueryBuilder('cl')
                .select('cl.comment_id', 'commentId')
                .where('cl.user_id = :userId', { userId })
                .andWhere('cl.comment_id IN (:...commentIds)', { commentIds })
                .getRawMany();
            likedCommentIds = result.map((r) => r.commentId);
        }
        else {
            likedCommentIds = likes.map((like) => like.commentId);
        }
        const likedSet = new Set(likedCommentIds);
        const result = new Map();
        for (const commentId of commentIds) {
            result.set(commentId, likedSet.has(commentId));
        }
        return result;
    }
    async getLikeUsers(commentId, page = 1, size = 20) {
        const [likes, total] = await this.commentLikeRepo.findAndCount({
            where: { commentId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * size,
            take: size,
        });
        return {
            users: likes.map((like) => ({
                userId: like.userId,
                username: like.user?.username,
                nickname: like.user?.nickname,
                photoUrl: like.user?.photo_url,
                likedAt: like.createdAt,
            })),
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
};
exports.CommentLikeService = CommentLikeService;
exports.CommentLikeService = CommentLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_like_entity_1.CommentLike)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentLikeService);
//# sourceMappingURL=comment-like.service.js.map
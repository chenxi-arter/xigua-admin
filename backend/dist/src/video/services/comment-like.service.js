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
var CommentLikeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_like_entity_1 = require("../entity/comment-like.entity");
const comment_entity_1 = require("../entity/comment.entity");
const default_avatar_util_1 = require("../../common/utils/default-avatar.util");
let CommentLikeService = CommentLikeService_1 = class CommentLikeService {
    commentLikeRepo;
    commentRepo;
    static getPhotoUrl(user) {
        if (!user)
            return default_avatar_util_1.DefaultAvatarUtil.getRandomAvatar();
        if (user.photo_url && String(user.photo_url).trim())
            return user.photo_url.trim();
        if (user.id != null)
            return default_avatar_util_1.DefaultAvatarUtil.getAvatarByUserId(user.id);
        return default_avatar_util_1.DefaultAvatarUtil.getRandomAvatar();
    }
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
                photoUrl: CommentLikeService_1.getPhotoUrl(like.user),
                likedAt: like.createdAt,
            })),
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async getUserUnreadLikes(userId, page = 1, size = 20) {
        const skip = (page - 1) * size;
        const [likes, total] = await this.commentLikeRepo
            .createQueryBuilder('like')
            .leftJoinAndSelect('like.user', 'liker')
            .leftJoinAndSelect('like.comment', 'comment')
            .where('comment.user_id = :userId', { userId })
            .andWhere('like.is_read = :isRead', { isRead: false })
            .orderBy('like.createdAt', 'DESC')
            .skip(skip)
            .take(size)
            .getManyAndCount();
        const episodeShortIds = [...new Set(likes.map(like => like.comment?.episodeShortId).filter(Boolean))];
        const episodeInfoMap = new Map();
        if (episodeShortIds.length > 0) {
            const episodes = await this.commentRepo.manager
                .getRepository('Episode')
                .createQueryBuilder('episode')
                .leftJoinAndSelect('episode.series', 'series')
                .where('episode.shortId IN (:...shortIds)', { shortIds: episodeShortIds })
                .getMany();
            episodes.forEach((episode) => {
                episodeInfoMap.set(episode.shortId, {
                    episodeNumber: episode.episodeNumber,
                    episodeTitle: episode.title,
                    seriesShortId: episode.series?.shortId,
                    seriesTitle: episode.series?.title,
                    seriesCoverUrl: episode.series?.coverUrl,
                });
            });
        }
        const formattedLikes = likes.map((like) => {
            const comment = like.comment;
            const episodeInfo = comment?.episodeShortId ? episodeInfoMap.get(comment.episodeShortId) : null;
            return {
                id: like.id,
                likedAt: like.createdAt,
                isRead: like.isRead,
                likerUserId: like.userId,
                likerUsername: like.user?.nickname || like.user?.username || null,
                likerNickname: like.user?.nickname || null,
                likerPhotoUrl: CommentLikeService_1.getPhotoUrl(like.user),
                commentId: comment?.id || null,
                commentContent: comment?.content || null,
                episodeShortId: comment?.episodeShortId || null,
                episodeNumber: episodeInfo?.episodeNumber || null,
                episodeTitle: episodeInfo?.episodeTitle || null,
                seriesShortId: episodeInfo?.seriesShortId || null,
                seriesTitle: episodeInfo?.seriesTitle || null,
                seriesCoverUrl: episodeInfo?.seriesCoverUrl || null,
            };
        });
        return {
            list: formattedLikes,
            total,
            page,
            size,
            hasMore: total > page * size,
            totalPages: Math.ceil(total / size),
        };
    }
    async markLikesAsRead(userId, likeIds) {
        const userComments = await this.commentRepo.find({
            where: { userId },
            select: ['id'],
        });
        const commentIds = userComments.map(c => c.id);
        if (commentIds.length === 0) {
            return { ok: true, affected: 0 };
        }
        const queryBuilder = this.commentLikeRepo
            .createQueryBuilder()
            .update(comment_like_entity_1.CommentLike)
            .set({ isRead: true })
            .where('commentId IN (:...commentIds)', { commentIds })
            .andWhere('isRead = :isRead', { isRead: false });
        if (likeIds && likeIds.length > 0) {
            queryBuilder.andWhere('id IN (:...likeIds)', { likeIds });
        }
        const result = await queryBuilder.execute();
        return {
            ok: true,
            affected: result.affected || 0,
        };
    }
    async getUnreadLikeCount(userId) {
        return await this.commentLikeRepo
            .createQueryBuilder('like')
            .leftJoin('like.comment', 'comment')
            .where('comment.user_id = :userId', { userId })
            .andWhere('like.is_read = :isRead', { isRead: false })
            .getCount();
    }
};
exports.CommentLikeService = CommentLikeService;
exports.CommentLikeService = CommentLikeService = CommentLikeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_like_entity_1.CommentLike)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentLikeService);
//# sourceMappingURL=comment-like.service.js.map
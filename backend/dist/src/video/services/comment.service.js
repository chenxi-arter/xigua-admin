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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const comment_entity_1 = require("../entity/comment.entity");
const episode_entity_1 = require("../entity/episode.entity");
let CommentService = class CommentService {
    commentRepo;
    episodeRepo;
    cacheManager;
    constructor(commentRepo, episodeRepo, cacheManager) {
        this.commentRepo = commentRepo;
        this.episodeRepo = episodeRepo;
        this.cacheManager = cacheManager;
    }
    async addComment(userId, episodeShortId, content, appearSecond) {
        const comment = this.commentRepo.create({
            userId,
            episodeShortId,
            content,
            appearSecond: appearSecond ?? 0,
        });
        const saved = await this.commentRepo.save(comment);
        await this.clearCommentCache(episodeShortId);
        return saved;
    }
    async getCommentsByEpisodeShortId(episodeShortId, page = 1, size = 20, replyPreviewCount = 2) {
        const skip = (page - 1) * size;
        const [comments, total] = await this.commentRepo.findAndCount({
            where: { episodeShortId, rootId: null },
            order: { createdAt: 'DESC' },
            skip,
            take: size,
            relations: ['user'],
        });
        const formattedComments = await Promise.all(comments.map(async (comment) => {
            const recentReplies = await this.commentRepo.find({
                where: { rootId: comment.id },
                order: { createdAt: 'DESC' },
                take: replyPreviewCount,
                relations: ['user'],
            });
            return {
                id: comment.id,
                content: comment.content,
                appearSecond: comment.appearSecond,
                replyCount: comment.replyCount,
                createdAt: comment.createdAt,
                username: comment.user?.username || null,
                nickname: comment.user?.nickname || null,
                photoUrl: comment.user?.photo_url || null,
                recentReplies: recentReplies.map(reply => ({
                    id: reply.id,
                    content: reply.content,
                    floorNumber: reply.floorNumber,
                    createdAt: reply.createdAt,
                    username: reply.user?.username || null,
                    nickname: reply.user?.nickname || null,
                })),
            };
        }));
        return {
            comments: formattedComments,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async addReply(userId, episodeShortId, parentId, content) {
        const parentComment = await this.commentRepo.findOne({
            where: { id: parentId },
            relations: ['user'],
        });
        if (!parentComment) {
            throw new Error('父评论不存在');
        }
        const rootId = parentComment.rootId || parentComment.id;
        const maxFloor = await this.commentRepo
            .createQueryBuilder('comment')
            .select('MAX(comment.floorNumber)', 'max')
            .where('comment.rootId = :rootId OR comment.id = :rootId', { rootId })
            .getRawOne();
        const floorNumber = (maxFloor?.max || 0) + 1;
        const reply = this.commentRepo.create({
            userId,
            episodeShortId,
            parentId,
            rootId,
            replyToUserId: parentComment.userId,
            floorNumber,
            content,
            appearSecond: 0,
        });
        const saved = await this.commentRepo.save(reply);
        await this.commentRepo.increment({ id: rootId }, 'replyCount', 1);
        await this.clearCommentCache(episodeShortId);
        const savedWithUser = await this.commentRepo.findOne({
            where: { id: saved.id },
            relations: ['user'],
        });
        if (!savedWithUser) {
            throw new Error('保存的评论未找到');
        }
        return {
            id: savedWithUser.id,
            parentId: savedWithUser.parentId,
            rootId: savedWithUser.rootId,
            floorNumber: savedWithUser.floorNumber,
            content: savedWithUser.content,
            createdAt: savedWithUser.createdAt,
            username: savedWithUser.user?.username || null,
            nickname: savedWithUser.user?.nickname || null,
            photoUrl: savedWithUser.user?.photo_url || null,
            replyToUsername: parentComment.user?.username || null,
            replyToNickname: parentComment.user?.nickname || null,
        };
    }
    async getCommentReplies(commentId, page = 1, size = 20) {
        const rootComment = await this.commentRepo.findOne({
            where: { id: commentId },
            relations: ['user'],
        });
        if (!rootComment) {
            throw new Error('评论不存在');
        }
        const skip = (page - 1) * size;
        const [replies, total] = await this.commentRepo.findAndCount({
            where: { rootId: commentId },
            order: { floorNumber: 'ASC' },
            skip,
            take: size,
            relations: ['user'],
        });
        return {
            rootComment: {
                id: rootComment.id,
                content: rootComment.content,
                username: rootComment.user?.username || null,
                nickname: rootComment.user?.nickname || null,
                photoUrl: rootComment.user?.photo_url || null,
                replyCount: rootComment.replyCount,
                createdAt: rootComment.createdAt,
            },
            replies: replies.map(reply => ({
                id: reply.id,
                parentId: reply.parentId,
                floorNumber: reply.floorNumber,
                content: reply.content,
                createdAt: reply.createdAt,
                username: reply.user?.username || null,
                nickname: reply.user?.nickname || null,
                photoUrl: reply.user?.photo_url || null,
            })),
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async getDanmuByEpisodeShortId(episodeShortId) {
        return this.commentRepo.find({
            where: {
                episodeShortId,
                appearSecond: { $gt: 0 },
            },
            order: { appearSecond: 'ASC' },
            relations: ['user'],
        });
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        if (userId && comment.userId !== userId) {
            throw new Error('无权删除此评论');
        }
        await this.commentRepo.remove(comment);
        await this.clearCommentCache(comment.episodeShortId);
        return { ok: true };
    }
    async getUserComments(userId, page = 1, size = 20) {
        const skip = (page - 1) * size;
        const [comments, total] = await this.commentRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip,
            take: size,
            relations: ['episode', 'episode.series'],
        });
        return {
            comments,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async getCommentStats(episodeShortId) {
        const totalComments = await this.commentRepo.count({
            where: { episodeShortId },
        });
        const danmuCount = await this.commentRepo.count({
            where: {
                episodeShortId,
                appearSecond: { $gt: 0 },
            },
        });
        const regularComments = totalComments - danmuCount;
        return {
            totalComments,
            danmuCount,
            regularComments,
        };
    }
    async reportComment(commentId, reporterId, reason) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        return { ok: true, message: '举报已提交' };
    }
    async likeComment(commentId, userId) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        await this.clearCommentCache(comment.episodeShortId);
        return { ok: true };
    }
    async clearCommentCache(episodeShortId) {
        try {
            await this.cacheManager.del(`video_details_${episodeShortId}`);
            await this.cacheManager.del(`comments_${episodeShortId}`);
            await this.cacheManager.del(`danmu_${episodeShortId}`);
        }
        catch (error) {
            console.error('清除评论缓存失败:', error);
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], CommentService);
//# sourceMappingURL=comment.service.js.map
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
const fake_comment_service_1 = require("./fake-comment.service");
let CommentService = class CommentService {
    commentRepo;
    episodeRepo;
    cacheManager;
    fakeCommentService;
    constructor(commentRepo, episodeRepo, cacheManager, fakeCommentService) {
        this.commentRepo = commentRepo;
        this.episodeRepo = episodeRepo;
        this.cacheManager = cacheManager;
        this.fakeCommentService = fakeCommentService;
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
            where: { episodeShortId, rootId: (0, typeorm_2.IsNull)() },
            order: { createdAt: 'DESC' },
            skip,
            take: size,
            relations: ['user'],
        });
        if (comments.length === 0) {
            return this.fakeCommentService.mixComments(episodeShortId, [], 0, page, size);
        }
        const commentIds = comments.map(c => c.id);
        const allReplies = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.rootId IN (:...rootIds)', { rootIds: commentIds })
            .orderBy('comment.rootId', 'ASC')
            .addOrderBy('comment.createdAt', 'DESC')
            .getMany();
        const repliesMap = new Map();
        allReplies.forEach(reply => {
            if (reply.rootId) {
                if (!repliesMap.has(reply.rootId)) {
                    repliesMap.set(reply.rootId, []);
                }
                const replies = repliesMap.get(reply.rootId);
                if (replies.length < replyPreviewCount) {
                    replies.push(reply);
                }
            }
        });
        const formattedComments = comments.map(comment => {
            const recentReplies = repliesMap.get(comment.id) || [];
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
                    photoUrl: reply.user?.photo_url || null,
                })),
            };
        });
        return this.fakeCommentService.mixComments(episodeShortId, formattedComments, total, page, size);
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
        const maxFloorResult = await this.commentRepo
            .createQueryBuilder('comment')
            .select('MAX(comment.floorNumber)', 'max')
            .where('comment.rootId = :rootId OR comment.id = :rootId', { rootId })
            .getRawOne();
        const floorNumber = (parseInt(maxFloorResult?.max || '0', 10)) + 1;
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
                appearSecond: (0, typeorm_2.MoreThan)(0),
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
                appearSecond: (0, typeorm_2.MoreThan)(0),
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
        console.log(`Comment ${commentId} reported by user ${reporterId} for: ${reason}`);
        return { ok: true, message: '举报已提交' };
    }
    async likeComment(commentId, userId) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('评论不存在');
        }
        console.log(`User ${userId} liked comment ${commentId}`);
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
    async getCommentCountsByShortIds(episodeShortIds) {
        const countMap = new Map();
        if (episodeShortIds.length === 0) {
            return countMap;
        }
        const realCommentCounts = await this.commentRepo
            .createQueryBuilder('comment')
            .select('comment.episodeShortId', 'episodeShortId')
            .addSelect('COUNT(*)', 'count')
            .where('comment.episodeShortId IN (:...shortIds)', { shortIds: episodeShortIds })
            .andWhere('comment.rootId IS NULL')
            .groupBy('comment.episodeShortId')
            .getRawMany();
        realCommentCounts.forEach((item) => {
            countMap.set(item.episodeShortId, parseInt(item.count, 10));
        });
        const fakeCountMap = this.fakeCommentService.getFakeCommentCounts(episodeShortIds);
        episodeShortIds.forEach(shortId => {
            const realCount = countMap.get(shortId) || 0;
            const fakeCount = fakeCountMap.get(shortId) || 0;
            countMap.set(shortId, realCount + fakeCount);
        });
        return countMap;
    }
    async getCommentCountByShortId(episodeShortId) {
        const countMap = await this.getCommentCountsByShortIds([episodeShortId]);
        return countMap.get(episodeShortId) || 0;
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, fake_comment_service_1.FakeCommentService])
], CommentService);
//# sourceMappingURL=comment.service.js.map
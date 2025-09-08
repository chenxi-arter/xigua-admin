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
    async addComment(userId, episodeId, content, appearSecond) {
        const comment = this.commentRepo.create({
            userId,
            episodeId,
            content,
            appearSecond: appearSecond ?? 0,
        });
        const saved = await this.commentRepo.save(comment);
        await this.clearCommentCache(episodeId.toString());
        return saved;
    }
    async getCommentsByEpisode(episodeId, page = 1, size = 20) {
        const skip = (page - 1) * size;
        const [comments, total] = await this.commentRepo.findAndCount({
            where: { episodeId },
            order: { createdAt: 'DESC' },
            skip,
            take: size,
            relations: ['user'],
        });
        return {
            comments,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async getDanmuByEpisode(episodeId) {
        return this.commentRepo.find({
            where: {
                episodeId,
                appearSecond: { $gt: 0 },
            },
            order: { appearSecond: 'ASC' },
            relations: ['user'],
        });
    }
    async getDanmuByEpisodeShortId(episodeShortId) {
        const episode = await this.episodeRepo.findOne({
            where: { shortId: episodeShortId }
        });
        if (!episode) {
            throw new Error('剧集不存在');
        }
        return this.getDanmuByEpisode(episode.id);
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
        await this.clearCommentCache(comment.episodeId.toString());
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
    async getCommentStats(episodeId) {
        const totalComments = await this.commentRepo.count({
            where: { episodeId },
        });
        const danmuCount = await this.commentRepo.count({
            where: {
                episodeId,
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
        await this.clearCommentCache(comment.episodeId.toString());
        return { ok: true };
    }
    async clearCommentCache(episodeId) {
        try {
            await this.cacheManager.del(`video_details_${episodeId}`);
            await this.cacheManager.del(`comments_${episodeId}`);
            await this.cacheManager.del(`danmu_${episodeId}`);
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
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
exports.InteractionController = void 0;
const common_1 = require("@nestjs/common");
const base_controller_1 = require("../controllers/base.controller");
const episode_interaction_service_1 = require("../services/episode-interaction.service");
const episode_service_1 = require("../services/episode.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const video_service_1 = require("../video.service");
const favorite_service_1 = require("../../user/services/favorite.service");
class EpisodeActivityDto {
    shortId;
    type;
}
let InteractionController = class InteractionController extends base_controller_1.BaseController {
    interactionService;
    episodeService;
    videoService;
    favoriteService;
    constructor(interactionService, episodeService, videoService, favoriteService) {
        super();
        this.interactionService = interactionService;
        this.episodeService = episodeService;
        this.videoService = videoService;
        this.favoriteService = favoriteService;
    }
    async activity(body, req) {
        const shortId = body?.shortId?.trim();
        if (!shortId)
            throw new common_1.BadRequestException('shortId 必填');
        const episode = await this.episodeService.getEpisodeByShortId(shortId);
        if (!episode)
            return this.error('剧集不存在', 404);
        const type = body?.type;
        if (!type)
            return this.error('type 必填', 400);
        if (type === 'play') {
            await this.episodeService.incrementPlayCount(episode.id);
            return this.success({ episodeId: episode.id, shortId, type: 'play' }, '已更新');
        }
        if (!['like', 'dislike', 'favorite'].includes(type)) {
            return this.error('type 必须是 play|like|dislike|favorite', 400);
        }
        if (type === 'favorite' && req && typeof req === 'object' && 'user' in req) {
            const user = req.user;
            if (user && typeof user.userId === 'number') {
                try {
                    await this.favoriteService.addFavorite(user.userId, episode.seriesId, episode.id);
                }
                catch (error) {
                    console.error('收藏操作失败:', error);
                    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
                        console.log('用户已收藏该剧集，跳过重复收藏');
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
        await this.interactionService.increment(episode.id, type);
        return this.success({ episodeId: episode.id, shortId, type }, '已更新');
    }
    async comment(req, body) {
        const shortId = body?.shortId?.trim();
        if (!shortId)
            throw new common_1.BadRequestException('shortId 必填');
        const episode = await this.episodeService.getEpisodeByShortId(shortId);
        if (!episode)
            return this.error('剧集不存在', 404);
        const content = body?.content?.trim();
        if (!content)
            throw new common_1.BadRequestException('评论内容必填');
        const userId = req.user?.userId ? Number(req.user.userId) : 0;
        if (!userId)
            return this.error('未认证', 401);
        const result = await this.videoService.addComment(userId, shortId, content);
        return this.success(result, '评论发表成功', 200);
    }
    async replyComment(req, body) {
        const userId = req.user?.userId ? Number(req.user.userId) : 0;
        if (!userId)
            return this.error('未认证', 401);
        const { episodeShortId, parentId, content } = body;
        if (!episodeShortId?.trim())
            throw new common_1.BadRequestException('episodeShortId 必填');
        if (!parentId)
            throw new common_1.BadRequestException('parentId 必填');
        if (!content?.trim())
            throw new common_1.BadRequestException('评论内容必填');
        try {
            const result = await this.interactionService.addReply(userId, episodeShortId.trim(), parentId, content.trim());
            return this.success(result, '回复成功', 200);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : '回复失败';
            return this.error(errMsg, 400);
        }
    }
    async getCommentReplies(commentId, page, size) {
        try {
            const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
            const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
            const result = await this.interactionService.getCommentReplies(parseInt(commentId, 10), pageNum, sizeNum);
            return this.success(result, '获取成功', 200);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : '获取失败';
            return this.error(errMsg, 400);
        }
    }
};
exports.InteractionController = InteractionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('activity'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EpisodeActivityDto, Object]),
    __metadata("design:returntype", Promise)
], InteractionController.prototype, "activity", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('comment'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InteractionController.prototype, "comment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('comment/reply'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InteractionController.prototype, "replyComment", null);
__decorate([
    (0, common_1.Get)('comments/:commentId/replies'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InteractionController.prototype, "getCommentReplies", null);
exports.InteractionController = InteractionController = __decorate([
    (0, common_1.Controller)('video/episode'),
    __metadata("design:paramtypes", [episode_interaction_service_1.EpisodeInteractionService,
        episode_service_1.EpisodeService,
        video_service_1.VideoService,
        favorite_service_1.FavoriteService])
], InteractionController);
//# sourceMappingURL=interaction.controller.js.map
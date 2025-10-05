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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const video_service_1 = require("../video.service");
const base_controller_1 = require("./base.controller");
let CommentController = class CommentController extends base_controller_1.BaseController {
    videoService;
    constructor(videoService) {
        super();
        this.videoService = videoService;
    }
    async addComment(req, episodeIdentifier, content, appearSecond) {
        try {
            if (!episodeIdentifier) {
                return this.error('剧集标识符不能为空', 400);
            }
            if (!content || content.trim().length === 0) {
                return this.error('评论内容不能为空', 400);
            }
            if (content.length > 500) {
                return this.error('评论内容不能超过500个字符', 400);
            }
            if (appearSecond !== undefined && (appearSecond < 0 || appearSecond > 86400)) {
                return this.error('弹幕出现时间无效', 400);
            }
            const isShortId = typeof episodeIdentifier === 'string' &&
                episodeIdentifier.length === 11 &&
                !/^\d+$/.test(episodeIdentifier);
            const episode = await this.videoService.getEpisodeByShortId(isShortId ? episodeIdentifier : String(episodeIdentifier));
            if (!episode) {
                return this.error('剧集不存在', 404);
            }
            const result = await this.videoService.addComment(req.user.userId, episode.shortId, content.trim(), appearSecond);
            return this.success(result, '评论发表成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '发表评论失败');
        }
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('episodeIdentifier')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('appearSecond')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "addComment", null);
exports.CommentController = CommentController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('video/comment'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map
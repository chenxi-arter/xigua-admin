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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const base_controller_1 = require("./base.controller");
const video_service_1 = require("../video.service");
const comment_service_1 = require("../services/comment.service");
let CommentsController = class CommentsController extends base_controller_1.BaseController {
    videoService;
    commentService;
    constructor(videoService, commentService) {
        super();
        this.videoService = videoService;
        this.commentService = commentService;
    }
    async listByEpisodeShortId(episodeShortId, page, size) {
        try {
            const shortId = (episodeShortId ?? '').trim();
            if (!shortId)
                return this.error('episodeShortId 必填', 400);
            const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
            const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
            const result = await this.commentService.getCommentsByEpisodeShortId(shortId, pageNum, sizeNum);
            return this.success(result, '获取评论成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取评论失败');
        }
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('episodeShortId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "listByEpisodeShortId", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('video/comments'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        comment_service_1.CommentService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map
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
exports.EpisodeInteractionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_entity_1 = require("../entity/episode.entity");
const comment_service_1 = require("./comment.service");
let EpisodeInteractionService = class EpisodeInteractionService {
    episodeRepo;
    commentService;
    constructor(episodeRepo, commentService) {
        this.episodeRepo = episodeRepo;
        this.commentService = commentService;
    }
    async increment(episodeId, type) {
        switch (type) {
            case 'like':
                await this.episodeRepo.increment({ id: episodeId }, 'likeCount', 1);
                break;
            case 'dislike':
                await this.episodeRepo.increment({ id: episodeId }, 'dislikeCount', 1);
                break;
            case 'favorite':
                await this.episodeRepo.increment({ id: episodeId }, 'favoriteCount', 1);
                break;
            default:
                throw new Error('Unsupported reaction type');
        }
    }
    async addReply(userId, episodeShortId, parentId, content) {
        return this.commentService.addReply(userId, episodeShortId, parentId, content);
    }
    async getCommentReplies(commentId, page, size) {
        return this.commentService.getCommentReplies(commentId, page, size);
    }
};
exports.EpisodeInteractionService = EpisodeInteractionService;
exports.EpisodeInteractionService = EpisodeInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        comment_service_1.CommentService])
], EpisodeInteractionService);
//# sourceMappingURL=episode-interaction.service.js.map
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
var AccountMergeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMergeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const watch_progress_entity_1 = require("../video/entity/watch-progress.entity");
const favorite_entity_1 = require("../user/entity/favorite.entity");
const episode_reaction_entity_1 = require("../video/entity/episode-reaction.entity");
const comment_entity_1 = require("../video/entity/comment.entity");
const comment_like_entity_1 = require("../video/entity/comment-like.entity");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
let AccountMergeService = AccountMergeService_1 = class AccountMergeService {
    userRepo;
    watchProgressRepo;
    favoriteRepo;
    episodeReactionRepo;
    commentRepo;
    commentLikeRepo;
    refreshTokenRepo;
    dataSource;
    logger = new common_1.Logger(AccountMergeService_1.name);
    constructor(userRepo, watchProgressRepo, favoriteRepo, episodeReactionRepo, commentRepo, commentLikeRepo, refreshTokenRepo, dataSource) {
        this.userRepo = userRepo;
        this.watchProgressRepo = watchProgressRepo;
        this.favoriteRepo = favoriteRepo;
        this.episodeReactionRepo = episodeReactionRepo;
        this.commentRepo = commentRepo;
        this.commentLikeRepo = commentLikeRepo;
        this.refreshTokenRepo = refreshTokenRepo;
        this.dataSource = dataSource;
    }
    async mergeGuestToUser(guestUserId, targetUserId) {
        this.logger.log(`开始合并游客账户 ${guestUserId} 到正式用户 ${targetUserId}`);
        const stats = {
            watchProgress: 0,
            favorites: 0,
            episodeReactions: 0,
            comments: 0,
            commentLikes: 0,
        };
        await this.dataSource.transaction(async (manager) => {
            const watchProgresses = await manager.find(watch_progress_entity_1.WatchProgress, {
                where: { userId: guestUserId },
            });
            for (const wp of watchProgresses) {
                const existing = await manager.findOne(watch_progress_entity_1.WatchProgress, {
                    where: { userId: targetUserId, episodeId: wp.episodeId },
                });
                if (existing) {
                    if (new Date(wp.updatedAt) > new Date(existing.updatedAt)) {
                        existing.stopAtSecond = wp.stopAtSecond;
                        existing.updatedAt = wp.updatedAt;
                        await manager.save(watch_progress_entity_1.WatchProgress, existing);
                    }
                    await manager.remove(watch_progress_entity_1.WatchProgress, wp);
                }
                else {
                    wp.userId = targetUserId;
                    await manager.save(watch_progress_entity_1.WatchProgress, wp);
                }
                stats.watchProgress++;
            }
            const favorites = await manager.find(favorite_entity_1.Favorite, {
                where: { userId: guestUserId },
            });
            for (const fav of favorites) {
                const whereCondition = {
                    userId: targetUserId,
                    seriesId: fav.seriesId,
                    favoriteType: fav.favoriteType,
                };
                if (fav.episodeId) {
                    whereCondition.episodeId = fav.episodeId;
                }
                const existing = await manager.findOne(favorite_entity_1.Favorite, {
                    where: whereCondition,
                });
                if (existing) {
                    await manager.remove(favorite_entity_1.Favorite, fav);
                }
                else {
                    fav.userId = targetUserId;
                    await manager.save(favorite_entity_1.Favorite, fav);
                }
                stats.favorites++;
            }
            const reactions = await manager.find(episode_reaction_entity_1.EpisodeReaction, {
                where: { userId: guestUserId },
            });
            for (const reaction of reactions) {
                const existing = await manager.findOne(episode_reaction_entity_1.EpisodeReaction, {
                    where: { userId: targetUserId, episodeId: reaction.episodeId },
                });
                if (existing) {
                    if (new Date(reaction.updatedAt) > new Date(existing.updatedAt)) {
                        existing.reactionType = reaction.reactionType;
                        existing.updatedAt = reaction.updatedAt;
                        await manager.save(episode_reaction_entity_1.EpisodeReaction, existing);
                    }
                    await manager.remove(episode_reaction_entity_1.EpisodeReaction, reaction);
                }
                else {
                    reaction.userId = targetUserId;
                    await manager.save(episode_reaction_entity_1.EpisodeReaction, reaction);
                }
                stats.episodeReactions++;
            }
            const comments = await manager.find(comment_entity_1.Comment, {
                where: { userId: guestUserId },
            });
            for (const comment of comments) {
                comment.userId = targetUserId;
                await manager.save(comment_entity_1.Comment, comment);
                stats.comments++;
            }
            const commentLikes = await manager.find(comment_like_entity_1.CommentLike, {
                where: { userId: guestUserId },
            });
            for (const like of commentLikes) {
                const existing = await manager.findOne(comment_like_entity_1.CommentLike, {
                    where: { userId: targetUserId, commentId: like.commentId },
                });
                if (existing) {
                    await manager.remove(comment_like_entity_1.CommentLike, like);
                }
                else {
                    like.userId = targetUserId;
                    await manager.save(comment_like_entity_1.CommentLike, like);
                }
                stats.commentLikes++;
            }
            await manager.delete(refresh_token_entity_1.RefreshToken, { userId: guestUserId });
            await manager.delete(user_entity_1.User, { id: guestUserId });
            this.logger.log(`账户合并完成: ${JSON.stringify(stats)}`);
        });
        return stats;
    }
    async canMergeAccount(guestUserId) {
        const user = await this.userRepo.findOne({ where: { id: guestUserId } });
        return user?.isGuest === true;
    }
};
exports.AccountMergeService = AccountMergeService;
exports.AccountMergeService = AccountMergeService = AccountMergeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(2, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(3, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __param(4, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(5, (0, typeorm_1.InjectRepository)(comment_like_entity_1.CommentLike)),
    __param(6, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AccountMergeService);
//# sourceMappingURL=account-merge.service.js.map
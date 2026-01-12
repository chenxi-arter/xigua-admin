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
var AccountMergeOptimizedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMergeOptimizedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
let AccountMergeOptimizedService = AccountMergeOptimizedService_1 = class AccountMergeOptimizedService {
    userRepo;
    dataSource;
    logger = new common_1.Logger(AccountMergeOptimizedService_1.name);
    constructor(userRepo, dataSource) {
        this.userRepo = userRepo;
        this.dataSource = dataSource;
    }
    async mergeGuestToUser(guestUserId, targetUserId) {
        this.logger.log(`[优化版] 开始合并游客账户 ${guestUserId} 到正式用户 ${targetUserId}`);
        const startTime = Date.now();
        const stats = {
            watchProgress: 0,
            favorites: 0,
            episodeReactions: 0,
            comments: 0,
            commentLikes: 0,
            deletedDuplicates: 0,
            duration: 0,
        };
        await this.dataSource.transaction(async (manager) => {
            const watchProgressResult = await manager.query(`
        UPDATE watch_progress wp_guest
        INNER JOIN watch_progress wp_target 
          ON wp_guest.episode_id = wp_target.episode_id 
          AND wp_target.user_id = ?
        SET wp_target.stop_at_second = wp_guest.stop_at_second,
            wp_target.updated_at = wp_guest.updated_at
        WHERE wp_guest.user_id = ?
          AND wp_guest.updated_at > wp_target.updated_at
      `, [targetUserId, guestUserId]);
            const deletedWatchProgress = await manager.query(`
        DELETE wp_guest FROM watch_progress wp_guest
        INNER JOIN watch_progress wp_target 
          ON wp_guest.episode_id = wp_target.episode_id 
          AND wp_target.user_id = ?
        WHERE wp_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += deletedWatchProgress.affectedRows || 0;
            const movedWatchProgress = await manager.query(`
        UPDATE watch_progress 
        SET user_id = ? 
        WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.watchProgress = movedWatchProgress.affectedRows || 0;
            const deletedFavorites = await manager.query(`
        DELETE fav_guest FROM favorites fav_guest
        INNER JOIN favorites fav_target 
          ON fav_guest.series_id = fav_target.series_id 
          AND fav_guest.favorite_type = fav_target.favorite_type
          AND COALESCE(fav_guest.episode_id, 0) = COALESCE(fav_target.episode_id, 0)
          AND fav_target.user_id = ?
        WHERE fav_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += deletedFavorites.affectedRows || 0;
            const movedFavorites = await manager.query(`
        UPDATE favorites 
        SET user_id = ? 
        WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.favorites = movedFavorites.affectedRows || 0;
            await manager.query(`
        UPDATE episode_reactions er_guest
        INNER JOIN episode_reactions er_target 
          ON er_guest.episode_id = er_target.episode_id 
          AND er_target.user_id = ?
        SET er_target.reaction_type = er_guest.reaction_type,
            er_target.updated_at = er_guest.updated_at
        WHERE er_guest.user_id = ?
          AND er_guest.updated_at > er_target.updated_at
      `, [targetUserId, guestUserId]);
            const deletedReactions = await manager.query(`
        DELETE er_guest FROM episode_reactions er_guest
        INNER JOIN episode_reactions er_target 
          ON er_guest.episode_id = er_target.episode_id 
          AND er_target.user_id = ?
        WHERE er_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += deletedReactions.affectedRows || 0;
            const movedReactions = await manager.query(`
        UPDATE episode_reactions 
        SET user_id = ? 
        WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.episodeReactions = movedReactions.affectedRows || 0;
            const movedComments = await manager.query(`
        UPDATE comments 
        SET user_id = ? 
        WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.comments = movedComments.affectedRows || 0;
            const deletedCommentLikes = await manager.query(`
        DELETE cl_guest FROM comment_likes cl_guest
        INNER JOIN comment_likes cl_target 
          ON cl_guest.comment_id = cl_target.comment_id 
          AND cl_target.user_id = ?
        WHERE cl_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += deletedCommentLikes.affectedRows || 0;
            const movedCommentLikes = await manager.query(`
        UPDATE comment_likes 
        SET user_id = ? 
        WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.commentLikes = movedCommentLikes.affectedRows || 0;
            await manager.delete(refresh_token_entity_1.RefreshToken, { userId: guestUserId });
            await manager.delete(user_entity_1.User, { id: guestUserId });
            stats.duration = Date.now() - startTime;
            this.logger.log(`[优化版] 账户合并完成: ${JSON.stringify(stats)}`);
        });
        return stats;
    }
    async canMergeAccount(guestUserId) {
        const user = await this.userRepo.findOne({ where: { id: guestUserId } });
        return user?.isGuest === true;
    }
    async getMergePreview(guestUserId) {
        const [watchProgress] = await this.dataSource.query('SELECT COUNT(*) as count FROM watch_progress WHERE user_id = ?', [guestUserId]);
        const [favorites] = await this.dataSource.query('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [guestUserId]);
        const [reactions] = await this.dataSource.query('SELECT COUNT(*) as count FROM episode_reactions WHERE user_id = ?', [guestUserId]);
        const [comments] = await this.dataSource.query('SELECT COUNT(*) as count FROM comments WHERE user_id = ?', [guestUserId]);
        const [commentLikes] = await this.dataSource.query('SELECT COUNT(*) as count FROM comment_likes WHERE user_id = ?', [guestUserId]);
        return {
            watchProgress: watchProgress[0].count,
            favorites: favorites[0].count,
            episodeReactions: reactions[0].count,
            comments: comments[0].count,
            commentLikes: commentLikes[0].count,
            total: watchProgress[0].count + favorites[0].count +
                reactions[0].count + comments[0].count + commentLikes[0].count,
        };
    }
};
exports.AccountMergeOptimizedService = AccountMergeOptimizedService;
exports.AccountMergeOptimizedService = AccountMergeOptimizedService = AccountMergeOptimizedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AccountMergeOptimizedService);
//# sourceMappingURL=account-merge-optimized.service.js.map
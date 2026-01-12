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
var AccountMergeAsyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMergeAsyncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
let AccountMergeAsyncService = AccountMergeAsyncService_1 = class AccountMergeAsyncService {
    userRepo;
    dataSource;
    logger = new common_1.Logger(AccountMergeAsyncService_1.name);
    mergeJobs = new Map();
    constructor(userRepo, dataSource) {
        this.userRepo = userRepo;
        this.dataSource = dataSource;
    }
    queueMerge(guestUserId, targetUserId) {
        const jobId = `merge_${guestUserId}_${targetUserId}_${Date.now()}`;
        const jobStatus = {
            jobId,
            status: 'pending',
            guestUserId,
            targetUserId,
            startTime: new Date(),
        };
        this.mergeJobs.set(jobId, jobStatus);
        this.logger.log(`[异步合并] 任务已加入队列: ${jobId}`);
        void this.executeMergeInBackground(jobId, guestUserId, targetUserId);
        return {
            jobId,
            message: '数据合并任务已提交，请稍后查询合并状态',
        };
    }
    async executeMergeInBackground(jobId, guestUserId, targetUserId) {
        const job = this.mergeJobs.get(jobId);
        if (!job)
            return;
        try {
            job.status = 'processing';
            this.logger.log(`[异步合并] 开始处理任务: ${jobId}`);
            const stats = await this.performMerge(guestUserId, targetUserId, (progress) => {
                job.progress = progress;
            });
            job.status = 'completed';
            job.stats = stats;
            job.endTime = new Date();
            job.progress = 100;
            this.logger.log(`[异步合并] 任务完成: ${jobId}, 耗时: ${job.endTime.getTime() - job.startTime.getTime()}ms`);
        }
        catch (error) {
            job.status = 'failed';
            job.error = error?.message || 'Unknown error';
            job.endTime = new Date();
            this.logger.error(`[异步合并] 任务失败: ${jobId}`, error?.stack);
        }
    }
    async performMerge(guestUserId, targetUserId, onProgress) {
        const stats = {
            watchProgress: 0,
            favorites: 0,
            episodeReactions: 0,
            comments: 0,
            commentLikes: 0,
            deletedDuplicates: 0,
        };
        await this.dataSource.transaction(async (manager) => {
            onProgress?.(10);
            const wpResult = await manager.query(`
        DELETE wp_guest FROM watch_progress wp_guest
        INNER JOIN watch_progress wp_target 
          ON wp_guest.episode_id = wp_target.episode_id 
          AND wp_target.user_id = ?
        WHERE wp_guest.user_id = ?
          AND wp_guest.updated_at <= wp_target.updated_at
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += Number(wpResult?.affectedRows) || 0;
            const movedWp = await manager.query(`
        UPDATE watch_progress SET user_id = ? WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.watchProgress = movedWp?.affectedRows || 0;
            onProgress?.(30);
            const favResult = await manager.query(`
        DELETE fav_guest FROM favorites fav_guest
        INNER JOIN favorites fav_target 
          ON fav_guest.series_id = fav_target.series_id 
          AND fav_guest.favorite_type = fav_target.favorite_type
          AND COALESCE(fav_guest.episode_id, 0) = COALESCE(fav_target.episode_id, 0)
          AND fav_target.user_id = ?
        WHERE fav_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += favResult?.affectedRows || 0;
            const movedFav = await manager.query(`
        UPDATE favorites SET user_id = ? WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.favorites = movedFav?.affectedRows || 0;
            onProgress?.(50);
            const reactResult = await manager.query(`
        DELETE er_guest FROM episode_reactions er_guest
        INNER JOIN episode_reactions er_target 
          ON er_guest.episode_id = er_target.episode_id 
          AND er_target.user_id = ?
        WHERE er_guest.user_id = ?
          AND er_guest.updated_at <= er_target.updated_at
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += reactResult?.affectedRows || 0;
            const movedReact = await manager.query(`
        UPDATE episode_reactions SET user_id = ? WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.episodeReactions = movedReact?.affectedRows || 0;
            onProgress?.(70);
            const movedComments = await manager.query(`
        UPDATE comments SET user_id = ? WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.comments = movedComments?.affectedRows || 0;
            onProgress?.(80);
            const likeResult = await manager.query(`
        DELETE cl_guest FROM comment_likes cl_guest
        INNER JOIN comment_likes cl_target 
          ON cl_guest.comment_id = cl_target.comment_id 
          AND cl_target.user_id = ?
        WHERE cl_guest.user_id = ?
      `, [targetUserId, guestUserId]);
            stats.deletedDuplicates += likeResult?.affectedRows || 0;
            const movedLikes = await manager.query(`
        UPDATE comment_likes SET user_id = ? WHERE user_id = ?
      `, [targetUserId, guestUserId]);
            stats.commentLikes = movedLikes?.affectedRows || 0;
            onProgress?.(95);
            await manager.query('DELETE FROM refresh_tokens WHERE user_id = ?', [guestUserId]);
            await manager.query('DELETE FROM users WHERE id = ?', [guestUserId]);
            onProgress?.(100);
        });
        return stats;
    }
    getMergeStatus(jobId) {
        return this.mergeJobs.get(jobId) || null;
    }
    getUserMergeJobs(userId) {
        const jobs = [];
        for (const job of this.mergeJobs.values()) {
            if (job.guestUserId === userId || job.targetUserId === userId) {
                jobs.push(job);
            }
        }
        return jobs.sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));
    }
    cleanupCompletedJobs(olderThanHours = 24) {
        const cutoffTime = Date.now() - olderThanHours * 60 * 60 * 1000;
        for (const [jobId, job] of this.mergeJobs.entries()) {
            if ((job.status === 'completed' || job.status === 'failed') &&
                job.endTime &&
                job.endTime.getTime() < cutoffTime) {
                this.mergeJobs.delete(jobId);
                this.logger.log(`[异步合并] 清理过期任务: ${jobId}`);
            }
        }
    }
};
exports.AccountMergeAsyncService = AccountMergeAsyncService;
exports.AccountMergeAsyncService = AccountMergeAsyncService = AccountMergeAsyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AccountMergeAsyncService);
//# sourceMappingURL=account-merge-async.service.js.map
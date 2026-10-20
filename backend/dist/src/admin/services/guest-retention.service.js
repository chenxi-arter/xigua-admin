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
var GuestRetentionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestRetentionService = exports.DEFAULT_MAX_PER_RUN = exports.DEFAULT_BATCH_SIZE = exports.MAX_INACTIVE_MONTHS = exports.MIN_INACTIVE_MONTHS = exports.DEFAULT_INACTIVE_MONTHS = void 0;
exports.isGuestPurgeResult = isGuestPurgeResult;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const redis_module_1 = require("../../core/redis/redis.module");
exports.DEFAULT_INACTIVE_MONTHS = 3;
exports.MIN_INACTIVE_MONTHS = 2;
exports.MAX_INACTIVE_MONTHS = 60;
exports.DEFAULT_BATCH_SIZE = 200;
exports.DEFAULT_MAX_PER_RUN = 5000;
const PREVIEW_SAMPLE_SIZE = 20;
function isGuestPurgeResult(value) {
    return value.dryRun === false;
}
let GuestRetentionService = GuestRetentionService_1 = class GuestRetentionService {
    userRepo;
    redisClient;
    logger = new common_1.Logger(GuestRetentionService_1.name);
    constructor(userRepo, redisClient) {
        this.userRepo = userRepo;
        this.redisClient = redisClient;
    }
    async scheduledPurge() {
        if (process.env.GUEST_PURGE_ENABLED !== 'true') {
            return;
        }
        try {
            const result = await this.purge({
                inactiveMonths: this.readPositiveNumber('GUEST_PURGE_INACTIVE_MONTHS', exports.DEFAULT_INACTIVE_MONTHS),
                batchSize: this.readPositiveNumber('GUEST_PURGE_BATCH_SIZE', exports.DEFAULT_BATCH_SIZE),
                maxPerRun: this.readPositiveNumber('GUEST_PURGE_MAX_PER_RUN', exports.DEFAULT_MAX_PER_RUN),
                dryRun: false,
            });
            if (!isGuestPurgeResult(result)) {
                this.logger.warn('[游客清理] 本次仅演练，未删除任何数据');
                return;
            }
            this.logger.log(`[游客清理] 完成：删除 ${result.deletedUsers} 个游客 / ${result.batches} 批，` +
                `阈值 ${result.cutoff}（${result.inactiveMonths} 个月），耗时 ${result.durationMs}ms`);
            if (result.truncated) {
                this.logger.warn(`[游客清理] 已达到单次上限 ${result.deletedUsers} 个，剩余量留到下次执行`);
            }
        }
        catch (error) {
            this.logger.error(`[游客清理] 执行失败: ${error?.message ?? error}`, error?.stack);
        }
    }
    async preview(options = {}) {
        const inactiveMonths = this.normalizeMonths(options.inactiveMonths);
        const cutoff = this.resolveCutoff(inactiveMonths);
        const cutoffDate = this.toBeijingDateOnly(cutoff);
        const where = this.buildCandidateWhere(cutoff, cutoffDate);
        const totalRows = await this.userRepo.query(`SELECT COUNT(*) AS total FROM users u WHERE ${where.sql}`, where.params);
        const totalUsers = Number(totalRows?.[0]?.total ?? 0);
        const sample = totalUsers
            ? await this.userRepo.query(`SELECT
             u.id,
             u.nickname,
             u.username,
             u.created_at AS createdAt,
             (SELECT MAX(d.date) FROM user_online_daily d WHERE d.user_id = u.id) AS lastOnlineDate,
             (SELECT MAX(wp.updated_at) FROM watch_progress wp WHERE wp.user_id = u.id) AS lastWatchAt
           FROM users u
           WHERE ${where.sql}
           ORDER BY u.created_at ASC
           LIMIT ${PREVIEW_SAMPLE_SIZE}`, where.params)
            : [];
        const impact = await this.countImpact(where.sql, where.params);
        return {
            dryRun: true,
            inactiveMonths,
            minInactiveMonths: exports.MIN_INACTIVE_MONTHS,
            affectsRecent35Days: inactiveMonths * 30 < 35,
            cutoff: cutoffDate,
            totalUsers,
            sample,
            impact,
        };
    }
    async purge(options = {}) {
        const inactiveMonths = this.normalizeMonths(options.inactiveMonths);
        const batchSize = Math.min(Math.max(options.batchSize ?? exports.DEFAULT_BATCH_SIZE, 1), 1000);
        const maxPerRun = Math.max(options.maxPerRun ?? exports.DEFAULT_MAX_PER_RUN, 1);
        const dryRun = options.dryRun !== false;
        if (dryRun) {
            return this.preview({ inactiveMonths });
        }
        const startedAt = Date.now();
        const cutoff = this.resolveCutoff(inactiveMonths);
        const cutoffDate = this.toBeijingDateOnly(cutoff);
        const where = this.buildCandidateWhere(cutoff, cutoffDate);
        const affected = this.emptyImpact();
        let deletedUsers = 0;
        let batches = 0;
        let truncated = false;
        while (true) {
            const remaining = maxPerRun - deletedUsers;
            if (remaining <= 0) {
                truncated = true;
                break;
            }
            const take = Math.min(batchSize, remaining);
            const rows = await this.userRepo.query(`SELECT u.id FROM users u WHERE ${where.sql} ORDER BY u.id ASC LIMIT ${take}`, where.params);
            if (!rows || rows.length === 0) {
                break;
            }
            const ids = rows.map((row) => Number(row.id)).filter((id) => Number.isFinite(id) && id > 0);
            if (ids.length === 0) {
                break;
            }
            const batchResult = await this.deleteBatch(ids);
            this.addImpact(affected, batchResult.affected);
            if (batchResult.deletedUsers === 0) {
                this.logger.warn(`[游客清理] 本批 ${ids.length} 个候选均未删除（可能已转正/绑定），提前结束`);
                break;
            }
            deletedUsers += batchResult.deletedUsers;
            batches += 1;
            await this.clearOnlineCache(ids);
            this.logger.log(`[游客清理] 第 ${batches} 批删除 ${ids.length} 个游客（累计 ${deletedUsers}）`);
        }
        const result = {
            dryRun: false,
            inactiveMonths,
            cutoff: cutoffDate,
            deletedUsers,
            batches,
            affected,
            truncated,
            durationMs: Date.now() - startedAt,
        };
        this.logger.log(`[游客清理] 结束：用户 ${deletedUsers}，评论 ${affected.comments}，` +
            `观看进度 ${affected.watchProgress}，收藏 ${affected.favorites}，` +
            `登录态 ${affected.refreshTokens}，耗时 ${result.durationMs}ms`);
        return result;
    }
    async deleteBatch(ids) {
        const idList = ids.join(',');
        const affected = this.emptyImpact();
        let deletedUsers = 0;
        await this.userRepo.manager.transaction(async (manager) => {
            const run = async (sql) => {
                const result = await manager.query(sql);
                return Number(result?.affectedRows ?? 0);
            };
            await run(`UPDATE comments c
         JOIN (
           SELECT comment_id, COUNT(*) AS cnt
           FROM comment_likes
           WHERE user_id IN (${idList})
           GROUP BY comment_id
         ) x ON x.comment_id = c.id
         SET c.like_count = GREATEST(c.like_count - x.cnt, 0)`);
            affected.commentLikesGiven += await run(`DELETE FROM comment_likes WHERE user_id IN (${idList})`);
            affected.commentLikesReceived += await run(`DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE user_id IN (${idList}))`);
            affected.repliesToUserComments += await run(`UPDATE comments SET reply_to_user_id = NULL WHERE reply_to_user_id IN (${idList})`);
            await run(`UPDATE comments r
         JOIN (
           SELECT root_id, COUNT(*) AS cnt
           FROM comments
           WHERE user_id IN (${idList}) AND root_id IS NOT NULL
           GROUP BY root_id
         ) x ON x.root_id = r.id
         SET r.reply_count = GREATEST(r.reply_count - x.cnt, 0)`);
            affected.comments += await run(`DELETE FROM comments WHERE user_id IN (${idList})`);
            affected.watchProgress += await run(`DELETE FROM watch_progress WHERE user_id IN (${idList})`);
            affected.watchLogs += await run(`DELETE FROM watch_logs WHERE user_id IN (${idList})`);
            affected.browseHistory += await run(`DELETE FROM browse_history WHERE user_id IN (${idList})`);
            affected.favorites += await run(`DELETE FROM favorites WHERE user_id IN (${idList})`);
            affected.episodeReactions += await run(`DELETE FROM episode_reactions WHERE user_id IN (${idList})`);
            affected.refreshTokens += await run(`DELETE FROM refresh_tokens WHERE user_id IN (${idList})`);
            affected.onlineDaily += await run(`DELETE FROM user_online_daily WHERE user_id IN (${idList})`);
            affected.advertisingEvents += await run(`DELETE FROM advertising_events WHERE user_id IN (${idList})`);
            affected.advertisingConversions += await run(`DELETE FROM advertising_conversions WHERE user_id IN (${idList})`);
            const deleted = await run(`DELETE FROM users WHERE id IN (${idList}) AND is_guest = 1 AND email IS NULL AND telegram_id IS NULL`);
            deletedUsers = deleted;
            if (deleted < ids.length) {
                this.logger.warn(`[游客清理] 本批 ${ids.length} 个候选中只有 ${deleted} 个仍是游客，` +
                    `其余可能在选中后已完成转正/绑定，已跳过`);
            }
        });
        return { affected, deletedUsers };
    }
    buildCandidateWhere(cutoff, cutoffDate) {
        const sql = `
      u.is_guest = 1
      AND u.email IS NULL
      AND u.telegram_id IS NULL
      AND u.created_at < ?
      AND NOT EXISTS (
        SELECT 1 FROM user_online_daily d
        WHERE d.user_id = u.id AND d.date >= ?
      )
      AND NOT EXISTS (
        SELECT 1 FROM watch_progress wp
        WHERE wp.user_id = u.id AND wp.updated_at >= ?
      )
      AND NOT EXISTS (
        SELECT 1 FROM watch_logs wl
        WHERE wl.user_id = u.id AND wl.watch_date >= ?
      )
      AND NOT EXISTS (
        SELECT 1 FROM refresh_tokens rt
        WHERE rt.user_id = u.id AND rt.created_at >= ?
      )
    `;
        return { sql, params: [cutoff, cutoffDate, cutoff, cutoffDate, cutoff] };
    }
    async countImpact(sql, params) {
        const countByJoin = async (table, joinColumn = 'user_id') => {
            try {
                const rows = await this.userRepo.query(`SELECT COUNT(*) AS c FROM ${table} t
           JOIN users u ON u.id = t.${joinColumn}
           WHERE ${sql}`, params);
                return Number(rows?.[0]?.c ?? 0);
            }
            catch (error) {
                this.logger.warn(`[游客清理] 统计 ${table} 失败: ${error?.message}`);
                return -1;
            }
        };
        const [comments, commentLikesGiven, watchProgress, watchLogs, browseHistory, favorites, episodeReactions, refreshTokens, onlineDaily, advertisingEvents, advertisingConversions] = await Promise.all([
            countByJoin('comments'),
            countByJoin('comment_likes'),
            countByJoin('watch_progress'),
            countByJoin('watch_logs'),
            countByJoin('browse_history'),
            countByJoin('favorites'),
            countByJoin('episode_reactions'),
            countByJoin('refresh_tokens'),
            countByJoin('user_online_daily'),
            countByJoin('advertising_events'),
            countByJoin('advertising_conversions'),
        ]);
        let commentLikesReceived = 0;
        let repliesToUserComments = 0;
        try {
            const rows = await this.userRepo.query(`SELECT COUNT(*) AS c FROM comment_likes cl
         JOIN comments c ON c.id = cl.comment_id
         JOIN users u ON u.id = c.user_id
         WHERE ${sql}`, params);
            commentLikesReceived = Number(rows?.[0]?.c ?? 0);
        }
        catch {
            commentLikesReceived = -1;
        }
        try {
            const rows = await this.userRepo.query(`SELECT COUNT(*) AS c FROM comments c
         JOIN users u ON u.id = c.reply_to_user_id
         WHERE ${sql}`, params);
            repliesToUserComments = Number(rows?.[0]?.c ?? 0);
        }
        catch {
            repliesToUserComments = -1;
        }
        return {
            comments,
            commentLikesGiven,
            commentLikesReceived,
            repliesToUserComments,
            watchProgress,
            watchLogs,
            browseHistory,
            favorites,
            episodeReactions,
            refreshTokens,
            onlineDaily,
            advertisingEvents,
            advertisingConversions,
        };
    }
    async clearOnlineCache(ids) {
        if (!this.redisClient || ids.length === 0)
            return;
        const today = this.toBeijingDateOnly(new Date());
        const yesterday = this.toBeijingDateOnly(new Date(Date.now() - 86400000));
        try {
            const pipeline = this.redisClient.multi();
            ids.forEach((id) => {
                pipeline.del(`online:last:${id}`);
                pipeline.hDel(`online:${today}`, String(id));
                pipeline.hDel(`online:${yesterday}`, String(id));
            });
            await pipeline.exec();
        }
        catch (error) {
            this.logger.warn(`[游客清理] 清理在线缓存失败（已忽略）: ${error?.message}`);
        }
    }
    emptyImpact() {
        return {
            comments: 0,
            commentLikesGiven: 0,
            commentLikesReceived: 0,
            repliesToUserComments: 0,
            watchProgress: 0,
            watchLogs: 0,
            browseHistory: 0,
            favorites: 0,
            episodeReactions: 0,
            refreshTokens: 0,
            onlineDaily: 0,
            advertisingEvents: 0,
            advertisingConversions: 0,
        };
    }
    addImpact(target, delta) {
        Object.keys(target).forEach((key) => {
            target[key] += delta[key];
        });
    }
    normalizeMonths(months) {
        const value = Number(months ?? exports.DEFAULT_INACTIVE_MONTHS);
        if (!Number.isFinite(value) || value <= 0) {
            return exports.DEFAULT_INACTIVE_MONTHS;
        }
        const floored = Math.floor(value);
        if (floored < exports.MIN_INACTIVE_MONTHS) {
            this.logger.warn(`[游客清理] 判定周期 ${floored} 个月低于安全下限 ${exports.MIN_INACTIVE_MONTHS} 个月，` +
                `已自动抬到 ${exports.MIN_INACTIVE_MONTHS} 个月：更短的阈值会破坏最近 35 天的统计数据`);
            return exports.MIN_INACTIVE_MONTHS;
        }
        return Math.min(floored, exports.MAX_INACTIVE_MONTHS);
    }
    resolveCutoff(months) {
        return new Date(Date.now() - months * 30 * 86400000);
    }
    toBeijingDateOnly(date) {
        const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        return beijing.toISOString().slice(0, 10);
    }
    readPositiveNumber(envKey, fallback) {
        const raw = process.env[envKey];
        const value = Number(raw);
        return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
    }
};
exports.GuestRetentionService = GuestRetentionService;
__decorate([
    (0, schedule_1.Cron)('30 4 * * *', { timeZone: 'Asia/Shanghai' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestRetentionService.prototype, "scheduledPurge", null);
exports.GuestRetentionService = GuestRetentionService = GuestRetentionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], GuestRetentionService);
//# sourceMappingURL=guest-retention.service.js.map
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
exports.AdminExportController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_log_entity_1 = require("../../video/entity/watch-log.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_reaction_entity_1 = require("../../video/entity/episode-reaction.entity");
const favorite_entity_1 = require("../../user/entity/favorite.entity");
const series_entity_1 = require("../../video/entity/series.entity");
const comment_entity_1 = require("../../video/entity/comment.entity");
const user_online_daily_entity_1 = require("../../user/entity/user-online-daily.entity");
const export_series_details_dto_1 = require("../dto/export-series-details.dto");
const analytics_service_1 = require("../services/analytics.service");
const admin_jwt_auth_guard_1 = require("../guards/admin-jwt-auth.guard");
let AdminExportController = class AdminExportController {
    watchLogRepo;
    userRepo;
    reactionRepo;
    favoriteRepo;
    seriesRepo;
    commentRepo;
    onlineDailyRepo;
    analyticsService;
    constructor(watchLogRepo, userRepo, reactionRepo, favoriteRepo, seriesRepo, commentRepo, onlineDailyRepo, analyticsService) {
        this.watchLogRepo = watchLogRepo;
        this.userRepo = userRepo;
        this.reactionRepo = reactionRepo;
        this.favoriteRepo = favoriteRepo;
        this.seriesRepo = seriesRepo;
        this.commentRepo = commentRepo;
        this.onlineDailyRepo = onlineDailyRepo;
        this.analyticsService = analyticsService;
    }
    async getPlayStats(startDate, endDate) {
        try {
            const dates = this.analyticsService.enumerateLocalDateStrings(startDate, endDate);
            const start = dates[0] || startDate;
            const end = dates[dates.length - 1] || endDate;
            const { startDate: startTime } = this.analyticsService.getLocalDateRange(start);
            const { endDate: endTime } = this.analyticsService.getLocalDateRange(end);
            const statsMap = new Map();
            dates.forEach(d => statsMap.set(d, {
                date: this.formatDate(d),
                playCount: 0,
                completionRate: 0,
                avgWatchDuration: 0,
                likeCount: 0,
                shareCount: 0,
                favoriteCount: 0,
            }));
            const watchRows = await this.watchLogRepo.query(`SELECT DATE_FORMAT(wl.watch_date, '%Y-%m-%d') date,
                COUNT(*) playCount,
                AVG(wl.watch_duration) avgWatchDuration,
                SUM(CASE WHEN ep.duration > 0 AND wl.end_position >= ep.duration * 0.9 THEN 1 ELSE 0 END) completedCount,
                SUM(CASE WHEN ep.duration > 0 THEN 1 ELSE 0 END) completableCount
         FROM watch_logs wl
         INNER JOIN episodes ep ON ep.id = wl.episode_id
         WHERE wl.watch_date >= ? AND wl.watch_date <= ?
         GROUP BY DATE_FORMAT(wl.watch_date, '%Y-%m-%d')`, [start, end]);
            watchRows.forEach(row => {
                const item = statsMap.get(row.date);
                if (!item)
                    return;
                const total = Number(row.completableCount || 0);
                item.playCount = Number(row.playCount || 0);
                item.avgWatchDuration = Math.round(Number(row.avgWatchDuration || 0));
                item.completionRate = total > 0 ? Number((Number(row.completedCount || 0) / total).toFixed(4)) : 0;
            });
            const likeRows = await this.reactionRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date, COUNT(*) likeCount
         FROM episode_reactions
         WHERE created_at >= ? AND created_at <= ? AND reaction_type = 'like'
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            likeRows.forEach(row => { const item = statsMap.get(row.date); if (item)
                item.likeCount = Number(row.likeCount || 0); });
            const favoriteRows = await this.favoriteRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date, COUNT(*) favoriteCount
         FROM favorites
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            favoriteRows.forEach(row => { const item = statsMap.get(row.date); if (item)
                item.favoriteCount = Number(row.favoriteCount || 0); });
            return {
                code: 200,
                data: dates.map(d => statsMap.get(d)),
                message: '播放数据统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取播放数据失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getUserStats(startDate, endDate) {
        try {
            const dates = this.analyticsService.enumerateLocalDateStrings(startDate, endDate);
            const start = dates[0] || startDate;
            const end = dates[dates.length - 1] || endDate;
            const { startDate: startTime } = this.analyticsService.getLocalDateRange(start);
            const { endDate: endTime } = this.analyticsService.getLocalDateRange(end);
            const statsMap = new Map();
            dates.forEach(d => statsMap.set(d, {
                date: this.formatDate(d),
                newUsers: 0,
                nextDayRetention: null,
                dau: 0,
                avgWatchDuration: 0,
                newUserSource: '自然增长',
            }));
            const newUserRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date, COUNT(*) newUsers
         FROM users
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            newUserRows.forEach(row => { const item = statsMap.get(row.date); if (item)
                item.newUsers = Number(row.newUsers || 0); });
            const activeUsersMap = await this.analyticsService.getActiveUsersForDates(dates);
            dates.forEach(d => {
                const item = statsMap.get(d);
                if (item)
                    item.dau = activeUsersMap.get(d) || 0;
            });
            const avgWatchRows = await this.watchLogRepo.query(`SELECT DATE_FORMAT(watch_date, '%Y-%m-%d') date,
                SUM(watch_duration) / COUNT(DISTINCT user_id) avgWatchDuration
         FROM watch_logs
         WHERE watch_date >= ? AND watch_date <= ?
         GROUP BY DATE_FORMAT(watch_date, '%Y-%m-%d')`, [start, end]);
            avgWatchRows.forEach(row => { const item = statsMap.get(row.date); if (item)
                item.avgWatchDuration = Math.round(Number(row.avgWatchDuration || 0)); });
            const cohortRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') cohortDate, COUNT(*) cohortSize
         FROM users
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            const retainedRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(u.created_at, INTERVAL 8 HOUR), '%Y-%m-%d') cohortDate,
                COUNT(DISTINCT u.id) retainedUsers
         FROM users u
         INNER JOIN user_online_daily od
           ON od.user_id = u.id
          AND od.duration > 0
          AND od.date = DATE_FORMAT(DATE_ADD(DATE_ADD(u.created_at, INTERVAL 8 HOUR), INTERVAL 1 DAY), '%Y-%m-%d')
         WHERE u.created_at >= ? AND u.created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(u.created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            const cohortMap = new Map(cohortRows.map(r => [r.cohortDate, Number(r.cohortSize || 0)]));
            const retainedMap = new Map(retainedRows.map(r => [r.cohortDate, Number(r.retainedUsers || 0)]));
            const todayStr = this.analyticsService.getLocalDateStr(new Date());
            dates.forEach(d => {
                const item = statsMap.get(d);
                if (!item)
                    return;
                if (d >= todayStr) {
                    item.nextDayRetention = null;
                    return;
                }
                const cohortSize = cohortMap.get(d) || 0;
                item.nextDayRetention = cohortSize > 0 ? Number(((retainedMap.get(d) || 0) / cohortSize).toFixed(4)) : 0;
            });
            return {
                code: 200,
                data: dates.map(d => statsMap.get(d)),
                message: '用户数据统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取用户数据失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getSeriesDetails(query) {
        try {
            const { startDate, endDate, categoryId } = query;
            const dates = this.analyticsService.enumerateLocalDateStrings(startDate, endDate);
            const start = dates[0] || startDate;
            const end = dates[dates.length - 1] || endDate;
            const { startDate: startTime } = this.analyticsService.getLocalDateRange(start);
            const { endDate: endTime } = this.analyticsService.getLocalDateRange(end);
            const seriesQuery = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes');
            if (categoryId) {
                seriesQuery.where('series.category_id = :categoryId', { categoryId });
            }
            const seriesList = await seriesQuery.getMany();
            const seriesIds = seriesList.map(s => s.id);
            if (seriesIds.length === 0) {
                return { code: 200, message: 'success', timestamp: new Date().toISOString(), data: [] };
            }
            const seriesMap = new Map(seriesList.map(s => [s.id, s]));
            const resultMap = new Map();
            const ensureItem = (date, seriesId) => {
                const series = seriesMap.get(seriesId);
                if (!series)
                    return null;
                const key = `${date}-${seriesId}`;
                const existing = resultMap.get(key);
                if (existing)
                    return existing;
                const item = {
                    date,
                    seriesId,
                    seriesTitle: series.title,
                    categoryName: series.category?.name || '未分类',
                    episodeCount: series.episodes.length,
                    playCount: 0,
                    completionRate: 0,
                    avgWatchDuration: 0,
                    likeCount: 0,
                    dislikeCount: 0,
                    shareCount: 0,
                    favoriteCount: 0,
                    commentCount: 0,
                };
                resultMap.set(key, item);
                return item;
            };
            const watchRows = await this.watchLogRepo.query(`SELECT DATE_FORMAT(wl.watch_date, '%Y-%m-%d') date,
                ep.series_id seriesId,
                COUNT(*) playCount,
                AVG(wl.watch_duration) avgWatchDuration,
                SUM(CASE WHEN ep.duration > 0 AND wl.end_position >= ep.duration * 0.9 THEN 1 ELSE 0 END) completedCount,
                SUM(CASE WHEN ep.duration > 0 THEN 1 ELSE 0 END) completableCount
         FROM watch_logs wl
         INNER JOIN episodes ep ON ep.id = wl.episode_id
         WHERE wl.watch_date >= ? AND wl.watch_date <= ? AND ep.series_id IN (?)
         GROUP BY DATE_FORMAT(wl.watch_date, '%Y-%m-%d'), ep.series_id`, [start, end, seriesIds]);
            watchRows.forEach(row => {
                const item = ensureItem(row.date, Number(row.seriesId));
                if (!item)
                    return;
                const total = Number(row.completableCount || 0);
                item.playCount = Number(row.playCount || 0);
                item.avgWatchDuration = Math.round(Number(row.avgWatchDuration || 0));
                item.completionRate = total > 0 ? Number((Number(row.completedCount || 0) / total).toFixed(4)) : 0;
            });
            const reactionRows = await this.reactionRepo.query(`SELECT DATE_FORMAT(DATE_ADD(r.created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date,
                ep.series_id seriesId,
                SUM(CASE WHEN r.reaction_type = 'like' THEN 1 ELSE 0 END) likeCount,
                SUM(CASE WHEN r.reaction_type = 'dislike' THEN 1 ELSE 0 END) dislikeCount
         FROM episode_reactions r
         INNER JOIN episodes ep ON ep.id = r.episode_id
         WHERE r.created_at >= ? AND r.created_at <= ? AND ep.series_id IN (?)
         GROUP BY DATE_FORMAT(DATE_ADD(r.created_at, INTERVAL 8 HOUR), '%Y-%m-%d'), ep.series_id`, [startTime, endTime, seriesIds]);
            reactionRows.forEach(row => {
                const item = ensureItem(row.date, Number(row.seriesId));
                if (!item)
                    return;
                item.likeCount = Number(row.likeCount || 0);
                item.dislikeCount = Number(row.dislikeCount || 0);
            });
            const favoriteRows = await this.favoriteRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date,
                series_id seriesId,
                COUNT(*) favoriteCount
         FROM favorites
         WHERE created_at >= ? AND created_at <= ? AND series_id IN (?)
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d'), series_id`, [startTime, endTime, seriesIds]);
            favoriteRows.forEach(row => {
                const item = ensureItem(row.date, Number(row.seriesId));
                if (item)
                    item.favoriteCount = Number(row.favoriteCount || 0);
            });
            const commentRows = await this.commentRepo.query(`SELECT DATE_FORMAT(DATE_ADD(c.created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date,
                ep.series_id seriesId,
                COUNT(*) commentCount
         FROM comments c
         INNER JOIN episodes ep ON ep.short_id = c.episode_short_id
         WHERE c.created_at >= ? AND c.created_at <= ? AND ep.series_id IN (?)
         GROUP BY DATE_FORMAT(DATE_ADD(c.created_at, INTERVAL 8 HOUR), '%Y-%m-%d'), ep.series_id`, [startTime, endTime, seriesIds]);
            commentRows.forEach(row => {
                const item = ensureItem(row.date, Number(row.seriesId));
                if (item)
                    item.commentCount = Number(row.commentCount || 0);
            });
            const result = Array.from(resultMap.values()).sort((a, b) => {
                if (a.date !== b.date)
                    return b.date.localeCompare(a.date);
                return b.playCount - a.playCount;
            });
            return { code: 200, message: 'success', timestamp: new Date().toISOString(), data: result };
        }
        catch (error) {
            return {
                code: 500,
                message: `获取系列明细数据失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
                data: [],
            };
        }
    }
    async getOverviewStats(startDate, endDate) {
        try {
            const dates = this.analyticsService.enumerateLocalDateStrings(startDate, endDate);
            if (dates.length === 0) {
                return { code: 200, data: [] };
            }
            const start = dates[0] || startDate;
            const end = dates[dates.length - 1] || endDate;
            const { startDate: startTime } = this.analyticsService.getLocalDateRange(start);
            const { endDate: endTime } = this.analyticsService.getLocalDateRange(end);
            const todayStr = this.analyticsService.getLocalDateStr(new Date());
            const newUserRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') date, COUNT(*) cnt
         FROM users
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            const newUserMap = new Map(newUserRows.map(r => [r.date, Number(r.cnt || 0)]));
            const beforeRows = await this.userRepo.query('SELECT COUNT(*) cnt FROM users WHERE created_at < ?', [startTime]);
            const totalUsersMap = new Map();
            let totalUsers = Number(beforeRows[0]?.cnt || 0);
            dates.forEach(d => {
                totalUsers += newUserMap.get(d) || 0;
                totalUsersMap.set(d, totalUsers);
            });
            const activeUsersMap = await this.analyticsService.getActiveUsersForDates(dates);
            const sessionRows = await this.watchLogRepo.query(`SELECT DATE_FORMAT(watch_date, '%Y-%m-%d') date,
                SUM(watch_duration) totalDuration,
                COUNT(*) totalSessions,
                COUNT(DISTINCT user_id) uniqueUsers
         FROM watch_logs
         WHERE watch_date >= ? AND watch_date <= ?
         GROUP BY DATE_FORMAT(watch_date, '%Y-%m-%d')`, [start, end]);
            const sessionMap = new Map(sessionRows.map(r => [r.date, {
                    totalDuration: Number(r.totalDuration || 0),
                    totalSessions: Number(r.totalSessions || 0),
                    uniqueUsers: Number(r.uniqueUsers || 0),
                }]));
            const cohortRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d') cohortDate, COUNT(*) cohortSize
         FROM users
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            const retainedRows = await this.userRepo.query(`SELECT DATE_FORMAT(DATE_ADD(u.created_at, INTERVAL 8 HOUR), '%Y-%m-%d') cohortDate,
                COUNT(DISTINCT u.id) retainedUsers
         FROM users u
         INNER JOIN user_online_daily od
           ON od.user_id = u.id
          AND od.duration > 0
          AND od.date = DATE_FORMAT(DATE_ADD(DATE_ADD(u.created_at, INTERVAL 8 HOUR), INTERVAL 1 DAY), '%Y-%m-%d')
         WHERE u.created_at >= ? AND u.created_at <= ?
         GROUP BY DATE_FORMAT(DATE_ADD(u.created_at, INTERVAL 8 HOUR), '%Y-%m-%d')`, [startTime, endTime]);
            const cohortMap = new Map(cohortRows.map(r => [r.cohortDate, Number(r.cohortSize || 0)]));
            const retainedMap = new Map(retainedRows.map(r => [r.cohortDate, Number(r.retainedUsers || 0)]));
            const result = dates.map(d => {
                const newUsers = newUserMap.get(d) || 0;
                const activeUsers = activeUsersMap.get(d) || 0;
                const session = sessionMap.get(d);
                const totalDuration = session?.totalDuration || 0;
                const totalSessions = session?.totalSessions || 0;
                const uniqueUsers = session?.uniqueUsers || 0;
                const cohortSize = cohortMap.get(d) || 0;
                const retention = d >= todayStr
                    ? null
                    : (cohortSize > 0 ? Number(((retainedMap.get(d) || 0) / cohortSize).toFixed(4)) : 0);
                return {
                    date: d,
                    new_users: newUsers,
                    content_active_users: activeUsers,
                    watch_progress_updates: totalSessions,
                    total_users: totalUsersMap.get(d) || 0,
                    new_user_ratio: activeUsers > 0 ? Number(Math.min(newUsers / activeUsers, 1).toFixed(4)) : 0,
                    next_day_content_retention: retention,
                    avg_session_duration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
                    avg_daily_duration: uniqueUsers > 0 ? Math.round(totalDuration / uniqueUsers) : null,
                    avg_daily_watch_sessions: uniqueUsers > 0 ? Number((totalSessions / uniqueUsers).toFixed(2)) : null,
                };
            }).reverse();
            return { code: 200, data: result };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取运营指标失败: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
    formatDate(dateStr) {
        const [, month, day] = dateStr.split('-').map(Number);
        return `${month}月${day}日`;
    }
    formatDateOnly(value) {
        if (value instanceof Date)
            return value.toISOString().slice(0, 10);
        return String(value).slice(0, 10);
    }
};
exports.AdminExportController = AdminExportController;
__decorate([
    (0, common_1.Get)('play-stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExportController.prototype, "getPlayStats", null);
__decorate([
    (0, common_1.Get)('user-stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExportController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('series-details'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_series_details_dto_1.ExportSeriesDetailsDto]),
    __metadata("design:returntype", Promise)
], AdminExportController.prototype, "getSeriesDetails", null);
__decorate([
    (0, common_1.Get)('overview-stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminExportController.prototype, "getOverviewStats", null);
exports.AdminExportController = AdminExportController = __decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Controller)('admin/export'),
    __param(0, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __param(3, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(4, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(5, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(6, (0, typeorm_1.InjectRepository)(user_online_daily_entity_1.UserOnlineDaily)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        analytics_service_1.AnalyticsService])
], AdminExportController);
//# sourceMappingURL=admin-export.controller.js.map
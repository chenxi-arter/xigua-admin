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
const watch_progress_entity_1 = require("../../video/entity/watch-progress.entity");
const watch_log_entity_1 = require("../../video/entity/watch-log.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_reaction_entity_1 = require("../../video/entity/episode-reaction.entity");
const favorite_entity_1 = require("../../user/entity/favorite.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
const series_entity_1 = require("../../video/entity/series.entity");
const comment_entity_1 = require("../../video/entity/comment.entity");
const export_series_details_dto_1 = require("../dto/export-series-details.dto");
const watch_log_service_1 = require("../../video/services/watch-log.service");
let AdminExportController = class AdminExportController {
    wpRepo;
    watchLogRepo;
    userRepo;
    reactionRepo;
    favoriteRepo;
    episodeRepo;
    seriesRepo;
    commentRepo;
    watchLogService;
    constructor(wpRepo, watchLogRepo, userRepo, reactionRepo, favoriteRepo, episodeRepo, seriesRepo, commentRepo, watchLogService) {
        this.wpRepo = wpRepo;
        this.watchLogRepo = watchLogRepo;
        this.userRepo = userRepo;
        this.reactionRepo = reactionRepo;
        this.favoriteRepo = favoriteRepo;
        this.episodeRepo = episodeRepo;
        this.seriesRepo = seriesRepo;
        this.commentRepo = commentRepo;
        this.watchLogService = watchLogService;
    }
    async getPlayStats(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const playStats = await this.wpRepo
                .createQueryBuilder('wp')
                .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(*)', 'playCount')
                .addSelect('SUM(wp.stop_at_second) / COUNT(DISTINCT wp.user_id)', 'avgDuration')
                .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                .groupBy('date')
                .orderBy('date', 'ASC')
                .getRawMany();
            const completionStats = await this.wpRepo
                .createQueryBuilder('wp')
                .innerJoin('wp.episode', 'episode')
                .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(*)', 'total')
                .addSelect('SUM(CASE WHEN wp.stop_at_second >= episode.duration * 0.9 THEN 1 ELSE 0 END)', 'completed')
                .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                .andWhere('episode.duration > 0')
                .groupBy('date')
                .getRawMany();
            const likeStats = await this.reactionRepo
                .createQueryBuilder('r')
                .select("DATE_FORMAT(r.created_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(*)', 'likeCount')
                .where('r.created_at BETWEEN :start AND :end', { start, end })
                .andWhere('r.reaction_type = :type', { type: 'like' })
                .groupBy('date')
                .getRawMany();
            const favoriteStats = await this.favoriteRepo
                .createQueryBuilder('f')
                .select("DATE_FORMAT(f.created_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(*)', 'favoriteCount')
                .where('f.created_at BETWEEN :start AND :end', { start, end })
                .groupBy('date')
                .getRawMany();
            const statsMap = new Map();
            playStats.forEach(item => {
                statsMap.set(item.date, {
                    date: this.formatDate(item.date),
                    playCount: parseInt(item.playCount),
                    avgWatchDuration: Math.round(parseFloat(item.avgDuration) || 0),
                    completionRate: 0,
                    likeCount: 0,
                    shareCount: 0,
                    favoriteCount: 0,
                });
            });
            completionStats.forEach(item => {
                const stats = statsMap.get(item.date);
                if (stats) {
                    const total = parseInt(item.total);
                    const completed = parseInt(item.completed);
                    stats.completionRate = total > 0 ? parseFloat((completed / total).toFixed(4)) : 0;
                }
            });
            likeStats.forEach(item => {
                const stats = statsMap.get(item.date);
                if (stats) {
                    stats.likeCount = parseInt(item.likeCount);
                }
            });
            favoriteStats.forEach(item => {
                const stats = statsMap.get(item.date);
                if (stats) {
                    stats.favoriteCount = parseInt(item.favoriteCount);
                }
            });
            const result = Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
            return {
                code: 200,
                data: result,
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
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const newUserStats = await this.userRepo
                .createQueryBuilder('u')
                .select("DATE_FORMAT(u.created_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(*)', 'newUsers')
                .where('u.created_at BETWEEN :start AND :end', { start, end })
                .groupBy('date')
                .orderBy('date', 'ASC')
                .getRawMany();
            const dauStats = await this.wpRepo
                .createQueryBuilder('wp')
                .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                .addSelect('COUNT(DISTINCT wp.user_id)', 'dau')
                .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                .groupBy('date')
                .getRawMany();
            const watchLogStats = await this.watchLogRepo
                .createQueryBuilder('wl')
                .select("DATE(wl.watch_date)", 'date')
                .addSelect('SUM(wl.watch_duration) / COUNT(DISTINCT wl.user_id)', 'avgDuration')
                .where('wl.watch_date BETWEEN :start AND :end', {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0]
            })
                .groupBy('date')
                .getRawMany();
            const avgDurationStats = watchLogStats.length > 0
                ? watchLogStats
                : await this.wpRepo
                    .createQueryBuilder('wp')
                    .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                    .addSelect('SUM(wp.stop_at_second) / COUNT(DISTINCT wp.user_id)', 'avgDuration')
                    .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                    .groupBy('date')
                    .getRawMany();
            const retentionMap = new Map();
            for (const item of newUserStats) {
                const cohortDate = new Date(item.date);
                const nextDayDate = new Date(cohortDate);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
                const nextDayStr = nextDayDate.toISOString().split('T')[0];
                const cohortUsers = await this.userRepo
                    .createQueryBuilder('u')
                    .select('u.id')
                    .where('DATE(u.created_at) = :date', { date: item.date })
                    .getRawMany();
                if (cohortUsers.length === 0) {
                    retentionMap.set(item.date, 0);
                    continue;
                }
                const userIds = cohortUsers.map(u => u.id);
                const wpRetained = await this.wpRepo
                    .createQueryBuilder('wp')
                    .select('DISTINCT wp.user_id', 'userId')
                    .where('wp.user_id IN (:...userIds)', { userIds })
                    .andWhere('DATE(wp.updated_at) = :nextDay', { nextDay: nextDayStr })
                    .getRawMany();
                const retainedIds = new Set(wpRetained.map(r => r.userId));
                const retention = retainedIds.size / cohortUsers.length;
                retentionMap.set(item.date, parseFloat(retention.toFixed(4)));
            }
            const statsMap = new Map();
            newUserStats.forEach(item => {
                statsMap.set(item.date, {
                    date: this.formatDate(item.date),
                    newUsers: parseInt(item.newUsers),
                    nextDayRetention: retentionMap.get(item.date) || 0,
                    dau: 0,
                    avgWatchDuration: 0,
                    newUserSource: '自然增长',
                });
            });
            dauStats.forEach(item => {
                const stats = statsMap.get(item.date);
                if (stats) {
                    stats.dau = parseInt(item.dau);
                }
            });
            avgDurationStats.forEach(item => {
                const stats = statsMap.get(item.date);
                if (stats) {
                    stats.avgWatchDuration = Math.round(parseFloat(item.avgDuration) || 0);
                }
            });
            const result = Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
            return {
                code: 200,
                data: result,
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
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const seriesQuery = this.seriesRepo
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.episodes', 'episodes')
                .where('series.id IS NOT NULL');
            if (categoryId) {
                seriesQuery.andWhere('series.category_id = :categoryId', { categoryId });
            }
            const seriesList = await seriesQuery.getMany();
            if (seriesList.length === 0) {
                return {
                    code: 200,
                    message: 'success',
                    timestamp: new Date().toISOString(),
                    data: [],
                };
            }
            const seriesIds = seriesList.map(s => s.id);
            const episodeIds = seriesList.flatMap(s => s.episodes.map(e => e.id));
            if (episodeIds.length === 0) {
                return {
                    code: 200,
                    message: 'success',
                    timestamp: new Date().toISOString(),
                    data: [],
                };
            }
            const watchLogStatsByDate = await this.watchLogRepo
                .createQueryBuilder('wl')
                .innerJoin('wl.episode', 'episode')
                .select("DATE(wl.watch_date)", 'date')
                .addSelect('episode.series_id', 'seriesId')
                .addSelect('SUM(wl.watch_duration) / COUNT(DISTINCT wl.user_id)', 'avgDuration')
                .where('wl.watch_date BETWEEN :start AND :end', {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0]
            })
                .andWhere('episode.series_id IN (:...seriesIds)', { seriesIds })
                .groupBy('date, episode.series_id')
                .getRawMany();
            const logDataMap = new Map();
            watchLogStatsByDate.forEach(item => {
                const key = `${item.date}-${item.seriesId}`;
                logDataMap.set(key, parseFloat(item.avgDuration || '0'));
            });
            const watchStats = await this.wpRepo
                .createQueryBuilder('wp')
                .innerJoin('wp.episode', 'episode')
                .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                .addSelect('episode.series_id', 'seriesId')
                .addSelect('COUNT(*)', 'playCount')
                .addSelect('SUM(wp.stop_at_second) / COUNT(DISTINCT wp.user_id)', 'avgDurationFallback')
                .addSelect('AVG(CASE WHEN wp.stop_at_second >= episode.duration * 0.9 THEN 1 ELSE 0 END)', 'completionRate')
                .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                .andWhere('episode.series_id IN (:...seriesIds)', { seriesIds })
                .groupBy('date, episode.series_id')
                .getRawMany();
            const reactionStats = await this.reactionRepo
                .createQueryBuilder('r')
                .innerJoin('r.episode', 'episode')
                .select("DATE_FORMAT(r.created_at, '%Y-%m-%d')", 'date')
                .addSelect('episode.series_id', 'seriesId')
                .addSelect('SUM(CASE WHEN r.reaction_type = "like" THEN 1 ELSE 0 END)', 'likeCount')
                .addSelect('SUM(CASE WHEN r.reaction_type = "dislike" THEN 1 ELSE 0 END)', 'dislikeCount')
                .where('r.created_at BETWEEN :start AND :end', { start, end })
                .andWhere('episode.series_id IN (:...seriesIds)', { seriesIds })
                .groupBy('date, episode.series_id')
                .getRawMany();
            const favoriteStats = await this.favoriteRepo
                .createQueryBuilder('f')
                .select("DATE_FORMAT(f.created_at, '%Y-%m-%d')", 'date')
                .addSelect('f.series_id', 'seriesId')
                .addSelect('COUNT(*)', 'favoriteCount')
                .where('f.created_at BETWEEN :start AND :end', { start, end })
                .andWhere('f.series_id IN (:...seriesIds)', { seriesIds })
                .groupBy('date, f.series_id')
                .getRawMany();
            const episodeShortIds = seriesList.flatMap(s => s.episodes.map(e => e.shortId).filter(Boolean));
            let commentStats = [];
            if (episodeShortIds.length > 0) {
                commentStats = await this.commentRepo
                    .createQueryBuilder('c')
                    .select("DATE_FORMAT(c.created_at, '%Y-%m-%d')", 'date')
                    .addSelect('c.episode_short_id', 'episodeShortId')
                    .addSelect('COUNT(*)', 'commentCount')
                    .where('c.created_at BETWEEN :start AND :end', { start, end })
                    .andWhere('c.episode_short_id IN (:...episodeShortIds)', { episodeShortIds })
                    .groupBy('date, c.episode_short_id')
                    .getRawMany();
            }
            const shortIdToSeriesMap = new Map();
            seriesList.forEach(series => {
                series.episodes.forEach(episode => {
                    if (episode.shortId) {
                        shortIdToSeriesMap.set(episode.shortId, series.id);
                    }
                });
            });
            const commentStatsBySeriesMap = new Map();
            commentStats.forEach(stat => {
                const seriesId = shortIdToSeriesMap.get(stat.episodeShortId);
                if (seriesId) {
                    const key = `${stat.date}-${seriesId}`;
                    commentStatsBySeriesMap.set(key, (commentStatsBySeriesMap.get(key) || 0) + parseInt(stat.commentCount));
                }
            });
            const resultMap = new Map();
            watchStats.forEach(stat => {
                const key = `${stat.date}-${stat.seriesId}`;
                const series = seriesList.find(s => s.id === stat.seriesId);
                if (!series)
                    return;
                const avgDuration = logDataMap.get(key) || parseFloat(stat.avgDurationFallback || '0');
                resultMap.set(key, {
                    date: stat.date,
                    seriesId: stat.seriesId,
                    seriesTitle: series.title,
                    categoryName: series.category?.name || '未分类',
                    episodeCount: series.episodes.length,
                    playCount: parseInt(stat.playCount),
                    completionRate: parseFloat(parseFloat(stat.completionRate).toFixed(4)),
                    avgWatchDuration: Math.round(avgDuration),
                    likeCount: 0,
                    dislikeCount: 0,
                    shareCount: 0,
                    favoriteCount: 0,
                    commentCount: 0,
                });
            });
            reactionStats.forEach(stat => {
                const key = `${stat.date}-${stat.seriesId}`;
                const data = resultMap.get(key);
                if (data) {
                    data.likeCount = parseInt(stat.likeCount);
                    data.dislikeCount = parseInt(stat.dislikeCount);
                }
            });
            favoriteStats.forEach(stat => {
                const key = `${stat.date}-${stat.seriesId}`;
                const data = resultMap.get(key);
                if (data) {
                    data.favoriteCount = parseInt(stat.favoriteCount);
                }
            });
            commentStatsBySeriesMap.forEach((count, key) => {
                const data = resultMap.get(key);
                if (data) {
                    data.commentCount = count;
                }
            });
            const result = Array.from(resultMap.values()).sort((a, b) => {
                if (a.date !== b.date) {
                    return b.date.localeCompare(a.date);
                }
                return b.playCount - a.playCount;
            });
            return {
                code: 200,
                message: 'success',
                timestamp: new Date().toISOString(),
                data: result,
            };
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
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
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
exports.AdminExportController = AdminExportController = __decorate([
    (0, common_1.Controller)('admin/export'),
    __param(0, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __param(4, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(5, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(6, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(7, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        watch_log_service_1.WatchLogService])
], AdminExportController);
//# sourceMappingURL=admin-export.controller.js.map
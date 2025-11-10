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
const user_entity_1 = require("../../user/entity/user.entity");
const episode_reaction_entity_1 = require("../../video/entity/episode-reaction.entity");
const favorite_entity_1 = require("../../user/entity/favorite.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
let AdminExportController = class AdminExportController {
    wpRepo;
    userRepo;
    reactionRepo;
    favoriteRepo;
    episodeRepo;
    constructor(wpRepo, userRepo, reactionRepo, favoriteRepo, episodeRepo) {
        this.wpRepo = wpRepo;
        this.userRepo = userRepo;
        this.reactionRepo = reactionRepo;
        this.favoriteRepo = favoriteRepo;
        this.episodeRepo = episodeRepo;
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
                .addSelect('AVG(wp.stop_at_second)', 'avgDuration')
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
            const avgDurationStats = await this.wpRepo
                .createQueryBuilder('wp')
                .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
                .addSelect('AVG(wp.stop_at_second)', 'avgDuration')
                .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                .groupBy('date')
                .getRawMany();
            const retentionMap = new Map();
            for (const item of newUserStats) {
                const cohortDate = new Date(item.date);
                const nextDay = new Date(cohortDate);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayEnd = new Date(nextDay);
                nextDayEnd.setHours(23, 59, 59, 999);
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
                const retainedCount = await this.wpRepo
                    .createQueryBuilder('wp')
                    .where('wp.user_id IN (:...userIds)', { userIds })
                    .andWhere('wp.updated_at BETWEEN :start AND :end', {
                    start: nextDay,
                    end: nextDayEnd
                })
                    .select('COUNT(DISTINCT wp.user_id)', 'count')
                    .getRawOne();
                const retention = parseInt(retainedCount?.count || '0') / cohortUsers.length;
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
exports.AdminExportController = AdminExportController = __decorate([
    (0, common_1.Controller)('admin/export'),
    __param(0, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __param(3, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(4, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminExportController);
//# sourceMappingURL=admin-export.controller.js.map
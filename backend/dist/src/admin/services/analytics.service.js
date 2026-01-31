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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const watch_progress_entity_1 = require("../../video/entity/watch-progress.entity");
const watch_log_entity_1 = require("../../video/entity/watch-log.entity");
const browse_history_entity_1 = require("../../video/entity/browse-history.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
let AnalyticsService = class AnalyticsService {
    userRepo;
    wpRepo;
    watchLogRepo;
    bhRepo;
    episodeRepo;
    constructor(userRepo, wpRepo, watchLogRepo, bhRepo, episodeRepo) {
        this.userRepo = userRepo;
        this.wpRepo = wpRepo;
        this.watchLogRepo = watchLogRepo;
        this.bhRepo = bhRepo;
        this.episodeRepo = episodeRepo;
    }
    async getDAU(date) {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const result = await this.wpRepo
            .createQueryBuilder('wp')
            .select('COUNT(DISTINCT wp.user_id)', 'count')
            .where('wp.updated_at BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
        })
            .getRawOne();
        return parseInt(result?.count || '0', 10);
    }
    async getWAU(endDate) {
        const end = endDate || new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 7);
        const result = await this.wpRepo
            .createQueryBuilder('wp')
            .select('COUNT(DISTINCT wp.user_id)', 'count')
            .where('wp.updated_at BETWEEN :start AND :end', {
            start,
            end,
        })
            .getRawOne();
        return parseInt(result?.count || '0', 10);
    }
    async getMAU(endDate) {
        const end = endDate || new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 30);
        const result = await this.wpRepo
            .createQueryBuilder('wp')
            .select('COUNT(DISTINCT wp.user_id)', 'count')
            .where('wp.updated_at BETWEEN :start AND :end', {
            start,
            end,
        })
            .getRawOne();
        return parseInt(result?.count || '0', 10);
    }
    async getRetentionRate(retentionDays = 1, cohortDate) {
        const cohort = cohortDate || new Date();
        const startOfDay = new Date(cohort);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(cohort);
        endOfDay.setHours(23, 59, 59, 999);
        const cohortUsers = await this.userRepo
            .createQueryBuilder('u')
            .select('u.id')
            .where('u.created_at BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay,
        })
            .getMany();
        const totalUsers = cohortUsers.length;
        if (totalUsers === 0) {
            return { totalUsers: 0, retainedUsers: 0, retentionRate: 0 };
        }
        const userIds = cohortUsers.map(u => u.id);
        const retentionStart = new Date(endOfDay);
        retentionStart.setDate(retentionStart.getDate() + retentionDays);
        retentionStart.setHours(0, 0, 0, 0);
        const retentionEnd = new Date(retentionStart);
        retentionEnd.setHours(23, 59, 59, 999);
        const retainedResult = await this.wpRepo
            .createQueryBuilder('wp')
            .select('COUNT(DISTINCT wp.user_id)', 'count')
            .where('wp.user_id IN (:...userIds)', { userIds })
            .andWhere('wp.updated_at BETWEEN :start AND :end', {
            start: retentionStart,
            end: retentionEnd,
        })
            .getRawOne();
        const retainedUsers = parseInt(retainedResult?.count || '0', 10);
        const retentionRate = totalUsers > 0 ? (retainedUsers / totalUsers) * 100 : 0;
        return {
            totalUsers,
            retainedUsers,
            retentionRate: Math.round(retentionRate * 100) / 100,
        };
    }
    async getRetentionTrend(days = 7, retentionDays = 1) {
        const results = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const cohortDate = new Date(today);
            cohortDate.setDate(cohortDate.getDate() - i - retentionDays);
            const retention = await this.getRetentionRate(retentionDays, cohortDate);
            results.push({
                date: cohortDate.toISOString().split('T')[0],
                ...retention,
            });
        }
        return results;
    }
    async getCompletionRate() {
        const totalRecords = await this.wpRepo.count();
        if (totalRecords === 0) {
            return {
                totalWatchRecords: 0,
                completedRecords: 0,
                completionRate: 0,
            };
        }
        const completedResult = await this.wpRepo
            .createQueryBuilder('wp')
            .innerJoin('wp.episode', 'ep')
            .where('ep.duration > 0')
            .andWhere('(wp.stopAtSecond / ep.duration) >= :threshold', { threshold: 0.9 })
            .getCount();
        const completionRate = totalRecords > 0 ? (completedResult / totalRecords) * 100 : 0;
        return {
            totalWatchRecords: totalRecords,
            completedRecords: completedResult,
            completionRate: Math.round(completionRate * 100) / 100,
        };
    }
    async getAverageWatchDuration() {
        const watchLogResult = await this.watchLogRepo
            .createQueryBuilder('wl')
            .select('SUM(wl.watch_duration) / COUNT(DISTINCT wl.user_id)', 'avgDuration')
            .addSelect('SUM(wl.watch_duration)', 'totalDuration')
            .addSelect('COUNT(DISTINCT wl.user_id)', 'uniqueUsers')
            .getRawOne();
        const watchLogCount = parseInt(watchLogResult?.uniqueUsers || '0', 10);
        if (watchLogCount > 0) {
            const avgDuration = Math.round(parseFloat(watchLogResult?.avgDuration || '0'));
            const totalDuration = parseInt(watchLogResult?.totalDuration || '0', 10);
            const percentageResult = await this.watchLogRepo
                .createQueryBuilder('wl')
                .innerJoin('wl.episode', 'ep')
                .select('AVG(CASE WHEN ep.duration > 0 THEN (wl.watch_duration / ep.duration * 100) ELSE 0 END)', 'avgPercentage')
                .where('ep.duration > 0')
                .getRawOne();
            return {
                averageWatchProgress: avgDuration,
                averageWatchPercentage: Math.round(parseFloat(percentageResult?.avgPercentage || '0') * 100) / 100,
                totalWatchTime: totalDuration,
            };
        }
        const result = await this.wpRepo
            .createQueryBuilder('wp')
            .innerJoin('wp.episode', 'ep')
            .select('SUM(wp.stopAtSecond) / COUNT(DISTINCT wp.user_id)', 'avgProgress')
            .addSelect('AVG(CASE WHEN ep.duration > 0 THEN (wp.stopAtSecond / ep.duration * 100) ELSE 0 END)', 'avgPercentage')
            .addSelect('SUM(wp.stopAtSecond)', 'totalTime')
            .where('ep.duration > 0')
            .getRawOne();
        return {
            averageWatchProgress: Math.round(parseFloat(result?.avgProgress || '0')),
            averageWatchPercentage: Math.round(parseFloat(result?.avgPercentage || '0') * 100) / 100,
            totalWatchTime: parseInt(result?.totalTime || '0', 10),
        };
    }
    async getRegistrationStats(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const dailyStats = await this.userRepo
            .createQueryBuilder('u')
            .select("DATE_FORMAT(u.created_at, '%Y-%m-%d')", 'date')
            .addSelect('COUNT(*)', 'count')
            .where('u.created_at BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
        })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        const totalNewUsers = dailyStats.reduce((sum, item) => sum + parseInt(item.count, 10), 0);
        const dailyAverage = days > 0 ? Math.round(totalNewUsers / days) : 0;
        return {
            totalNewUsers,
            dailyAverage,
            trend: dailyStats.map(item => ({
                date: item.date,
                count: parseInt(item.count, 10),
            })),
        };
    }
    async getActiveUsersStats() {
        const today = new Date();
        const [dau, wau, mau] = await Promise.all([
            this.getDAU(today),
            this.getWAU(today),
            this.getMAU(today),
        ]);
        const last7DaysDAU = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dauValue = await this.getDAU(date);
            last7DaysDAU.push(dauValue);
        }
        const dau7DayAvg = Math.round(last7DaysDAU.reduce((a, b) => a + b, 0) / 7);
        const sticky = mau > 0 ? Math.round((dau / mau) * 100 * 100) / 100 : 0;
        return {
            dau,
            wau,
            mau,
            dau7DayAvg,
            sticky,
        };
    }
    async getContentPlayStats() {
        const playCountResult = await this.episodeRepo
            .createQueryBuilder('ep')
            .select('COALESCE(SUM(ep.play_count), 0)', 'total')
            .addSelect('COUNT(DISTINCT CASE WHEN ep.play_count > 0 THEN ep.id END)', 'uniqueCount')
            .addSelect('AVG(ep.play_count)', 'avgCount')
            .getRawOne();
        const totalPlayCount = parseInt(playCountResult?.total || '0', 10);
        const uniqueWatchedEpisodes = parseInt(playCountResult?.uniqueCount || '0', 10);
        const averagePlayCountPerEpisode = Math.round(parseFloat(playCountResult?.avgCount || '0'));
        const topEpisodes = await this.episodeRepo
            .createQueryBuilder('ep')
            .select(['ep.id', 'ep.shortId', 'ep.title', 'ep.playCount'])
            .orderBy('ep.play_count', 'DESC')
            .limit(10)
            .getMany();
        return {
            totalPlayCount,
            uniqueWatchedEpisodes,
            averagePlayCountPerEpisode,
            top10Episodes: topEpisodes.map(ep => ({
                episodeId: ep.id,
                shortId: ep.shortId,
                title: ep.title,
                playCount: ep.playCount || 0,
            })),
        };
    }
    async getComprehensiveStats() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const [activeUsers, retention1Day, retention7Day, contentStats, watchDuration, completionRate,] = await Promise.all([
            this.getActiveUsersStats(),
            this.getRetentionRate(1, yesterday),
            this.getRetentionRate(7, new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
            this.getContentPlayStats(),
            this.getAverageWatchDuration(),
            this.getCompletionRate(),
        ]);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        const yesterdayStart = new Date(yesterday);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        const [todayRegistrations, yesterdayRegistrations, last7DaysReg, last30DaysReg] = await Promise.all([
            this.userRepo.count({
                where: {
                    created_at: (0, typeorm_2.Between)(todayStart, todayEnd),
                },
            }),
            this.userRepo.count({
                where: {
                    created_at: (0, typeorm_2.Between)(yesterdayStart, yesterdayEnd),
                },
            }),
            this.userRepo.count({
                where: {
                    created_at: (0, typeorm_2.MoreThan)(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
                },
            }),
            this.userRepo.count({
                where: {
                    created_at: (0, typeorm_2.MoreThan)(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
                },
            }),
        ]);
        return {
            activeUsers,
            retention: {
                day1: retention1Day,
                day7: retention7Day,
            },
            content: {
                totalPlayCount: contentStats.totalPlayCount,
                uniqueWatchedEpisodes: contentStats.uniqueWatchedEpisodes,
                averagePlayCountPerEpisode: contentStats.averagePlayCountPerEpisode,
            },
            watching: {
                averageWatchProgress: watchDuration.averageWatchProgress,
                averageWatchPercentage: watchDuration.averageWatchPercentage,
                totalWatchTime: watchDuration.totalWatchTime,
                completionRate: completionRate.completionRate,
            },
            registration: {
                today: todayRegistrations,
                yesterday: yesterdayRegistrations,
                last7Days: last7DaysReg,
                last30Days: last30DaysReg,
            },
        };
    }
    async getOperationalMetrics(startDate, endDate) {
        const results = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const newUsers = await this.userRepo
                .createQueryBuilder('u')
                .where('u.created_at BETWEEN :start AND :end', {
                start: dayStart,
                end: dayEnd,
            })
                .getCount();
            const dau = await this.getDAU(currentDate);
            const watchTimeResult = await this.wpRepo
                .createQueryBuilder('wp')
                .innerJoin('wp.episode', 'ep')
                .select('AVG(wp.stop_at_second)', 'avgTime')
                .where('wp.updated_at BETWEEN :start AND :end', {
                start: dayStart,
                end: dayEnd,
            })
                .getRawOne();
            const averageWatchTime = Math.round(parseFloat(watchTimeResult?.avgTime || '0'));
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const retentionData = await this.getRetentionRate(1, currentDate);
            const nextDayRetention = parseFloat(retentionData.retentionRate.toFixed(2));
            const sourceDistribution = await this.userRepo
                .createQueryBuilder('u')
                .select('u.promo_code', 'promoCode')
                .addSelect('COUNT(*)', 'count')
                .where('u.created_at BETWEEN :start AND :end', {
                start: dayStart,
                end: dayEnd,
            })
                .groupBy('u.promo_code')
                .orderBy('count', 'DESC')
                .getRawMany();
            let newUserSource = '自然流量';
            if (sourceDistribution.length > 0) {
                const topSources = sourceDistribution
                    .filter(s => s.promoCode)
                    .slice(0, 3)
                    .map(s => `${s.promoCode}(${s.count})`)
                    .join(', ');
                newUserSource = topSources || '自然流量';
            }
            results.push({
                date: currentDate.toISOString().split('T')[0],
                newUsers,
                nextDayRetention,
                dau,
                averageWatchTime,
                newUserSource,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return results;
    }
    async getContentMetrics(startDate, endDate, limit = 100) {
        const results = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const episodeStats = await this.wpRepo
                .createQueryBuilder('wp')
                .innerJoin('wp.episode', 'ep')
                .select('ep.id', 'episodeId')
                .addSelect('ep.short_id', 'shortId')
                .addSelect('ep.title', 'title')
                .addSelect('COUNT(DISTINCT wp.user_id)', 'playCount')
                .addSelect('AVG(wp.stop_at_second)', 'avgWatchTime')
                .addSelect('ep.duration', 'duration')
                .addSelect('ep.like_count', 'likeCount')
                .addSelect('ep.favorite_count', 'favoriteCount')
                .where('wp.updated_at BETWEEN :start AND :end', {
                start: dayStart,
                end: dayEnd,
            })
                .groupBy('ep.id')
                .addGroupBy('ep.short_id')
                .addGroupBy('ep.title')
                .addGroupBy('ep.duration')
                .addGroupBy('ep.like_count')
                .addGroupBy('ep.favorite_count')
                .orderBy('playCount', 'DESC')
                .limit(limit)
                .getRawMany();
            for (const stat of episodeStats) {
                const playCount = parseInt(stat.playCount, 10);
                const avgWatchTime = Math.round(parseFloat(stat.avgWatchTime || '0'));
                const completionCount = await this.wpRepo
                    .createQueryBuilder('wp')
                    .where('wp.episode_id = :episodeId', { episodeId: stat.episodeId })
                    .andWhere('wp.updated_at BETWEEN :start AND :end', {
                    start: dayStart,
                    end: dayEnd,
                })
                    .andWhere('wp.stop_at_second >= :threshold', {
                    threshold: stat.duration * 0.9,
                })
                    .getCount();
                const completionRate = playCount > 0
                    ? parseFloat(((completionCount / playCount) * 100).toFixed(2))
                    : 0;
                results.push({
                    date: currentDate.toISOString().split('T')[0],
                    videoId: stat.shortId || stat.episodeId.toString(),
                    videoTitle: stat.title,
                    playCount,
                    completionRate,
                    averageWatchTime: avgWatchTime,
                    likeCount: stat.likeCount || 0,
                    shareCount: 0,
                    favoriteCount: stat.favoriteCount || 0,
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return results;
    }
    async getUserSourceStats(startDate, endDate) {
        const dayStart = new Date(startDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(endDate);
        dayEnd.setHours(23, 59, 59, 999);
        const promoStats = await this.userRepo
            .createQueryBuilder('u')
            .select('COALESCE(u.promo_code, "organic")', 'promoCode')
            .addSelect('COUNT(*)', 'totalUsers')
            .where('u.created_at BETWEEN :start AND :end', {
            start: dayStart,
            end: dayEnd,
        })
            .groupBy('promoCode')
            .orderBy('totalUsers', 'DESC')
            .getRawMany();
        const results = [];
        for (const stat of promoStats) {
            const totalUsers = parseInt(stat.totalUsers, 10);
            const activeUsersResult = await this.wpRepo
                .createQueryBuilder('wp')
                .innerJoin('wp.user', 'u')
                .select('COUNT(DISTINCT wp.user_id)', 'count')
                .where('u.created_at BETWEEN :start AND :end', {
                start: dayStart,
                end: dayEnd,
            })
                .andWhere('COALESCE(u.promo_code, "organic") = :promoCode', { promoCode: stat.promoCode })
                .getRawOne();
            const activeUsers = parseInt(activeUsersResult?.count || '0', 10);
            const conversionRate = totalUsers > 0 ? parseFloat(((activeUsers / totalUsers) * 100).toFixed(2)) : 0;
            results.push({
                promoCode: stat.promoCode,
                totalUsers,
                activeUsers,
                conversionRate,
            });
        }
        return results;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(2, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __param(3, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __param(4, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map
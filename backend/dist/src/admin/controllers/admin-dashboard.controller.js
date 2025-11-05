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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const refresh_token_entity_1 = require("../../auth/entity/refresh-token.entity");
const series_entity_1 = require("../../video/entity/series.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
const banner_entity_1 = require("../../video/entity/banner.entity");
const comment_entity_1 = require("../../video/entity/comment.entity");
const watch_progress_entity_1 = require("../../video/entity/watch-progress.entity");
const browse_history_entity_1 = require("../../video/entity/browse-history.entity");
const analytics_service_1 = require("../services/analytics.service");
function toDateStart(d) {
    if (!d)
        return undefined;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime()))
        return undefined;
    dt.setHours(0, 0, 0, 0);
    return dt;
}
function toDateEnd(d) {
    if (!d)
        return undefined;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime()))
        return undefined;
    dt.setHours(23, 59, 59, 999);
    return dt;
}
let AdminDashboardController = class AdminDashboardController {
    userRepo;
    rtRepo;
    seriesRepo;
    episodeRepo;
    bannerRepo;
    commentRepo;
    wpRepo;
    bhRepo;
    analyticsService;
    constructor(userRepo, rtRepo, seriesRepo, episodeRepo, bannerRepo, commentRepo, wpRepo, bhRepo, analyticsService) {
        this.userRepo = userRepo;
        this.rtRepo = rtRepo;
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
        this.bannerRepo = bannerRepo;
        this.commentRepo = commentRepo;
        this.wpRepo = wpRepo;
        this.bhRepo = bhRepo;
        this.analyticsService = analyticsService;
    }
    async overview(from, to) {
        const start = toDateStart(from);
        const end = toDateEnd(to);
        const now = new Date();
        const dayAgo = new Date(Date.now() - 24 * 3600 * 1000);
        const [usersTotal, seriesTotal, episodesTotal, bannersTotal, commentsTotal] = await Promise.all([
            this.userRepo.count(),
            this.seriesRepo.count(),
            this.episodeRepo.count(),
            this.bannerRepo.count(),
            this.commentRepo.count(),
        ]);
        const latestRt = await this.rtRepo.createQueryBuilder('rt')
            .orderBy('rt.created_at', 'DESC')
            .limit(1)
            .getOne();
        const activeLogins = await this.rtRepo
            .createQueryBuilder('rt')
            .where('rt.is_revoked = 0')
            .andWhere('rt.expires_at > :now', { now })
            .getCount();
        const newUsers24h = await this.userRepo
            .createQueryBuilder('u')
            .where('u.created_at > :dayAgo', { dayAgo })
            .getCount();
        const comments24h = await this.commentRepo
            .createQueryBuilder('c')
            .where('c.created_at > :dayAgo', { dayAgo })
            .getCount();
        const visits24h = await this.bhRepo
            .createQueryBuilder('bh')
            .where('bh.updated_at > :dayAgo', { dayAgo })
            .getCount();
        const playSumRaw = await this.episodeRepo
            .createQueryBuilder('ep')
            .select('COALESCE(SUM(ep.play_count), 0)', 'sum')
            .getRawOne();
        const totalPlayCount = Number(playSumRaw?.sum ?? 0);
        let range;
        if (start && end) {
            const [usersInRange, visitsInRange, playActiveInRange] = await Promise.all([
                this.userRepo
                    .createQueryBuilder('u')
                    .where('u.created_at BETWEEN :start AND :end', { start, end })
                    .getCount(),
                this.bhRepo
                    .createQueryBuilder('bh')
                    .where('bh.updated_at BETWEEN :start AND :end', { start, end })
                    .getCount(),
                this.wpRepo
                    .createQueryBuilder('wp')
                    .where('wp.updated_at BETWEEN :start AND :end', { start, end })
                    .getCount(),
            ]);
            range = { usersInRange, visitsInRange, playActiveInRange };
        }
        return {
            users: {
                total: usersTotal,
                new24h: newUsers24h,
                activeLogins,
                lastLoginAtLatest: latestRt?.createdAt ?? null,
            },
            series: { total: seriesTotal },
            episodes: { total: episodesTotal },
            banners: { total: bannersTotal },
            comments: { total: commentsTotal, new24h: comments24h },
            plays: { totalPlayCount, last24hVisits: visits24h },
            range,
        };
    }
    async timeseries(from, to) {
        const start = toDateStart(from) ?? new Date(Date.now() - 14 * 24 * 3600 * 1000);
        const end = toDateEnd(to) ?? new Date();
        const newUsers = await this.userRepo
            .createQueryBuilder('u')
            .select("DATE_FORMAT(u.created_at, '%Y-%m-%d')", 'date')
            .addSelect('COUNT(1)', 'value')
            .where('u.created_at BETWEEN :start AND :end', { start, end })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        const visits = await this.bhRepo
            .createQueryBuilder('bh')
            .select("DATE_FORMAT(bh.updated_at, '%Y-%m-%d')", 'date')
            .addSelect('COUNT(1)', 'value')
            .where('bh.updated_at BETWEEN :start AND :end', { start, end })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        const playActive = await this.wpRepo
            .createQueryBuilder('wp')
            .select("DATE_FORMAT(wp.updated_at, '%Y-%m-%d')", 'date')
            .addSelect('COUNT(1)', 'value')
            .where('wp.updated_at BETWEEN :start AND :end', { start, end })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        return {
            series: this.mergeSeries(['newUsers', 'visits', 'playActive'], [newUsers, visits, playActive]),
        };
    }
    mergeSeries(names, seriesArr) {
        const map = new Map();
        seriesArr.forEach((arr, idx) => {
            const name = names[idx];
            for (const row of arr) {
                const d = row.date;
                if (!map.has(d))
                    map.set(d, { date: d });
                const item = map.get(d);
                item[name] = Number(row.value);
            }
        });
        return Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
    }
    async top(metric = 'series_play', limit = 10, from, to) {
        const start = toDateStart(from);
        const end = toDateEnd(to);
        const take = Math.max(Number(limit) || 10, 1);
        if (metric === 'series_visit') {
            const qb = this.bhRepo
                .createQueryBuilder('bh')
                .select('bh.series_id', 'seriesId')
                .addSelect('COUNT(1)', 'visitCount')
                .groupBy('bh.series_id')
                .orderBy('visitCount', 'DESC')
                .limit(take);
            if (start && end)
                qb.where('bh.updated_at BETWEEN :start AND :end', { start, end });
            const rows = await qb.getRawMany();
            const ids = rows.map(r => r.seriesId);
            const series = ids.length ? await this.seriesRepo.findByIds(ids) : [];
            const dict = new Map(series.map(s => [s.id, s]));
            return { items: rows.map(r => ({ seriesId: r.seriesId, title: dict.get(r.seriesId)?.title || '', visitCount: Number(r.visitCount) })) };
        }
        const rows = await this.episodeRepo
            .createQueryBuilder('ep')
            .select('ep.series_id', 'seriesId')
            .addSelect('COALESCE(SUM(ep.play_count),0)', 'playCount')
            .groupBy('ep.series_id')
            .orderBy('playCount', 'DESC')
            .limit(take)
            .getRawMany();
        const ids = rows.map(r => r.seriesId);
        const series = ids.length ? await this.seriesRepo.findByIds(ids) : [];
        const dict = new Map(series.map(s => [s.id, s]));
        return { items: rows.map(r => ({ seriesId: r.seriesId, title: dict.get(r.seriesId)?.title || '', playCount: Number(r.playCount) })) };
    }
    async recent(limit = 10) {
        const take = Math.max(Number(limit) || 10, 1);
        const [users, series, episodes, comments] = await Promise.all([
            this.userRepo.find({ order: { created_at: 'DESC' }, take }),
            this.seriesRepo.find({ order: { id: 'DESC' }, take }),
            this.episodeRepo.find({ order: { id: 'DESC' }, take }),
            this.commentRepo.find({ order: { createdAt: 'DESC' }, take }),
        ]);
        return { users, series, episodes, comments };
    }
    async getStats() {
        try {
            const stats = await this.analyticsService.getComprehensiveStats();
            return {
                code: 200,
                data: stats,
                message: '数据统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取统计数据失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getActiveUsers() {
        try {
            const stats = await this.analyticsService.getActiveUsersStats();
            return {
                code: 200,
                data: stats,
                message: '活跃用户统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取活跃用户统计失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getRetention(retentionDays, cohortDate) {
        try {
            const days = parseInt(retentionDays || '1', 10);
            const date = cohortDate ? new Date(cohortDate) : undefined;
            const stats = await this.analyticsService.getRetentionRate(days, date);
            return {
                code: 200,
                data: stats,
                message: '留存率统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取留存率失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getRetentionTrend(days, retentionDays) {
        try {
            const daysNum = parseInt(days || '7', 10);
            const retentionDaysNum = parseInt(retentionDays || '1', 10);
            const stats = await this.analyticsService.getRetentionTrend(daysNum, retentionDaysNum);
            return {
                code: 200,
                data: stats,
                message: '留存率趋势获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取留存率趋势失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getContentStats() {
        try {
            const stats = await this.analyticsService.getContentPlayStats();
            return {
                code: 200,
                data: stats,
                message: '内容播放统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取内容播放统计失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getWatchStats() {
        try {
            const [duration, completion] = await Promise.all([
                this.analyticsService.getAverageWatchDuration(),
                this.analyticsService.getCompletionRate(),
            ]);
            return {
                code: 200,
                data: {
                    ...duration,
                    ...completion,
                },
                message: '观看统计获取成功',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                code: 500,
                data: null,
                message: `获取观看统计失败: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('timeseries'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "timeseries", null);
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Query)('metric')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "top", null);
__decorate([
    (0, common_1.Get)('recent-activities'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "recent", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('active-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getActiveUsers", null);
__decorate([
    (0, common_1.Get)('retention'),
    __param(0, (0, common_1.Query)('retentionDays')),
    __param(1, (0, common_1.Query)('cohortDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getRetention", null);
__decorate([
    (0, common_1.Get)('retention-trend'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('retentionDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getRetentionTrend", null);
__decorate([
    (0, common_1.Get)('content-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getContentStats", null);
__decorate([
    (0, common_1.Get)('watch-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getWatchStats", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin/dashboard'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(2, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(3, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(4, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __param(5, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(6, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(7, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        analytics_service_1.AnalyticsService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map
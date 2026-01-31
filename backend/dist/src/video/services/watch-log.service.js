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
exports.WatchLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_log_entity_1 = require("../entity/watch-log.entity");
let WatchLogService = class WatchLogService {
    watchLogRepo;
    constructor(watchLogRepo) {
        this.watchLogRepo = watchLogRepo;
    }
    async logWatch(userId, episodeId, startPosition, endPosition, watchDate) {
        const watchDuration = Math.max(0, endPosition - startPosition);
        const logDate = watchDate || new Date();
        logDate.setHours(0, 0, 0, 0);
        const watchLog = this.watchLogRepo.create({
            userId,
            episodeId,
            watchDuration,
            startPosition,
            endPosition,
            watchDate: logDate,
        });
        return await this.watchLogRepo.save(watchLog);
    }
    async getUserWatchLogs(userId, startDate, endDate) {
        return await this.watchLogRepo.find({
            where: {
                userId,
                watchDate: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['episode'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUserDailyWatchDuration(userId, date) {
        const dateStr = date.toISOString().split('T')[0];
        const result = await this.watchLogRepo
            .createQueryBuilder('wl')
            .select('SUM(wl.watch_duration)', 'totalDuration')
            .where('wl.user_id = :userId', { userId })
            .andWhere('wl.watch_date = :date', { date: dateStr })
            .getRawOne();
        return parseInt(result?.totalDuration || '0', 10);
    }
    async getEpisodeWatchStats(episodeId, startDate, endDate) {
        const result = await this.watchLogRepo
            .createQueryBuilder('wl')
            .select('SUM(wl.watch_duration)', 'totalDuration')
            .addSelect('COUNT(DISTINCT wl.user_id)', 'totalWatchers')
            .where('wl.episode_id = :episodeId', { episodeId })
            .andWhere('wl.watch_date BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        })
            .getRawOne();
        const totalDuration = parseInt(result?.totalDuration || '0', 10);
        const totalWatchers = parseInt(result?.totalWatchers || '0', 10);
        return {
            totalWatchDuration: totalDuration,
            totalWatchers,
            avgWatchDuration: totalWatchers > 0 ? Math.round(totalDuration / totalWatchers) : 0,
        };
    }
    async getDailyWatchStats(startDate, endDate) {
        const results = await this.watchLogRepo
            .createQueryBuilder('wl')
            .select('wl.watch_date', 'date')
            .addSelect('SUM(wl.watch_duration)', 'totalDuration')
            .addSelect('COUNT(DISTINCT wl.user_id)', 'dau')
            .where('wl.watch_date BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        })
            .groupBy('wl.watch_date')
            .orderBy('wl.watch_date', 'ASC')
            .getRawMany();
        return results.map(row => {
            const totalDuration = parseInt(row.totalDuration || '0', 10);
            const dau = parseInt(row.dau || '0', 10);
            return {
                date: row.date,
                totalWatchDuration: totalDuration,
                dau,
                avgWatchDuration: dau > 0 ? Math.round(totalDuration / dau) : 0,
            };
        });
    }
    async getSeriesWatchStats(seriesId, startDate, endDate) {
        const result = await this.watchLogRepo
            .createQueryBuilder('wl')
            .innerJoin('wl.episode', 'ep')
            .select('SUM(wl.watch_duration)', 'totalDuration')
            .addSelect('COUNT(DISTINCT wl.user_id)', 'totalWatchers')
            .where('ep.series_id = :seriesId', { seriesId })
            .andWhere('wl.watch_date BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        })
            .getRawOne();
        const totalDuration = parseInt(result?.totalDuration || '0', 10);
        const totalWatchers = parseInt(result?.totalWatchers || '0', 10);
        return {
            totalWatchDuration: totalDuration,
            totalWatchers,
            avgWatchDuration: totalWatchers > 0 ? Math.round(totalDuration / totalWatchers) : 0,
        };
    }
};
exports.WatchLogService = WatchLogService;
exports.WatchLogService = WatchLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WatchLogService);
//# sourceMappingURL=watch-log.service.js.map
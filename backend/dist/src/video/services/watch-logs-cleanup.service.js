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
var WatchLogsCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchLogsCleanupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_log_entity_1 = require("../entity/watch-log.entity");
let WatchLogsCleanupService = WatchLogsCleanupService_1 = class WatchLogsCleanupService {
    watchLogRepo;
    logger = new common_1.Logger(WatchLogsCleanupService_1.name);
    constructor(watchLogRepo) {
        this.watchLogRepo = watchLogRepo;
    }
    async scheduledArchiveOldLogs() {
        this.logger.log('开始执行定时归档任务...');
        try {
            const result = await this.archiveOldLogs(365);
            this.logger.log(`定时归档任务完成: 归档了 ${result.archivedCount} 条记录，删除了 ${result.deletedCount} 条记录，耗时 ${result.duration}ms`);
        }
        catch (error) {
            this.logger.error('定时归档任务执行失败:', error);
        }
    }
    async archiveOldLogs(daysToKeep = 365, archiveBeforeDelete = false) {
        const startTime = Date.now();
        this.logger.log(`开始归档 ${daysToKeep} 天前的观看日志...`);
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            cutoffDate.setHours(0, 0, 0, 0);
            let archivedCount = 0;
            let deletedCount = 0;
            const oldLogsCount = await this.watchLogRepo.count({
                where: {
                    watchDate: (0, typeorm_2.LessThan)(cutoffDate),
                },
            });
            if (oldLogsCount === 0) {
                this.logger.log('没有需要归档的观看日志');
                return {
                    archivedCount: 0,
                    deletedCount: 0,
                    duration: Date.now() - startTime,
                };
            }
            this.logger.log(`发现 ${oldLogsCount} 条需要归档的观看日志`);
            if (archiveBeforeDelete) {
                try {
                    await this.createArchiveTableIfNotExists();
                    const archiveResult = await this.watchLogRepo.query(`
            INSERT INTO watch_logs_archive 
            SELECT * FROM watch_logs 
            WHERE watch_date < ?
          `, [cutoffDate]);
                    archivedCount = archiveResult?.affectedRows || 0;
                    this.logger.log(`已归档 ${archivedCount} 条观看日志到 watch_logs_archive 表`);
                }
                catch (error) {
                    this.logger.error('归档数据失败，跳过归档步骤:', error);
                }
            }
            const deleteResult = await this.watchLogRepo.delete({
                watchDate: (0, typeorm_2.LessThan)(cutoffDate),
            });
            deletedCount = deleteResult.affected || 0;
            this.logger.log(`已删除 ${deletedCount} 条旧的观看日志`);
            const duration = Date.now() - startTime;
            return {
                archivedCount,
                deletedCount,
                duration,
            };
        }
        catch (error) {
            this.logger.error('归档旧日志失败:', error);
            throw error;
        }
    }
    async createArchiveTableIfNotExists() {
        try {
            await this.watchLogRepo.query(`
        CREATE TABLE IF NOT EXISTS watch_logs_archive (
          id bigint NOT NULL,
          user_id bigint NOT NULL,
          episode_id int NOT NULL,
          watch_duration int NOT NULL DEFAULT 0,
          start_position int NOT NULL DEFAULT 0,
          end_position int NOT NULL DEFAULT 0,
          watch_date date NOT NULL,
          created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          KEY idx_user_watch_date (user_id, watch_date),
          KEY idx_episode_watch_date (episode_id, watch_date),
          KEY idx_watch_date (watch_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='观看日志归档表'
      `);
            this.logger.log('归档表 watch_logs_archive 准备完成');
        }
        catch (error) {
            this.logger.error('创建归档表失败:', error);
            throw error;
        }
    }
    async getCleanupStats() {
        try {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const sixMonthsAgo = new Date(now);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const [totalLogs, logsOlderThan1Year, logsOlderThan6Months, logsOlderThan3Months,] = await Promise.all([
                this.watchLogRepo.count(),
                this.watchLogRepo.count({ where: { watchDate: (0, typeorm_2.LessThan)(oneYearAgo) } }),
                this.watchLogRepo.count({ where: { watchDate: (0, typeorm_2.LessThan)(sixMonthsAgo) } }),
                this.watchLogRepo.count({ where: { watchDate: (0, typeorm_2.LessThan)(threeMonthsAgo) } }),
            ]);
            let oldestLogDate = null;
            let newestLogDate = null;
            if (totalLogs > 0) {
                const oldestLog = await this.watchLogRepo
                    .createQueryBuilder('log')
                    .select('log.watchDate')
                    .orderBy('log.watchDate', 'ASC')
                    .limit(1)
                    .getOne();
                const newestLog = await this.watchLogRepo
                    .createQueryBuilder('log')
                    .select('log.watchDate')
                    .orderBy('log.watchDate', 'DESC')
                    .limit(1)
                    .getOne();
                oldestLogDate = oldestLog?.watchDate || null;
                newestLogDate = newestLog?.watchDate || null;
            }
            return {
                totalLogs,
                logsOlderThan1Year,
                logsOlderThan6Months,
                logsOlderThan3Months,
                oldestLogDate,
                newestLogDate,
            };
        }
        catch (error) {
            this.logger.error('获取清理统计信息失败:', error);
            throw error;
        }
    }
    async manualArchive(daysToKeep = 365, archiveBeforeDelete = false) {
        this.logger.log(`手动触发归档任务: 保留最近 ${daysToKeep} 天的数据，归档模式: ${archiveBeforeDelete ? '归档后删除' : '直接删除'}`);
        try {
            const result = await this.archiveOldLogs(daysToKeep, archiveBeforeDelete);
            return {
                success: true,
                message: `归档任务完成: 归档了 ${result.archivedCount} 条记录，删除了 ${result.deletedCount} 条记录`,
                archivedCount: result.archivedCount,
                deletedCount: result.deletedCount,
                duration: result.duration,
            };
        }
        catch (error) {
            this.logger.error('手动归档任务执行失败:', error);
            return {
                success: false,
                message: `归档任务失败: ${error instanceof Error ? error.message : String(error)}`,
                archivedCount: 0,
                deletedCount: 0,
                duration: 0,
            };
        }
    }
};
exports.WatchLogsCleanupService = WatchLogsCleanupService;
exports.WatchLogsCleanupService = WatchLogsCleanupService = WatchLogsCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WatchLogsCleanupService);
//# sourceMappingURL=watch-logs-cleanup.service.js.map
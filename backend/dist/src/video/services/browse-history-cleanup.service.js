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
var BrowseHistoryCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseHistoryCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const browse_history_entity_1 = require("../entity/browse-history.entity");
let BrowseHistoryCleanupService = BrowseHistoryCleanupService_1 = class BrowseHistoryCleanupService {
    browseHistoryRepo;
    logger = new common_1.Logger(BrowseHistoryCleanupService_1.name);
    MAX_RECORDS_PER_USER = 100;
    constructor(browseHistoryRepo) {
        this.browseHistoryRepo = browseHistoryRepo;
    }
    async cleanupExcessBrowseHistory() {
        this.logger.log('开始执行浏览记录清理任务...');
        try {
            const startTime = Date.now();
            const usersWithHistory = await this.getUsersWithBrowseHistory();
            let totalCleanedRecords = 0;
            let processedUsers = 0;
            for (const userId of usersWithHistory) {
                const cleanedCount = await this.cleanupUserBrowseHistory(userId);
                totalCleanedRecords += cleanedCount;
                processedUsers++;
                if (processedUsers % 100 === 0) {
                    this.logger.log(`已处理 ${processedUsers} 个用户的浏览记录`);
                }
            }
            const duration = Date.now() - startTime;
            this.logger.log(`浏览记录清理任务完成: 处理了 ${processedUsers} 个用户，清理了 ${totalCleanedRecords} 条记录，耗时 ${duration}ms`);
        }
        catch (error) {
            this.logger.error('浏览记录清理任务执行失败:', error);
        }
    }
    async getUsersWithBrowseHistory() {
        const result = await this.browseHistoryRepo
            .createQueryBuilder('bh')
            .select('DISTINCT bh.userId', 'userId')
            .getRawMany();
        return result.map(row => row.userId);
    }
    async cleanupUserBrowseHistory(userId) {
        try {
            const totalCount = await this.browseHistoryRepo.count({
                where: { userId }
            });
            if (totalCount <= this.MAX_RECORDS_PER_USER) {
                return 0;
            }
            const recordsToDelete = totalCount - this.MAX_RECORDS_PER_USER;
            const recordsToDeleteIds = await this.browseHistoryRepo
                .createQueryBuilder('bh')
                .select('bh.id')
                .where('bh.userId = :userId', { userId })
                .orderBy('bh.updatedAt', 'ASC')
                .limit(recordsToDelete)
                .getMany();
            if (recordsToDeleteIds.length === 0) {
                return 0;
            }
            const deleteResult = await this.browseHistoryRepo
                .createQueryBuilder()
                .delete()
                .where('id IN (:...ids)', {
                ids: recordsToDeleteIds.map(record => record.id)
            })
                .execute();
            const deletedCount = deleteResult.affected || 0;
            if (deletedCount > 0) {
                this.logger.debug(`用户 ${userId} 清理了 ${deletedCount} 条浏览记录 (原总数: ${totalCount})`);
            }
            return deletedCount;
        }
        catch (error) {
            this.logger.error(`清理用户 ${userId} 浏览记录失败:`, error);
            return 0;
        }
    }
    async manualCleanup() {
        this.logger.log('手动触发浏览记录清理任务...');
        const startTime = Date.now();
        try {
            const usersWithHistory = await this.getUsersWithBrowseHistory();
            let totalCleanedRecords = 0;
            let processedUsers = 0;
            for (const userId of usersWithHistory) {
                const cleanedCount = await this.cleanupUserBrowseHistory(userId);
                totalCleanedRecords += cleanedCount;
                processedUsers++;
            }
            const duration = Date.now() - startTime;
            this.logger.log(`手动清理任务完成: 处理了 ${processedUsers} 个用户，清理了 ${totalCleanedRecords} 条记录，耗时 ${duration}ms`);
            return {
                processedUsers,
                totalCleanedRecords,
                duration
            };
        }
        catch (error) {
            this.logger.error('手动清理任务执行失败:', error);
            throw error;
        }
    }
    async getCleanupStats() {
        try {
            const usersWithHistory = await this.getUsersWithBrowseHistory();
            const totalUsers = usersWithHistory.length;
            let usersWithExcessRecords = 0;
            let totalExcessRecords = 0;
            for (const userId of usersWithHistory) {
                const userRecordCount = await this.browseHistoryRepo.count({
                    where: { userId }
                });
                if (userRecordCount > this.MAX_RECORDS_PER_USER) {
                    usersWithExcessRecords++;
                    totalExcessRecords += (userRecordCount - this.MAX_RECORDS_PER_USER);
                }
            }
            return {
                totalUsers,
                usersWithExcessRecords,
                totalExcessRecords,
                maxRecordsPerUser: this.MAX_RECORDS_PER_USER
            };
        }
        catch (error) {
            this.logger.error('获取清理统计信息失败:', error);
            throw error;
        }
    }
};
exports.BrowseHistoryCleanupService = BrowseHistoryCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseHistoryCleanupService.prototype, "cleanupExcessBrowseHistory", null);
exports.BrowseHistoryCleanupService = BrowseHistoryCleanupService = BrowseHistoryCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BrowseHistoryCleanupService);
//# sourceMappingURL=browse-history-cleanup.service.js.map
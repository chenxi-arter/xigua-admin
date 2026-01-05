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
var GuestCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const guest_service_1 = require("./guest.service");
let GuestCleanupService = GuestCleanupService_1 = class GuestCleanupService {
    guestService;
    logger = new common_1.Logger(GuestCleanupService_1.name);
    constructor(guestService) {
        this.guestService = guestService;
    }
    async handleDailyCleanup() {
        this.logger.log('开始执行每日游客清理任务');
        try {
            const result = await this.guestService.cleanInactiveGuests(90, 30);
            this.logger.log(`每日清理任务完成: ${result.message}, 清理数量: ${result.deactivated}`);
            if (result.deactivated > 0) {
                this.logger.warn(`今日清理了 ${result.deactivated} 个不活跃游客`);
            }
        }
        catch (error) {
            this.logger.error(`每日清理任务失败: ${error.message}`, error.stack);
        }
    }
    async handleWeeklyStatistics() {
        this.logger.log('开始执行每周游客统计任务');
        try {
            const stats = await this.guestService.getGuestStatistics();
            this.logger.log('每周游客统计:', {
                总游客数: stats.totalGuests,
                活跃游客: stats.activeGuests,
                不活跃游客: stats.inactiveGuests,
                已转化游客: stats.convertedGuests,
                转化率: stats.conversionRate,
            });
        }
        catch (error) {
            this.logger.error(`每周统计任务失败: ${error.message}`, error.stack);
        }
    }
    async manualCleanup(inactiveDays = 90, recentActivityDays = 30) {
        this.logger.log('手动触发清理任务');
        return this.guestService.cleanInactiveGuests(inactiveDays, recentActivityDays);
    }
};
exports.GuestCleanupService = GuestCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestCleanupService.prototype, "handleDailyCleanup", null);
__decorate([
    (0, schedule_1.Cron)('0 4 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestCleanupService.prototype, "handleWeeklyStatistics", null);
exports.GuestCleanupService = GuestCleanupService = GuestCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestCleanupService);
//# sourceMappingURL=guest-cleanup.service.js.map
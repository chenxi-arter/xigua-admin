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
exports.BrowseHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const browse_history_entity_1 = require("../entity/browse-history.entity");
const series_entity_1 = require("../entity/series.entity");
const user_entity_1 = require("../../user/entity/user.entity");
let BrowseHistoryService = class BrowseHistoryService {
    browseHistoryRepo;
    seriesRepo;
    userRepo;
    cacheManager;
    constructor(browseHistoryRepo, seriesRepo, userRepo, cacheManager) {
        this.browseHistoryRepo = browseHistoryRepo;
        this.seriesRepo = seriesRepo;
        this.userRepo = userRepo;
        this.cacheManager = cacheManager;
    }
    async recordBrowseHistory(userId, seriesId, browseType = 'episode_list', lastEpisodeNumber = null, req) {
        try {
            await this.checkUserOperationLimit(userId);
            if (req) {
                await this.checkIpBlacklist(req);
            }
            if (!seriesId || seriesId <= 0) {
                throw new Error('无效的剧集系列ID');
            }
            if (lastEpisodeNumber !== null && (lastEpisodeNumber <= 0 || lastEpisodeNumber > 10000)) {
                throw new Error('无效的集数');
            }
            let browseHistory = await this.browseHistoryRepo.findOne({
                where: {
                    userId,
                    seriesId,
                    browseType
                }
            });
            if (browseHistory) {
                browseHistory.visitCount += 1;
                browseHistory.updatedAt = new Date();
                if (lastEpisodeNumber !== undefined) {
                    browseHistory.lastEpisodeNumber = lastEpisodeNumber === undefined ? null : lastEpisodeNumber;
                }
                if (req) {
                    browseHistory.userAgent = req.headers['user-agent'] || browseHistory.userAgent;
                    browseHistory.ipAddress = this.getClientIp(req) || browseHistory.ipAddress;
                }
            }
            else {
                browseHistory = new browse_history_entity_1.BrowseHistory();
                browseHistory.userId = userId;
                browseHistory.seriesId = seriesId;
                browseHistory.browseType = browseType;
                browseHistory.lastEpisodeNumber = lastEpisodeNumber;
                browseHistory.userAgent = req?.headers['user-agent'] || null;
                browseHistory.ipAddress = req ? this.getClientIp(req) : null;
                browseHistory.visitCount = 1;
            }
            await this.browseHistoryRepo.save(browseHistory);
            await this.clearBrowseHistoryCache(userId);
        }
        catch (error) {
            console.error('记录浏览历史失败:', error);
        }
    }
    async getUserBrowseHistory(userId, page = 1, size = 20) {
        try {
            const cacheKey = `browse_history_${userId}_${page}_${size}`;
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const offset = (page - 1) * size;
            const [browseHistories, total] = await this.browseHistoryRepo
                .createQueryBuilder('bh')
                .where('bh.userId = :userId', { userId })
                .orderBy('bh.updatedAt', 'DESC')
                .skip(offset)
                .take(size)
                .getManyAndCount();
            const result = {
                list: browseHistories.map(bh => ({
                    id: bh.id,
                    seriesId: bh.seriesId,
                    seriesTitle: `系列${bh.seriesId}`,
                    seriesShortId: '',
                    seriesCoverUrl: '',
                    categoryName: '',
                    browseType: bh.browseType,
                    lastEpisodeNumber: bh.lastEpisodeNumber,
                    visitCount: bh.visitCount,
                    lastVisitTime: bh.updatedAt,
                    durationSeconds: bh.durationSeconds
                })),
                total,
                page,
                size,
                hasMore: total > page * size
            };
            await this.cacheManager.set(cacheKey, result, 300000);
            return result;
        }
        catch (error) {
            console.error('获取浏览历史失败:', error);
            throw new Error('获取浏览历史失败');
        }
    }
    async getRecentBrowsedSeries(userId, limit = 10) {
        try {
            const cacheKey = `recent_browsed_${userId}_${limit}`;
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const recentBrowsed = await this.browseHistoryRepo
                .createQueryBuilder('bh')
                .where('bh.userId = :userId', { userId })
                .orderBy('bh.updatedAt', 'DESC')
                .take(limit)
                .getMany();
            const result = recentBrowsed.map(bh => ({
                seriesId: bh.seriesId,
                seriesTitle: `系列${bh.seriesId}`,
                seriesShortId: '',
                seriesCoverUrl: '',
                categoryName: '',
                lastEpisodeNumber: bh.lastEpisodeNumber,
                lastVisitTime: bh.updatedAt,
                visitCount: bh.visitCount
            }));
            await this.cacheManager.set(cacheKey, result, 180000);
            return result;
        }
        catch (error) {
            console.error('获取最近浏览失败:', error);
            return [];
        }
    }
    async cleanupExpiredBrowseHistory() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await this.browseHistoryRepo
                .createQueryBuilder()
                .delete()
                .where('updated_at < :date', { date: thirtyDaysAgo })
                .execute();
            console.log(`清理了 ${result.affected} 条过期浏览记录`);
        }
        catch (error) {
            console.error('清理过期浏览记录失败:', error);
        }
    }
    async getSystemStats() {
        try {
            const totalRecords = await this.browseHistoryRepo.count();
            const activeUsers = await this.browseHistoryRepo
                .createQueryBuilder('bh')
                .select('COUNT(DISTINCT bh.userId)', 'count')
                .where('bh.updatedAt > :date', {
                date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            })
                .getRawOne();
            return {
                totalRecords,
                activeUsers: parseInt(activeUsers?.count || '0'),
                totalOperations: 0
            };
        }
        catch (error) {
            console.error('获取系统统计信息失败:', error);
            return {
                totalRecords: 0,
                activeUsers: 0,
                totalOperations: 0
            };
        }
    }
    async clearBrowseHistoryCache(userId) {
        try {
            const patterns = [
                `browse_history_${userId}_*`,
                `recent_browsed_${userId}_*`
            ];
            for (const pattern of patterns) {
                await this.cacheManager.del(pattern);
            }
        }
        catch (error) {
            console.error('清除浏览历史缓存失败:', error);
        }
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
        }
        const realIp = req.headers['x-real-ip'];
        if (realIp) {
            return Array.isArray(realIp) ? realIp[0] : realIp;
        }
        return req.socket?.remoteAddress || null;
    }
    async checkIpBlacklist(req) {
        try {
            const ip = this.getClientIp(req);
            if (!ip)
                return;
            const blacklistKey = `ip_blacklist_${ip}`;
            const isBlacklisted = await this.cacheManager.get(blacklistKey);
            if (isBlacklisted) {
                throw new Error('IP地址已被限制访问');
            }
            const ipOperationKey = `ip_operation_${ip}`;
            const ipOperationCount = await this.cacheManager.get(ipOperationKey) || 0;
            if (ipOperationCount >= 50) {
                await this.cacheManager.set(blacklistKey, true, 300000);
                throw new Error('IP地址操作过于频繁，已被临时限制');
            }
            await this.cacheManager.set(ipOperationKey, ipOperationCount + 1, 60000);
        }
        catch (error) {
            if (error.message.includes('IP地址')) {
                throw error;
            }
            console.error('检查IP黑名单失败:', error);
        }
    }
    async checkUserOperationLimit(userId) {
        try {
            const cacheKey = `user_operation_limit_${userId}`;
            const operationCount = await this.cacheManager.get(cacheKey) || 0;
            if (operationCount >= 10) {
                throw new Error('操作过于频繁，请稍后再试');
            }
            await this.cacheManager.set(cacheKey, operationCount + 1, 60000);
        }
        catch (error) {
            if (error.message === '操作过于频繁，请稍后再试') {
                throw error;
            }
            console.error('检查用户操作限制失败:', error);
        }
    }
    async deleteBrowseHistory(userId, seriesId) {
        try {
            await this.checkUserOperationLimit(userId);
            if (seriesId) {
                const result = await this.browseHistoryRepo.delete({
                    userId,
                    seriesId
                });
                if (result.affected === 0) {
                    throw new Error('浏览记录不存在或已被删除');
                }
            }
            else {
                const count = await this.browseHistoryRepo.count({
                    where: { userId }
                });
                if (count > 100) {
                    throw new Error('浏览记录数量过多，请分批删除');
                }
                await this.browseHistoryRepo.delete({
                    userId
                });
            }
            await this.clearBrowseHistoryCache(userId);
        }
        catch (error) {
            console.error('删除浏览历史失败:', error);
            throw new Error(error.message || '删除浏览历史失败');
        }
    }
    async findSeriesByShortId(shortId) {
        try {
            return await this.seriesRepo.findOne({
                where: { shortId }
            });
        }
        catch (error) {
            console.error('通过ShortID查找系列失败:', error);
            return null;
        }
    }
};
exports.BrowseHistoryService = BrowseHistoryService;
exports.BrowseHistoryService = BrowseHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], BrowseHistoryService);
//# sourceMappingURL=browse-history.service.js.map
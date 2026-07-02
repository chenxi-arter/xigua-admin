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
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const refresh_token_entity_1 = require("../../auth/entity/refresh-token.entity");
const watch_log_entity_1 = require("../../video/entity/watch-log.entity");
const user_online_daily_entity_1 = require("../../user/entity/user-online-daily.entity");
const redis_module_1 = require("../../core/redis/redis.module");
const admin_jwt_auth_guard_1 = require("../guards/admin-jwt-auth.guard");
let AdminUsersController = class AdminUsersController {
    userRepo;
    refreshTokenRepo;
    watchLogRepo;
    onlineDailyRepo;
    redisClient;
    constructor(userRepo, refreshTokenRepo, watchLogRepo, onlineDailyRepo, redisClient) {
        this.userRepo = userRepo;
        this.refreshTokenRepo = refreshTokenRepo;
        this.watchLogRepo = watchLogRepo;
        this.onlineDailyRepo = onlineDailyRepo;
        this.redisClient = redisClient;
    }
    async list(page = 1, size = 20, startDate, endDate, loginCount, minLoginCount, maxLoginCount, watchDurationRange, minWatchMinutes, maxWatchMinutes, onlineDurationRange, minOnlineMinutes, maxOnlineMinutes, minOnlineDays, maxOnlineDays) {
        const take = Math.max(Number(size) || 20, 1);
        const currentPage = Math.max(Number(page) || 1, 1);
        const skip = (currentPage - 1) * take;
        const now = new Date();
        const parsedStartDate = this.parseDateBoundary(startDate, 'start');
        const parsedEndDate = this.parseDateBoundary(endDate, 'end');
        const startDateOnly = parsedStartDate ? this.formatDateOnly(parsedStartDate) : null;
        const endDateOnly = parsedEndDate ? this.formatDateOnly(this.toExclusiveDateOnlyBoundary(parsedEndDate)) : null;
        const queryBuilder = this.userRepo.createQueryBuilder('u')
            .leftJoin(qb => {
            const loginQb = qb
                .select('rt.user_id', 'userId')
                .addSelect('COUNT(*)', 'loginCount')
                .addSelect('MAX(rt.created_at)', 'lastLoginAt')
                .from(refresh_token_entity_1.RefreshToken, 'rt');
            if (parsedStartDate) {
                loginQb.where('rt.created_at >= :loginStartDate', { loginStartDate: parsedStartDate });
            }
            if (parsedEndDate) {
                if (parsedStartDate) {
                    loginQb.andWhere('rt.created_at < :loginEndDate', { loginEndDate: parsedEndDate });
                }
                else {
                    loginQb.where('rt.created_at < :loginEndDate', { loginEndDate: parsedEndDate });
                }
            }
            return loginQb.groupBy('rt.user_id');
        }, 'login_stats', 'login_stats.userId = u.id')
            .leftJoin(qb => qb
            .select('art.user_id', 'userId')
            .addSelect('COUNT(*)', 'activeLogins')
            .from(refresh_token_entity_1.RefreshToken, 'art')
            .where('art.is_revoked = 0')
            .andWhere('art.expires_at > :now', { now })
            .groupBy('art.user_id'), 'active_login_stats', 'active_login_stats.userId = u.id')
            .leftJoin(qb => {
            const watchQb = qb
                .select('wl.user_id', 'userId')
                .addSelect('COALESCE(SUM(wl.watch_duration), 0)', 'totalWatchDuration')
                .addSelect('MAX(wl.created_at)', 'lastActiveAt')
                .from(watch_log_entity_1.WatchLog, 'wl');
            if (parsedStartDate) {
                watchQb.where('wl.created_at >= :watchStartDate', { watchStartDate: parsedStartDate });
            }
            if (parsedEndDate) {
                if (parsedStartDate) {
                    watchQb.andWhere('wl.created_at < :watchEndDate', { watchEndDate: parsedEndDate });
                }
                else {
                    watchQb.where('wl.created_at < :watchEndDate', { watchEndDate: parsedEndDate });
                }
            }
            return watchQb.groupBy('wl.user_id');
        }, 'watch_stats', 'watch_stats.userId = u.id')
            .leftJoin(qb => {
            const onlineQb = qb
                .select('od.user_id', 'userId')
                .addSelect('COALESCE(SUM(od.duration), 0)', 'totalOnlineDuration')
                .addSelect('COUNT(*)', 'onlineDays')
                .from(user_online_daily_entity_1.UserOnlineDaily, 'od')
                .where('od.duration > 0');
            if (startDateOnly) {
                onlineQb.andWhere('od.date >= :onlineStartDate', { onlineStartDate: startDateOnly });
            }
            if (endDateOnly) {
                onlineQb.andWhere('od.date < :onlineEndDate', { onlineEndDate: endDateOnly });
            }
            return onlineQb.groupBy('od.user_id');
        }, 'online_stats', 'online_stats.userId = u.id')
            .addSelect('COALESCE(login_stats.loginCount, 0)', 'loginCount')
            .addSelect('login_stats.lastLoginAt', 'lastLoginAt')
            .addSelect('COALESCE(active_login_stats.activeLogins, 0)', 'activeLogins')
            .addSelect('COALESCE(watch_stats.totalWatchDuration, 0)', 'totalWatchDuration')
            .addSelect('watch_stats.lastActiveAt', 'lastActiveAt')
            .addSelect('COALESCE(online_stats.totalOnlineDuration, 0)', 'totalOnlineDuration')
            .addSelect('COALESCE(online_stats.onlineDays, 0)', 'onlineDays')
            .orderBy('u.id', 'DESC');
        const exactLoginCount = this.parseOptionalNumber(loginCount);
        const loginCountMin = this.parseOptionalNumber(minLoginCount);
        const loginCountMax = this.parseOptionalNumber(maxLoginCount);
        if (exactLoginCount !== null) {
            queryBuilder.andWhere('COALESCE(login_stats.loginCount, 0) = :loginCount', { loginCount: exactLoginCount });
        }
        if (loginCountMin !== null) {
            queryBuilder.andWhere('COALESCE(login_stats.loginCount, 0) >= :minLoginCount', { minLoginCount: loginCountMin });
        }
        if (loginCountMax !== null) {
            queryBuilder.andWhere('COALESCE(login_stats.loginCount, 0) <= :maxLoginCount', { maxLoginCount: loginCountMax });
        }
        const watchRange = this.parseDurationRange(watchDurationRange, minWatchMinutes, maxWatchMinutes);
        const hasWatchDurationFilter = Boolean(watchDurationRange?.trim() || minWatchMinutes?.trim() || maxWatchMinutes?.trim());
        if (watchRange.minSeconds !== null) {
            queryBuilder.andWhere('COALESCE(watch_stats.totalWatchDuration, 0) >= :minWatchSeconds', {
                minWatchSeconds: hasWatchDurationFilter ? Math.max(watchRange.minSeconds, 1) : watchRange.minSeconds,
            });
        }
        else if (hasWatchDurationFilter) {
            queryBuilder.andWhere('COALESCE(watch_stats.totalWatchDuration, 0) > 0');
        }
        if (watchRange.maxSeconds !== null) {
            queryBuilder.andWhere('COALESCE(watch_stats.totalWatchDuration, 0) <= :maxWatchSeconds', {
                maxWatchSeconds: watchRange.maxSeconds,
            });
        }
        const onlineRange = this.parseDurationRange(onlineDurationRange, minOnlineMinutes, maxOnlineMinutes);
        const hasOnlineDurationFilter = Boolean(onlineDurationRange?.trim() || minOnlineMinutes?.trim() || maxOnlineMinutes?.trim());
        if (onlineRange.minSeconds !== null) {
            queryBuilder.andWhere('COALESCE(online_stats.totalOnlineDuration, 0) >= :minOnlineSeconds', {
                minOnlineSeconds: hasOnlineDurationFilter ? Math.max(onlineRange.minSeconds, 1) : onlineRange.minSeconds,
            });
        }
        else if (hasOnlineDurationFilter) {
            queryBuilder.andWhere('COALESCE(online_stats.totalOnlineDuration, 0) > 0');
        }
        if (onlineRange.maxSeconds !== null) {
            queryBuilder.andWhere('COALESCE(online_stats.totalOnlineDuration, 0) <= :maxOnlineSeconds', {
                maxOnlineSeconds: onlineRange.maxSeconds,
            });
        }
        const onlineDaysMin = this.parseOptionalNumber(minOnlineDays);
        const onlineDaysMax = this.parseOptionalNumber(maxOnlineDays);
        if (onlineDaysMin !== null) {
            queryBuilder.andWhere('COALESCE(online_stats.onlineDays, 0) >= :minOnlineDays', { minOnlineDays: onlineDaysMin });
        }
        if (onlineDaysMax !== null) {
            queryBuilder.andWhere('COALESCE(online_stats.onlineDays, 0) <= :maxOnlineDays', { maxOnlineDays: onlineDaysMax });
        }
        const total = await queryBuilder.clone().getCount();
        const { entities: users, raw } = await queryBuilder
            .skip(skip)
            .take(take)
            .getRawAndEntities();
        const statsByUserId = new Map();
        raw.forEach((row) => {
            const userId = Number(row.u_id);
            statsByUserId.set(userId, row);
        });
        const items = await Promise.all(users.map(async (u) => {
            const stats = statsByUserId.get(Number(u.id));
            const [lastToken, onlineLastActiveAt] = await Promise.all([
                this.refreshTokenRepo.findOne({
                    where: { userId: u.id },
                    order: { createdAt: 'DESC' },
                }),
                this.redisClient
                    ? this.redisClient.get(`online:last:${u.id}`).catch(() => null)
                    : Promise.resolve(null),
            ]);
            const totalWatchDuration = Number(stats?.totalWatchDuration || 0);
            const totalOnlineDuration = Number(stats?.totalOnlineDuration || 0);
            const onlineDays = Number(stats?.onlineDays || 0);
            const lastWatchAt = stats?.lastActiveAt ? new Date(stats.lastActiveAt) : null;
            const lastActiveAt = onlineLastActiveAt ? new Date(onlineLastActiveAt) : lastWatchAt;
            const isOnline = !!onlineLastActiveAt;
            return {
                ...this.toSafeUser(u),
                loginCount: Number(stats?.loginCount || 0),
                lastLoginAt: lastToken?.createdAt || (stats?.lastLoginAt ? new Date(stats.lastLoginAt) : null),
                lastLoginIp: lastToken?.ipAddress || null,
                lastLoginDevice: lastToken?.deviceInfo || null,
                activeLogins: Number(stats?.activeLogins || 0),
                totalOnlineDuration,
                totalOnlineMinutes: Math.floor(totalOnlineDuration / 60),
                onlineDays,
                totalWatchDuration,
                totalWatchMinutes: Math.floor(totalWatchDuration / 60),
                lastActiveAt,
                isOnline,
            };
        }));
        return { total, items, page: currentPage, size: take };
    }
    async get(id, startDate, endDate) {
        const user = await this.userRepo.findOne({ where: { id: Number(id) } });
        if (!user)
            return null;
        const now = new Date();
        const [lastToken, activeLogins, watchStats] = await Promise.all([
            this.refreshTokenRepo.findOne({
                where: { userId: user.id },
                order: { createdAt: 'DESC' },
            }),
            this.refreshTokenRepo.createQueryBuilder('rt')
                .where('rt.user_id = :uid', { uid: user.id })
                .andWhere('rt.is_revoked = 0')
                .andWhere('rt.expires_at > :now', { now })
                .getCount(),
            this.watchLogRepo.createQueryBuilder('wl')
                .select('COALESCE(SUM(wl.watch_duration), 0)', 'totalDuration')
                .addSelect('MAX(wl.created_at)', 'lastActiveAt')
                .where('wl.user_id = :uid', { uid: user.id })
                .getRawOne(),
        ]);
        const totalWatchDuration = Number(watchStats?.totalDuration || 0);
        const lastWatchAt = watchStats?.lastActiveAt ? new Date(watchStats.lastActiveAt) : null;
        const onlineLastActiveAt = this.redisClient
            ? await this.redisClient.get(`online:last:${user.id}`).catch(() => null)
            : null;
        const lastActiveAt = onlineLastActiveAt ? new Date(onlineLastActiveAt) : lastWatchAt;
        const isOnline = !!onlineLastActiveAt;
        const onlineDaily = await this.getOnlineDailyStats(user.id, startDate, endDate);
        return {
            ...this.toSafeUser(user),
            lastLoginAt: lastToken?.createdAt || null,
            lastLoginIp: lastToken?.ipAddress || null,
            lastLoginDevice: lastToken?.deviceInfo || null,
            activeLogins,
            totalWatchDuration,
            lastActiveAt,
            isOnline,
            onlineDaily,
        };
    }
    async loginLogs(id, page = 1, size = 20) {
        const userId = Number(id);
        const take = Math.max(Number(size) || 20, 1);
        const currentPage = Math.max(Number(page) || 1, 1);
        const skip = (currentPage - 1) * take;
        const [logs, total] = await this.refreshTokenRepo.findAndCount({
            where: { userId },
            select: ['id', 'createdAt', 'expiresAt', 'isRevoked', 'deviceInfo', 'ipAddress'],
            order: { createdAt: 'DESC' },
            skip,
            take,
        });
        const onlineStats = await this.onlineDailyRepo
            .createQueryBuilder('od')
            .select('SUM(od.duration)', 'totalOnlineDuration')
            .where('od.user_id = :userId', { userId })
            .getRawOne();
        const onlineLastActiveAt = this.redisClient
            ? await this.redisClient.get(`online:last:${userId}`).catch(() => null)
            : null;
        const isOnline = !!onlineLastActiveAt;
        return {
            total,
            items: logs,
            page: currentPage,
            size: take,
            userSummary: {
                userId,
                totalOnlineDuration: Number(onlineStats?.totalOnlineDuration || 0),
                isOnline,
                lastActiveAt: onlineLastActiveAt || null,
            },
        };
    }
    async create(body) {
        const entity = this.userRepo.create(body);
        return this.userRepo.save(entity);
    }
    async update(id, body) {
        await this.userRepo.update({ id: Number(id) }, body);
        return this.userRepo.findOne({ where: { id: Number(id) } });
    }
    async remove(id) {
        const userId = Number(id);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        await this.userRepo.manager.transaction(async (manager) => {
            await manager.query('DELETE FROM comment_likes WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE user_id = ?)', [userId]);
            await manager.query('UPDATE comments SET reply_to_user_id = NULL WHERE reply_to_user_id = ?', [userId]);
            await manager.query('DELETE FROM comments WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM watch_progress WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM watch_logs WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM browse_history WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM favorites WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM episode_reactions WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM user_online_daily WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM advertising_events WHERE user_id = ?', [userId]);
            await manager.query('DELETE FROM advertising_conversions WHERE user_id = ?', [userId]);
            await manager.delete(user_entity_1.User, { id: userId });
        });
        await this.clearUserOnlineCache(userId);
        return { success: true };
    }
    async onlineDaily(id, startDate, endDate) {
        const userId = Number(id);
        return this.getOnlineDailyStats(userId, startDate, endDate);
    }
    async getOnlineDailyStats(userId, startDate, endDate) {
        const end = endDate || new Date().toISOString().slice(0, 10);
        const start = startDate || (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();
        const records = await this.onlineDailyRepo
            .createQueryBuilder('od')
            .where('od.user_id = :userId', { userId })
            .andWhere('od.date >= :start', { start })
            .andWhere('od.date <= :end', { end })
            .andWhere('od.duration > 0')
            .orderBy('od.date', 'DESC')
            .getMany();
        const onlineDurationByDate = new Map();
        records.forEach((record) => {
            const date = this.formatDateOnly(record.date);
            onlineDurationByDate.set(date, (onlineDurationByDate.get(date) || 0) + record.duration);
        });
        const onlineDates = Array.from(onlineDurationByDate.keys());
        const watchRows = onlineDates.length > 0
            ? await this.watchLogRepo
                .createQueryBuilder('wl')
                .select('wl.watch_date', 'date')
                .addSelect('COALESCE(SUM(wl.watch_duration), 0)', 'watchDuration')
                .where('wl.user_id = :userId', { userId })
                .andWhere('wl.watch_date IN (:...onlineDates)', { onlineDates })
                .groupBy('wl.watch_date')
                .getRawMany()
            : [];
        const watchDurationByDate = new Map(watchRows.map((row) => [this.formatDateOnly(row.date), Number(row.watchDuration || 0)]));
        const totalOnlineDuration = Array.from(onlineDurationByDate.values()).reduce((sum, duration) => sum + duration, 0);
        const totalWatchDuration = Array.from(watchDurationByDate.values()).reduce((sum, duration) => sum + duration, 0);
        return {
            userId,
            startDate: start,
            endDate: end,
            totalOnlineDuration,
            totalWatchDuration,
            days: onlineDates.sort((a, b) => (a < b ? 1 : -1)).map((date) => {
                const onlineDuration = onlineDurationByDate.get(date) || 0;
                const watchDuration = watchDurationByDate.get(date) || 0;
                return {
                    date,
                    onlineDuration,
                    watchDuration,
                    onlineHours: Math.floor(onlineDuration / 3600),
                    onlineMinutes: Math.floor((onlineDuration % 3600) / 60),
                    watchHours: Math.floor(watchDuration / 3600),
                    watchMinutes: Math.floor((watchDuration % 3600) / 60),
                };
            }),
        };
    }
    toSafeUser(user) {
        return {
            id: user.id,
            email: user.email,
            telegram_id: user.telegram_id,
            shortId: user.shortId,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            nickname: user.nickname,
            photo_url: user.photo_url,
            is_active: user.is_active,
            isGuest: user.isGuest,
            created_at: user.created_at,
        };
    }
    parseDateBoundary(value, boundary) {
        if (!value || !value.trim())
            return null;
        const normalized = value.trim().replace('T', ' ');
        const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?$/);
        if (!match) {
            const parsed = new Date(normalized);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        const [, year, month, day, hourRaw, minuteRaw, secondRaw] = match;
        let hour = hourRaw === undefined ? (boundary === 'start' ? 0 : 23) : Number(hourRaw);
        const minute = minuteRaw === undefined ? (boundary === 'start' ? 0 : 59) : Number(minuteRaw);
        const second = secondRaw === undefined ? (boundary === 'start' ? 0 : 59) : Number(secondRaw);
        const date = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
        if (boundary === 'end' && hourRaw === undefined) {
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0);
            return date;
        }
        if (hour === 24) {
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0);
            return date;
        }
        date.setHours(hour, minute, second, boundary === 'start' ? 0 : 999);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    parseOptionalNumber(value) {
        if (value === undefined || value === null || String(value).trim() === '')
            return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    parseDurationRange(durationRange, minDurationMinutes, maxDurationMinutes) {
        let minMinutes = this.parseOptionalNumber(minDurationMinutes);
        let maxMinutes = this.parseOptionalNumber(maxDurationMinutes);
        if (durationRange && durationRange.trim()) {
            const [minRaw, maxRaw] = durationRange.split('-').map(part => part.trim());
            minMinutes = this.parseOptionalNumber(minRaw);
            maxMinutes = this.parseOptionalNumber(maxRaw);
        }
        return {
            minSeconds: minMinutes === null ? null : Math.max(minMinutes, 0) * 60,
            maxSeconds: maxMinutes === null ? null : Math.max(maxMinutes, 0) * 60,
        };
    }
    toExclusiveDateOnlyBoundary(value) {
        const result = new Date(value);
        const hasTimePart = result.getHours() > 0
            || result.getMinutes() > 0
            || result.getSeconds() > 0
            || result.getMilliseconds() > 0;
        if (hasTimePart) {
            result.setDate(result.getDate() + 1);
            result.setHours(0, 0, 0, 0);
        }
        return result;
    }
    async clearUserOnlineCache(userId) {
        if (!this.redisClient)
            return;
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        await Promise.all([
            this.redisClient.del(`online:last:${userId}`).catch(() => 0),
            this.redisClient.hDel(`online:${today}`, String(userId)).catch(() => 0),
            this.redisClient.hDel(`online:${yesterday}`, String(userId)).catch(() => 0),
        ]);
    }
    formatDateOnly(value) {
        if (value instanceof Date) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return String(value).slice(0, 10);
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('loginCount')),
    __param(5, (0, common_1.Query)('minLoginCount')),
    __param(6, (0, common_1.Query)('maxLoginCount')),
    __param(7, (0, common_1.Query)('watchDurationRange')),
    __param(8, (0, common_1.Query)('minWatchMinutes')),
    __param(9, (0, common_1.Query)('maxWatchMinutes')),
    __param(10, (0, common_1.Query)('onlineDurationRange')),
    __param(11, (0, common_1.Query)('minOnlineMinutes')),
    __param(12, (0, common_1.Query)('maxOnlineMinutes')),
    __param(13, (0, common_1.Query)('minOnlineDays')),
    __param(14, (0, common_1.Query)('maxOnlineDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(':id/login-logs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "loginLogs", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/online-daily'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "onlineDaily", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    (0, common_1.Controller)('admin/users'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(2, (0, typeorm_1.InjectRepository)(watch_log_entity_1.WatchLog)),
    __param(3, (0, typeorm_1.InjectRepository)(user_online_daily_entity_1.UserOnlineDaily)),
    __param(4, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map
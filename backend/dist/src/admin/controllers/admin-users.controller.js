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
    async list(page = 1, size = 20) {
        const take = Math.max(Number(size) || 20, 1);
        const currentPage = Math.max(Number(page) || 1, 1);
        const skip = (currentPage - 1) * take;
        const [users, total] = await this.userRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
        const now = new Date();
        const items = await Promise.all(users.map(async (u) => {
            const [lastToken, loginCount, activeLogins, watchStats] = await Promise.all([
                this.refreshTokenRepo.findOne({
                    where: { userId: u.id },
                    order: { createdAt: 'DESC' },
                }),
                this.refreshTokenRepo.count({ where: { userId: u.id } }),
                this.refreshTokenRepo.createQueryBuilder('rt')
                    .where('rt.user_id = :uid', { uid: u.id })
                    .andWhere('rt.is_revoked = 0')
                    .andWhere('rt.expires_at > :now', { now })
                    .getCount(),
                this.watchLogRepo.createQueryBuilder('wl')
                    .select('COALESCE(SUM(wl.watch_duration), 0)', 'totalDuration')
                    .addSelect('MAX(wl.created_at)', 'lastActiveAt')
                    .where('wl.user_id = :uid', { uid: u.id })
                    .getRawOne(),
            ]);
            const totalWatchDuration = Number(watchStats?.totalDuration || 0);
            const lastWatchAt = watchStats?.lastActiveAt ? new Date(watchStats.lastActiveAt) : null;
            const onlineLastActiveAt = this.redisClient
                ? await this.redisClient.get(`online:last:${u.id}`).catch(() => null)
                : null;
            const lastActiveAt = onlineLastActiveAt ? new Date(onlineLastActiveAt) : lastWatchAt;
            const isOnline = !!onlineLastActiveAt;
            return {
                ...u,
                lastLoginAt: lastToken?.createdAt || null,
                lastLoginIp: lastToken?.ipAddress || null,
                lastLoginDevice: lastToken?.deviceInfo || null,
                activeLogins,
                loginCount,
                totalWatchDuration,
                lastActiveAt,
                isOnline,
            };
        }));
        return { total, items, page: currentPage, size: take };
    }
    async get(id) {
        const user = await this.userRepo.findOne({ where: { id: Number(id) } });
        if (!user)
            return null;
        const now = new Date();
        const [lastToken, loginCount, activeLogins, watchStats] = await Promise.all([
            this.refreshTokenRepo.findOne({
                where: { userId: user.id },
                order: { createdAt: 'DESC' },
            }),
            this.refreshTokenRepo.count({ where: { userId: user.id } }),
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
        return {
            ...user,
            lastLoginAt: lastToken?.createdAt || null,
            lastLoginIp: lastToken?.ipAddress || null,
            lastLoginDevice: lastToken?.deviceInfo || null,
            activeLogins,
            loginCount,
            totalWatchDuration,
            lastActiveAt,
            isOnline,
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
        await this.userRepo.delete({ id: Number(id) });
        return { success: true };
    }
    async onlineDaily(id, startDate, endDate) {
        const userId = Number(id);
        const end = endDate || new Date().toISOString().slice(0, 10);
        const start = startDate || (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();
        const records = await this.onlineDailyRepo
            .createQueryBuilder('od')
            .where('od.user_id = :userId', { userId })
            .andWhere('od.date >= :start', { start })
            .andWhere('od.date <= :end', { end })
            .orderBy('od.date', 'DESC')
            .getMany();
        const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
        return {
            userId,
            startDate: start,
            endDate: end,
            totalDuration,
            days: records.map((r) => ({
                date: r.date,
                duration: r.duration,
                hours: Math.floor(r.duration / 3600),
                minutes: Math.floor((r.duration % 3600) / 60),
            })),
        };
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
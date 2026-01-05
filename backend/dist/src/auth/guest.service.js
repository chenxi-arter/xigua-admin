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
var GuestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const auth_service_1 = require("./auth.service");
const crypto_1 = require("crypto");
let GuestService = GuestService_1 = class GuestService {
    userRepo;
    authService;
    logger = new common_1.Logger(GuestService_1.name);
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async guestLogin(guestToken, deviceInfo) {
        let user = null;
        let isNewGuest = false;
        if (guestToken) {
            user = await this.userRepo.findOne({
                where: { guestToken, isGuest: true },
            });
        }
        if (!user) {
            user = await this.createGuestUser();
            isNewGuest = true;
        }
        const tokens = await this.authService.generateTokens(user, deviceInfo || 'Guest User');
        return {
            ...tokens,
            guestToken: user.guestToken,
            isNewGuest,
            userId: user.id,
        };
    }
    async createGuestUser() {
        const guestToken = this.generateGuestToken();
        const { DefaultAvatarUtil } = await Promise.resolve().then(() => require('../common/utils/default-avatar.util'));
        const defaultAvatar = DefaultAvatarUtil.getRandomAvatar();
        const guestNumber = Math.floor(Math.random() * 999999);
        const nickname = `游客${guestNumber.toString().padStart(6, '0')}`;
        const user = this.userRepo.create({
            isGuest: true,
            guestToken,
            nickname,
            first_name: '',
            last_name: '',
            photo_url: defaultAvatar,
            is_active: true,
            username: `guest_${guestToken}`,
        });
        return await this.userRepo.save(user);
    }
    generateGuestToken() {
        return `guest_${(0, crypto_1.randomBytes)(16).toString('hex')}`;
    }
    async convertGuestToUser(userId, email, telegramId) {
        const user = await this.userRepo.findOne({
            where: { id: userId, isGuest: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('游客用户不存在');
        }
        user.isGuest = false;
        if (email) {
            const existingUser = await this.userRepo.findOne({ where: { email } });
            if (existingUser) {
                throw new common_1.BadRequestException('该邮箱已被使用');
            }
            user.email = email;
        }
        if (telegramId) {
            const existingUser = await this.userRepo.findOne({ where: { telegram_id: telegramId } });
            if (existingUser) {
                throw new common_1.BadRequestException('该Telegram账号已被绑定');
            }
            user.telegram_id = telegramId;
        }
        return await this.userRepo.save(user);
    }
    async cleanInactiveGuests(inactiveDays = 90, recentActivityDays = 30) {
        this.logger.log(`开始清理不活跃游客：不活跃天数>${inactiveDays}天，最近${recentActivityDays}天无活动`);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - recentActivityDays);
        try {
            const inactiveGuests = await this.userRepo
                .createQueryBuilder('user')
                .where('user.is_guest = :isGuest', { isGuest: true })
                .andWhere('user.is_active = :isActive', { isActive: true })
                .andWhere('user.created_at < :cutoffDate', { cutoffDate })
                .andWhere(`user.id NOT IN (
            SELECT DISTINCT user_id 
            FROM watch_progress 
            WHERE updated_at > :recentDate
          )`, { recentDate })
                .getMany();
            if (inactiveGuests.length === 0) {
                this.logger.log('没有需要清理的不活跃游客');
                return {
                    success: true,
                    deactivated: 0,
                    message: '没有需要清理的不活跃游客',
                };
            }
            const guestIds = inactiveGuests.map((g) => g.id);
            const result = await this.userRepo.update({ id: (0, typeorm_2.In)(guestIds) }, { is_active: false });
            this.logger.log(`成功标记 ${result.affected} 个不活跃游客为不活跃状态`);
            return {
                success: true,
                deactivated: result.affected || 0,
                message: `已将 ${result.affected} 个不活跃游客标记为不活跃状态`,
                details: {
                    inactiveDays,
                    recentActivityDays,
                    cutoffDate: cutoffDate.toISOString(),
                    recentDate: recentDate.toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`清理不活跃游客失败: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`清理失败: ${error.message}`);
        }
    }
    async getGuestStatistics() {
        const totalGuests = await this.userRepo.count({
            where: { isGuest: true },
        });
        const activeGuests = await this.userRepo.count({
            where: { isGuest: true, is_active: true },
        });
        const inactiveGuests = await this.userRepo.count({
            where: { isGuest: true, is_active: false },
        });
        const convertedGuests = await this.userRepo.count({
            where: {
                isGuest: false,
                guestToken: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
            },
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentGuests = await this.userRepo.count({
            where: {
                isGuest: true,
                created_at: (0, typeorm_2.MoreThan)(thirtyDaysAgo),
            },
        });
        const totalGuestsEver = totalGuests + convertedGuests;
        return {
            totalGuests,
            activeGuests,
            inactiveGuests,
            convertedGuests,
            recentGuests,
            conversionRate: totalGuestsEver > 0
                ? ((convertedGuests / totalGuestsEver) * 100).toFixed(2) + '%'
                : '0.00%',
        };
    }
    async reactivateGuest(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId, isGuest: true, is_active: false },
        });
        if (!user) {
            throw new common_1.BadRequestException('游客用户不存在或已是活跃状态');
        }
        user.is_active = true;
        await this.userRepo.save(user);
        this.logger.log(`游客用户 ${userId} 已恢复为活跃状态`);
        return {
            success: true,
            message: '游客已恢复为活跃状态',
            userId,
        };
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = GuestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], GuestService);
//# sourceMappingURL=guest.service.js.map
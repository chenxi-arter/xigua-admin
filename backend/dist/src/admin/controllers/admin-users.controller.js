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
let AdminUsersController = class AdminUsersController {
    userRepo;
    refreshTokenRepo;
    constructor(userRepo, refreshTokenRepo) {
        this.userRepo = userRepo;
        this.refreshTokenRepo = refreshTokenRepo;
    }
    async list(page = 1, size = 20) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const [users, total] = await this.userRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
        const now = new Date();
        const items = await Promise.all(users.map(async (u) => {
            const lastToken = await this.refreshTokenRepo.findOne({
                where: { userId: u.id },
                order: { createdAt: 'DESC' },
            });
            const activeLogins = await this.refreshTokenRepo.count({
                where: {
                    userId: u.id,
                    isRevoked: false,
                },
            });
            const activeLoginsAccurate = await this.refreshTokenRepo.createQueryBuilder('rt')
                .where('rt.user_id = :uid', { uid: u.id })
                .andWhere('rt.is_revoked = 0')
                .andWhere('rt.expires_at > :now', { now })
                .getCount();
            return {
                ...u,
                lastLoginAt: lastToken?.createdAt || null,
                lastLoginIp: lastToken?.ipAddress || null,
                lastLoginDevice: lastToken?.deviceInfo || null,
                activeLogins: activeLoginsAccurate ?? activeLogins,
            };
        }));
        return { total, items, page: Number(page) || 1, size: take };
    }
    async get(id) {
        const user = await this.userRepo.findOne({ where: { id: Number(id) } });
        if (!user)
            return null;
        const now = new Date();
        const lastToken = await this.refreshTokenRepo.findOne({
            where: { userId: user.id },
            order: { createdAt: 'DESC' },
        });
        const activeLogins = await this.refreshTokenRepo.createQueryBuilder('rt')
            .where('rt.user_id = :uid', { uid: user.id })
            .andWhere('rt.is_revoked = 0')
            .andWhere('rt.expires_at > :now', { now })
            .getCount();
        return {
            ...user,
            lastLoginAt: lastToken?.createdAt || null,
            lastLoginIp: lastToken?.ipAddress || null,
            lastLoginDevice: lastToken?.deviceInfo || null,
            activeLogins,
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
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.Controller)('admin/users'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map
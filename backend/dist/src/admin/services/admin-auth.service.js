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
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_user_entity_1 = require("../entity/admin-user.entity");
const password_util_1 = require("../../common/utils/password.util");
let AdminAuthService = class AdminAuthService {
    adminUserRepo;
    jwtService;
    constructor(adminUserRepo, jwtService) {
        this.adminUserRepo = adminUserRepo;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        await this.ensureTable();
    }
    async login(dto) {
        const username = String(dto.username || '').trim();
        const password = String(dto.password || '');
        if (!username || !password) {
            throw new common_1.BadRequestException('用户名和密码不能为空');
        }
        const admin = await this.adminUserRepo.findOne({ where: { username } });
        if (!admin || !admin.isActive) {
            throw new common_1.UnauthorizedException('管理员账号或密码错误');
        }
        const matched = await password_util_1.PasswordUtil.comparePassword(password, admin.passwordHash);
        if (!matched) {
            throw new common_1.UnauthorizedException('管理员账号或密码错误');
        }
        const accessToken = this.jwtService.sign({
            sub: admin.id,
            username: admin.username,
            role: admin.role,
            typ: 'admin',
        });
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: this.getExpiresInSeconds(),
            admin: this.toSafeAdmin(admin),
        };
    }
    async createFirstAdmin(dto) {
        const existingCount = await this.adminUserRepo.count();
        if (existingCount > 0) {
            throw new common_1.ConflictException('管理员已存在，不能重复初始化');
        }
        return this.createAdmin(dto);
    }
    async addAdmin(dto) {
        return this.createAdmin(dto);
    }
    async changePassword(adminId, oldPassword, newPassword) {
        const admin = await this.adminUserRepo.findOne({ where: { id: adminId } });
        if (!admin) {
            throw new common_1.NotFoundException('管理员不存在');
        }
        const matched = await password_util_1.PasswordUtil.comparePassword(oldPassword, admin.passwordHash);
        if (!matched) {
            throw new common_1.UnauthorizedException('原密码错误');
        }
        const validation = password_util_1.PasswordUtil.validatePasswordStrength(newPassword);
        if (!validation.valid) {
            throw new common_1.BadRequestException(validation.message);
        }
        admin.passwordHash = await password_util_1.PasswordUtil.hashPassword(newPassword);
        await this.adminUserRepo.save(admin);
        return { success: true, message: '密码修改成功' };
    }
    async resetPassword(adminId, newPassword) {
        const admin = await this.adminUserRepo.findOne({ where: { id: adminId } });
        if (!admin) {
            throw new common_1.NotFoundException('管理员不存在');
        }
        const validation = password_util_1.PasswordUtil.validatePasswordStrength(newPassword);
        if (!validation.valid) {
            throw new common_1.BadRequestException(validation.message);
        }
        admin.passwordHash = await password_util_1.PasswordUtil.hashPassword(newPassword);
        await this.adminUserRepo.save(admin);
        return { success: true, message: '密码重置成功' };
    }
    async removeAdmin(adminId, currentAdminId) {
        if (adminId === currentAdminId) {
            throw new common_1.BadRequestException('不能删除自己的账号');
        }
        const admin = await this.adminUserRepo.findOne({ where: { id: adminId } });
        if (!admin) {
            throw new common_1.NotFoundException('管理员不存在');
        }
        await this.adminUserRepo.remove(admin);
        return { success: true, message: '管理员已删除' };
    }
    async listAdmins() {
        const admins = await this.adminUserRepo.find({ order: { id: 'ASC' } });
        return admins.map(a => this.toSafeAdmin(a));
    }
    async validateAdmin(adminId) {
        const admin = await this.adminUserRepo.findOne({ where: { id: adminId, isActive: true } });
        if (!admin) {
            throw new common_1.UnauthorizedException('管理员登录已失效');
        }
        return admin;
    }
    toSafeAdmin(admin) {
        return {
            id: admin.id,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };
    }
    async createAdmin(dto) {
        const username = String(dto.username || '').trim();
        const password = String(dto.password || '');
        if (!username || !password) {
            throw new common_1.BadRequestException('用户名和密码不能为空');
        }
        const validation = password_util_1.PasswordUtil.validatePasswordStrength(password);
        if (!validation.valid) {
            throw new common_1.BadRequestException(validation.message);
        }
        const exists = await this.adminUserRepo.findOne({ where: { username } });
        if (exists) {
            throw new common_1.ConflictException('管理员用户名已存在');
        }
        const admin = this.adminUserRepo.create({
            username,
            passwordHash: await password_util_1.PasswordUtil.hashPassword(password),
            name: dto.name || username,
            role: dto.role || 'super_admin',
            isActive: true,
        });
        const saved = await this.adminUserRepo.save(admin);
        return this.toSafeAdmin(saved);
    }
    getExpiresInSeconds() {
        const expiresIn = process.env.ADMIN_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '8h';
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1), 10);
        if (!Number.isFinite(value))
            return 8 * 60 * 60;
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 24 * 60 * 60;
            default: return 8 * 60 * 60;
        }
    }
    async ensureTable() {
        await this.adminUserRepo.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        is_active TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_admin_users_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map
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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_service_1 = require("../services/admin-auth.service");
const admin_jwt_auth_guard_1 = require("../guards/admin-jwt-auth.guard");
let AdminAuthController = class AdminAuthController {
    adminAuthService;
    constructor(adminAuthService) {
        this.adminAuthService = adminAuthService;
    }
    login(body) {
        return this.adminAuthService.login(body);
    }
    init(initToken, body) {
        this.assertInitToken(initToken);
        return this.adminAuthService.createFirstAdmin(body);
    }
    me(req) {
        return req.admin;
    }
    list(req) {
        this.assertSuperAdmin(req);
        return this.adminAuthService.listAdmins();
    }
    add(req, body) {
        this.assertSuperAdmin(req);
        return this.adminAuthService.addAdmin(body);
    }
    changePassword(req, body) {
        return this.adminAuthService.changePassword(req.admin.id, body.oldPassword, body.newPassword);
    }
    resetPassword(req, id, body) {
        this.assertSuperAdmin(req);
        return this.adminAuthService.resetPassword(id, body.newPassword);
    }
    remove(id, req) {
        this.assertSuperAdmin(req);
        return this.adminAuthService.removeAdmin(id, req.admin.id);
    }
    assertInitToken(initToken) {
        const expected = process.env.INIT_ADMIN_TOKEN;
        if (!expected || initToken !== expected) {
            throw new common_1.UnauthorizedException('初始化令牌无效');
        }
    }
    assertSuperAdmin(req) {
        if (req.admin?.role !== 'super_admin') {
            throw new common_1.ForbiddenException('仅超级管理员可执行该操作');
        }
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('init'),
    __param(0, (0, common_1.Headers)('x-init-admin-token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "init", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)('reset-password/:id'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_jwt_auth_guard_1.AdminJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminAuthController.prototype, "remove", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map
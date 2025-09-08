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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const telegram_user_dto_1 = require("./dto/telegram-user.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const refresh_token_dto_1 = require("../auth/dto/refresh-token.dto");
const requestIp = require("request-ip");
let UserController = class UserController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async telegramLogin(dto) {
        return this.userService.telegramLogin(dto);
    }
    async telegramLoginGet(dto) {
        return this.userService.telegramLogin(dto);
    }
    async getMe(req) {
        const user = await this.userService.findUserById(req.user.userId);
        if (!user) {
            return { message: '用户不存在' };
        }
        return {
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            createdAt: user.created_at,
        };
    }
    async refreshToken(dto, req) {
        const ipAddress = requestIp.getClientIp(req);
        return this.authService.refreshAccessToken(dto.refresh_token, ipAddress);
    }
    async verifyRefreshToken(dto) {
        try {
            await this.authService.refreshAccessToken(dto.refresh_token);
            return {
                valid: true,
                message: 'Refresh token 有效'
            };
        }
        catch (error) {
            return {
                valid: false,
                message: error.message || 'Refresh token 无效'
            };
        }
    }
    async logout(dto) {
        await this.authService.revokeRefreshToken(dto.refresh_token);
        return {
            message: '登出成功',
            success: true
        };
    }
    async logoutAll(req) {
        await this.authService.revokeAllUserTokens(req.user.userId);
        return {
            message: '已登出所有设备',
            success: true
        };
    }
    async getActiveDevices(req) {
        const devices = await this.authService.getUserActiveTokens(req.user.userId);
        return {
            devices: devices.map(device => ({
                id: device.id,
                deviceInfo: device.deviceInfo || '未知设备',
                ipAddress: device.ipAddress || '未知IP',
                createdAt: device.createdAt,
                expiresAt: device.expiresAt,
            })),
            total: devices.length
        };
    }
    async revokeDevice(tokenId, req) {
        const numericTokenId = parseInt(tokenId, 10);
        if (isNaN(numericTokenId)) {
            return {
                message: '无效的设备ID',
                success: false
            };
        }
        console.log('用户ID:', req.user.userId, '设备ID:', numericTokenId);
        return {
            message: '设备已登出',
            success: true
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('telegram-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_user_dto_1.TelegramUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "telegramLogin", null);
__decorate([
    (0, common_1.Get)('telegram-login'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_user_dto_1.TelegramUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "telegramLoginGet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('verify-refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyRefreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getActiveDevices", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('devices/:tokenId'),
    __param(0, (0, common_1.Param)('tokenId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "revokeDevice", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map
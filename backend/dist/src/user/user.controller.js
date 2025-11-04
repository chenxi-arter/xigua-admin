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
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const bind_telegram_dto_1 = require("./dto/bind-telegram.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const bind_email_dto_1 = require("./dto/bind-email.dto");
const update_nickname_dto_1 = require("./dto/update-nickname.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const update_avatar_dto_1 = require("./dto/update-avatar.dto");
let UserController = class UserController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async getMe(req) {
        const user = await this.userService.findUserById(req.user.userId);
        if (!user) {
            return { message: '用户不存在' };
        }
        const getDisplayNickname = () => {
            if (user.nickname && user.nickname.trim()) {
                return user.nickname.trim();
            }
            const firstName = user.first_name?.trim() || '';
            const lastName = user.last_name?.trim() || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ');
            if (fullName) {
                return fullName;
            }
            return user.username || '';
        };
        return {
            email: user.email || null,
            username: user.username,
            nickname: getDisplayNickname(),
            firstName: user.first_name,
            lastName: user.last_name,
            photoUrl: user.photo_url,
            hasTelegram: !!user.telegram_id,
            tgusername: user.telegram_id ? user.telegram_id : null,
            isActive: user.is_active,
            createdAt: user.created_at,
        };
    }
    async bindTelegram(dto, req) {
        return this.userService.bindTelegram(req.user.userId, dto);
    }
    async bindEmail(dto, req) {
        return this.userService.bindEmail(req.user.userId, dto);
    }
    async updateNickname(dto, req) {
        return await this.userService.updateNickname(req.user.userId, dto);
    }
    async updatePassword(dto, req) {
        return await this.userService.updatePassword(req.user.userId, dto);
    }
    async updateAvatar(dto, req) {
        return await this.userService.updateAvatar(req.user.userId, dto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '获取当前用户信息' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '获取成功' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('bind-telegram'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '绑定Telegram账号' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '绑定成功', type: bind_telegram_dto_1.BindTelegramResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bind_telegram_dto_1.BindTelegramDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "bindTelegram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('bind-email'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '绑定邮箱' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '绑定成功' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bind_email_dto_1.BindEmailDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "bindEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update-nickname'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新昵称' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '昵称更新成功', type: update_nickname_dto_1.UpdateNicknameResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '请求参数错误' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '昵称已被使用' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_nickname_dto_1.UpdateNicknameDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update-password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新密码' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '密码更新成功', type: update_password_dto_1.UpdatePasswordResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '请求参数错误' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_password_dto_1.UpdatePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update-avatar'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '更新头像' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '头像更新成功', type: update_avatar_dto_1.UpdateAvatarResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '请求参数错误' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_avatar_dto_1.UpdateAvatarDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAvatar", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map
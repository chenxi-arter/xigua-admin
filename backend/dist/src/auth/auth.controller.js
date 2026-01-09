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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const telegram_login_dto_1 = require("./dto/telegram-login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const email_login_dto_1 = require("../user/dto/email-login.dto");
const register_dto_1 = require("../user/dto/register.dto");
const bot_login_dto_1 = require("./dto/bot-login.dto");
const guest_login_dto_1 = require("./dto/guest-login.dto");
const user_service_1 = require("../user/user.service");
const telegram_user_dto_1 = require("../user/dto/telegram-user.dto");
const guest_service_1 = require("./guest.service");
const convert_guest_dto_1 = require("../user/dto/convert-guest.dto");
const common_2 = require("@nestjs/common");
let AuthController = class AuthController {
    authService;
    userService;
    guestService;
    constructor(authService, userService, guestService) {
        this.authService = authService;
        this.userService = userService;
        this.guestService = guestService;
    }
    async guestLogin(dto) {
        return this.guestService.guestLogin(dto.guestToken, dto.deviceInfo);
    }
    async telegramLogin(loginDto) {
        const telegramUserDto = {
            loginType: telegram_user_dto_1.LoginType.WEBAPP,
            initData: loginDto.initData,
            deviceInfo: loginDto.deviceInfo,
        };
        return this.userService.telegramLogin(telegramUserDto);
    }
    async telegramBotLogin(dto) {
        const loginDto = {
            loginType: telegram_user_dto_1.LoginType.BOT,
            id: dto.id,
            first_name: dto.first_name,
            last_name: dto.last_name,
            username: dto.username,
            auth_date: dto.auth_date,
            hash: dto.hash,
            deviceInfo: dto.deviceInfo,
        };
        return this.userService.telegramLogin(loginDto);
    }
    async emailLogin(dto) {
        return this.userService.emailLogin(dto);
    }
    async register(dto) {
        return this.userService.register(dto);
    }
    async refreshToken(refreshDto, ip) {
        if (!refreshDto.refresh_token) {
            throw new common_1.BadRequestException('refresh_token不能为空');
        }
        return this.authService.refreshAccessToken(refreshDto.refresh_token, ip);
    }
    async getActiveDevices(req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('用户信息无效');
        }
        const devices = await this.authService.getUserActiveTokens(userId);
        return {
            devices: devices.map((device) => ({
                id: device.id,
                deviceInfo: device.deviceInfo || '未知设备',
                ipAddress: device.ipAddress || '未知IP',
                createdAt: device.createdAt,
                expiresAt: device.expiresAt,
            })),
            total: devices.length,
        };
    }
    revokeDevice(tokenId) {
        const numericTokenId = parseInt(tokenId, 10);
        if (isNaN(numericTokenId)) {
            return {
                message: '无效的设备ID',
                success: false,
            };
        }
        return {
            message: '设备已登出',
            success: true,
        };
    }
    async logout(refreshDto) {
        if (!refreshDto.refresh_token) {
            throw new common_1.BadRequestException('refresh_token不能为空');
        }
        await this.authService.revokeRefreshToken(refreshDto.refresh_token);
        return { message: '登出成功' };
    }
    async logoutAll(req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('用户信息无效');
        }
        await this.authService.revokeAllUserTokens(userId);
        return { message: '已在所有设备上登出' };
    }
    getProfile(req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('用户信息无效');
        }
        return { userId, message: '用户已认证' };
    }
    async convertGuestToEmail(req, dto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('用户信息无效');
        }
        return this.userService.convertGuestToEmailUser(userId, dto);
    }
    async convertGuestToTelegram(req, dto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('用户信息无效');
        }
        const telegramUserDto = {
            loginType: telegram_user_dto_1.LoginType.WEBAPP,
            initData: dto.initData,
            deviceInfo: dto.deviceInfo,
        };
        return this.userService.convertGuestToTelegramUser(userId, telegramUserDto);
    }
    async cleanInactiveGuests(inactiveDays, recentActivityDays) {
        const inactive = inactiveDays ? parseInt(String(inactiveDays)) : 90;
        const recent = recentActivityDays ? parseInt(String(recentActivityDays)) : 30;
        return this.guestService.cleanInactiveGuests(inactive, recent);
    }
    async getGuestStatistics() {
        return this.guestService.getGuestStatistics();
    }
    async reactivateGuest(userId) {
        return this.guestService.reactivateGuest(parseInt(userId));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('guest-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '游客登录',
        description: '自动创建游客账号，用于匿名用户访问。首次访问会创建新游客，后续可通过guestToken识别'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登录成功',
        type: guest_login_dto_1.GuestLoginResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [guest_login_dto_1.GuestLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "guestLogin", null);
__decorate([
    (0, common_1.Post)('telegram/webapp-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Telegram Web App登录',
        description: '使用Telegram Web App的initData进行用户认证和登录'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登录成功',
        type: telegram_login_dto_1.TelegramLoginResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Telegram数据验证失败'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '请求参数错误'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_login_dto_1.TelegramLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "telegramLogin", null);
__decorate([
    (0, common_1.Post)('telegram/bot-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Telegram Bot 登录', description: '使用 id/auth_date/hash 进行登录' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '登录成功', type: telegram_login_dto_1.TelegramLoginResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_login_dto_1.BotLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "telegramBotLogin", null);
__decorate([
    (0, common_1.Post)('email-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '邮箱密码登录' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_login_dto_1.EmailLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "emailLogin", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '邮箱注册' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '刷新访问令牌',
        description: '使用refresh token获取新的access token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '刷新成功',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
                token_type: { type: 'string' },
                expires_in: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'refresh token无效或已过期'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('devices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '获取活跃设备列表' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getActiveDevices", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('devices/:tokenId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '撤销指定设备refresh token（占位实现）' }),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "revokeDevice", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '登出',
        description: '撤销当前的refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '登出成功'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '全设备登出',
        description: '撤销用户所有设备的refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '全设备登出成功'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '获取当前用户信息',
        description: '获取当前认证用户的基本信息'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '获取成功'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('convert-guest-to-email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '游客转正式用户（邮箱注册）',
        description: '将当前游客账号转换为正式邮箱注册用户，保留所有历史数据（观看记录、收藏、评论等）'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '转换成功',
        type: convert_guest_dto_1.ConvertGuestResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '请求参数错误或用户已是正式用户'
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: '邮箱或用户名已被使用'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, convert_guest_dto_1.ConvertGuestToEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "convertGuestToEmail", null);
__decorate([
    (0, common_1.Post)('convert-guest-to-telegram'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '游客转正式用户（Telegram登录）',
        description: '将当前游客账号通过Telegram登录转换为正式用户，保留所有历史数据'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '转换成功',
        type: telegram_login_dto_1.TelegramLoginResponseDto
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, telegram_login_dto_1.TelegramLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "convertGuestToTelegram", null);
__decorate([
    (0, common_1.Post)('admin/clean-inactive-guests'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '清理不活跃游客（管理员）',
        description: '将长期不活跃的游客标记为不活跃状态（软删除），不会删除数据，可恢复'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '清理成功',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                deactivated: { type: 'number' },
                message: { type: 'string' },
                details: { type: 'object' }
            }
        }
    }),
    __param(0, (0, common_2.Query)('inactiveDays')),
    __param(1, (0, common_2.Query)('recentActivityDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "cleanInactiveGuests", null);
__decorate([
    (0, common_1.Get)('admin/guest-statistics'),
    (0, swagger_1.ApiOperation)({
        summary: '获取游客统计信息（管理员）',
        description: '获取游客总数、活跃数、转化率等统计数据'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '统计信息',
        schema: {
            type: 'object',
            properties: {
                totalGuests: { type: 'number' },
                activeGuests: { type: 'number' },
                inactiveGuests: { type: 'number' },
                convertedGuests: { type: 'number' },
                recentGuests: { type: 'number' },
                conversionRate: { type: 'string' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getGuestStatistics", null);
__decorate([
    (0, common_1.Post)('admin/reactivate-guest/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '恢复不活跃游客（管理员）',
        description: '将被标记为不活跃的游客恢复为活跃状态'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '恢复成功'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reactivateGuest", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('认证'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        guest_service_1.GuestService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
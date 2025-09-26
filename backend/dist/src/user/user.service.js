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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entity/user.entity");
const telegram_user_dto_1 = require("./dto/telegram-user.dto");
const telegram_validator_1 = require("./telegram.validator");
const auth_service_1 = require("../auth/auth.service");
const telegram_auth_service_1 = require("../auth/telegram-auth.service");
const password_util_1 = require("../common/utils/password.util");
let UserService = class UserService {
    userRepo;
    jwtService;
    authService;
    telegramAuthService;
    constructor(userRepo, jwtService, authService, telegramAuthService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.authService = authService;
        this.telegramAuthService = telegramAuthService;
    }
    async telegramLogin(dto) {
        this.validateBotToken();
        const userData = this.validateAndExtractUserData(dto);
        const user = await this.findOrCreateUser(userData);
        const tokens = await this.generateUserTokens(user, dto.deviceInfo);
        return {
            ...tokens,
        };
    }
    validateBotToken() {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new Error('缺少 TELEGRAM_BOT_TOKEN，请检查 .env');
        }
    }
    async bindEmail(userId, dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('密码和确认密码不匹配');
        }
        const validation = password_util_1.PasswordUtil.validatePasswordStrength(dto.password);
        if (!validation.valid) {
            throw new common_1.BadRequestException(validation.message);
        }
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        if (user.email) {
            throw new common_1.ConflictException('该账号已绑定邮箱');
        }
        const occupied = await this.userRepo.findOneBy({ email: dto.email });
        if (occupied) {
            throw new common_1.ConflictException('该邮箱已被其他账号使用');
        }
        const passwordHash = await password_util_1.PasswordUtil.hashPassword(dto.password);
        user.email = dto.email;
        user.password_hash = passwordHash;
        const updated = await this.userRepo.save(user);
        return {
            success: true,
            message: '邮箱绑定成功，现在可以使用邮箱或Telegram登录',
            user: {
                id: updated.id,
                shortId: updated.shortId,
                email: updated.email,
                username: updated.username,
                firstName: updated.first_name,
                lastName: updated.last_name,
                telegramId: updated.telegram_id,
                isActive: updated.is_active,
            },
        };
    }
    validateAndExtractUserData(dto) {
        switch (dto.loginType) {
            case telegram_user_dto_1.LoginType.WEBAPP:
                return this.validateWebAppLogin(dto);
            case telegram_user_dto_1.LoginType.BOT:
                return this.validateBotLogin(dto);
            default:
                throw new common_1.UnauthorizedException('无效的登录方式，请指定loginType为webapp或bot');
        }
    }
    validateWebAppLogin(dto) {
        console.log('使用Telegram Web App登录方式');
        if (!dto.initData) {
            throw new common_1.UnauthorizedException('Web App登录需要提供initData');
        }
        const userData = this.telegramAuthService.verifyInitData(dto.initData);
        if (!userData) {
            throw new common_1.UnauthorizedException('Telegram Web App数据验证失败');
        }
        return {
            id: userData.id,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            username: userData.username || '',
        };
    }
    validateBotLogin(dto) {
        console.log('使用Telegram Bot登录方式');
        if (!dto.id || !dto.first_name || !dto.auth_date || !dto.hash) {
            throw new common_1.UnauthorizedException('Bot登录需要提供id、first_name、auth_date和hash字段');
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDiff = currentTime - dto.auth_date;
        const maxAge = parseInt(process.env.TELEGRAM_AUTH_MAX_AGE || '604800');
        if (timeDiff > maxAge) {
            throw new common_1.UnauthorizedException(`Bot登录数据过期: ${timeDiff}秒前的数据，最大允许${maxAge}秒`);
        }
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const isValid = (0, telegram_validator_1.verifyTelegramHash)(botToken, dto);
        if (!isValid) {
            throw new common_1.UnauthorizedException('非法登录');
        }
        return {
            id: dto.id,
            first_name: dto.first_name,
            last_name: dto.last_name || '',
            username: dto.username || '',
            photo_url: dto.photo_url,
        };
    }
    async findOrCreateUser(userData) {
        let user = await this.userRepo.findOneBy({ telegram_id: userData.id });
        if (!user) {
            user = await this.createNewUser(userData);
        }
        else {
            user = await this.updateExistingUser(user, userData);
        }
        return user;
    }
    async createNewUser(userData) {
        const telegramUsername = `tg${userData.id}`;
        console.log('=== createNewUser 调试信息 ===');
        console.log('userData:', userData);
        console.log('photo_url:', userData.photo_url);
        const user = this.userRepo.create({
            telegram_id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name || '',
            username: userData.username || telegramUsername,
            photo_url: userData.photo_url || null,
            is_active: true,
        });
        console.log('创建的user对象:', user);
        const savedUser = await this.userRepo.save(user);
        console.log('保存后的user对象:', savedUser);
        return savedUser;
    }
    async updateExistingUser(user, userData) {
        user.first_name = userData.first_name || user.first_name;
        user.last_name = userData.last_name || user.last_name;
        user.username = userData.username || user.username;
        if (userData.photo_url) {
            user.photo_url = userData.photo_url;
        }
        if (!user.shortId) {
            const { ShortIdUtil } = await Promise.resolve().then(() => require('../shared/utils/short-id.util'));
            user.shortId = ShortIdUtil.generate();
        }
        return await this.userRepo.save(user);
    }
    generateUserTokens(user, deviceInfo) {
        return this.authService.generateTokens(user, deviceInfo || user.username || 'Telegram User');
    }
    async findUserById(id) {
        return this.userRepo.findOneBy({ id });
    }
    async register(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('密码和确认密码不匹配');
        }
        const passwordValidation = password_util_1.PasswordUtil.validatePasswordStrength(dto.password);
        if (!passwordValidation.valid) {
            throw new common_1.BadRequestException(passwordValidation.message);
        }
        const existingUserByEmail = await this.userRepo.findOneBy({ email: dto.email });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('该邮箱已被注册');
        }
        if (dto.username) {
            const existingUserByUsername = await this.userRepo.findOneBy({ username: dto.username });
            if (existingUserByUsername) {
                throw new common_1.ConflictException('该用户名已被使用');
            }
        }
        const userId = Date.now() + Math.floor(Math.random() * 1000);
        const randomSuffix = Math.floor(Math.random() * 1000000);
        const emailUsername = `e${randomSuffix}`;
        const passwordHash = await password_util_1.PasswordUtil.hashPassword(dto.password);
        const user = this.userRepo.create({
            id: userId,
            email: dto.email,
            password_hash: passwordHash,
            username: dto.username || emailUsername,
            first_name: dto.firstName || '',
            last_name: dto.lastName || '',
            is_active: true,
        });
        const savedUser = await this.userRepo.save(user);
        return {
            id: savedUser.id,
            shortId: savedUser.shortId,
            email: savedUser.email,
            username: savedUser.username,
            firstName: savedUser.first_name,
            lastName: savedUser.last_name,
            isActive: savedUser.is_active,
            createdAt: savedUser.created_at,
        };
    }
    async emailLogin(dto) {
        const user = await this.userRepo.findOneBy({ email: dto.email });
        if (!user) {
            throw new common_1.UnauthorizedException('邮箱或密码错误');
        }
        if (!user.password_hash) {
            throw new common_1.UnauthorizedException('该账号不支持密码登录');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.comparePassword(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('邮箱或密码错误');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('账号已被禁用');
        }
        const tokens = await this.authService.generateTokens(user, dto.deviceInfo || 'Email Login');
        return {
            ...tokens,
        };
    }
    async bindTelegram(userId, dto) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new common_1.BadRequestException('Telegram Bot Token未配置');
        }
        const telegramData = {
            loginType: 'bot',
            id: dto.id,
            first_name: dto.first_name,
            last_name: dto.last_name,
            username: dto.username,
            auth_date: dto.auth_date,
            hash: dto.hash,
        };
        const isValid = (0, telegram_validator_1.verifyTelegramHash)(botToken, telegramData);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Telegram数据验证失败');
        }
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        if (user.telegram_id) {
            throw new common_1.ConflictException('该账号已经绑定了Telegram');
        }
        const existingTelegramUser = await this.userRepo.findOneBy({ telegram_id: dto.id });
        if (existingTelegramUser) {
            throw new common_1.ConflictException('该Telegram账号已被其他用户绑定');
        }
        user.telegram_id = dto.id;
        user.first_name = dto.first_name;
        user.last_name = dto.last_name || user.last_name;
        user.username = dto.username || user.username;
        const updatedUser = await this.userRepo.save(user);
        return {
            success: true,
            message: 'Telegram账号绑定成功，现在可以使用邮箱或Telegram登录',
            user: {
                id: updatedUser.id,
                shortId: updatedUser.shortId,
                email: updatedUser.email,
                username: updatedUser.username,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                telegramId: updatedUser.telegram_id,
                isActive: updatedUser.is_active,
            },
        };
    }
    async findUserByEmail(email) {
        return this.userRepo.findOneBy({ email });
    }
    async findUserByTelegramId(telegramId) {
        return this.userRepo.findOneBy({ telegram_id: telegramId });
    }
    async updateNickname(userId, dto) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('用户不存在');
        }
        await this.userRepo.update(userId, { nickname: dto.nickname });
        return {
            success: true,
            message: '昵称修改成功'
        };
    }
    async updatePassword(userId, dto) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('用户不存在');
        }
        if (!user.email || !user.password_hash) {
            throw new common_1.BadRequestException('只有邮箱注册用户可以修改密码');
        }
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException('新密码和确认密码不一致');
        }
        const isOldPasswordValid = await password_util_1.PasswordUtil.comparePassword(dto.oldPassword, user.password_hash);
        if (!isOldPasswordValid) {
            throw new common_1.BadRequestException('旧密码错误');
        }
        const newPasswordHash = await password_util_1.PasswordUtil.hashPassword(dto.newPassword);
        await this.userRepo.update(userId, { password_hash: newPasswordHash });
        return {
            success: true,
            message: '密码修改成功'
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        auth_service_1.AuthService,
        telegram_auth_service_1.TelegramAuthService])
], UserService);
//# sourceMappingURL=user.service.js.map
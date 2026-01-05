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
exports.TelegramStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_custom_1 = require("passport-custom");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const telegram_auth_service_1 = require("../telegram-auth.service");
let TelegramStrategy = class TelegramStrategy extends (0, passport_1.PassportStrategy)(passport_custom_1.Strategy, 'telegram') {
    configService;
    telegramAuthService;
    userRepository;
    constructor(configService, telegramAuthService, userRepository) {
        super();
        this.configService = configService;
        this.telegramAuthService = telegramAuthService;
        this.userRepository = userRepository;
    }
    isInitDataBody(body) {
        return (typeof body === 'object' &&
            body !== null &&
            'initData' in body);
    }
    async validate(req) {
        const headerValue = req.headers['x-telegram-init-data'];
        const headerInitData = Array.isArray(headerValue) ? headerValue[0] : headerValue;
        const rawBody = req.body;
        const bodyInitData = this.isInitDataBody(rawBody) && typeof rawBody.initData === 'string'
            ? rawBody.initData
            : undefined;
        const initData = bodyInitData || (typeof headerInitData === 'string' ? headerInitData : undefined);
        if (!initData) {
            throw new common_1.UnauthorizedException('缺少Telegram初始化数据');
        }
        const userData = this.telegramAuthService.verifyInitData(initData);
        if (!userData) {
            throw new common_1.UnauthorizedException('Telegram数据验证失败');
        }
        let user = await this.userRepository.findOne({
            where: { telegram_id: userData.id }
        });
        if (!user) {
            const telegramUsername = `tg${userData.id}`;
            user = this.userRepository.create({
                telegram_id: userData.id,
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                username: userData.username || telegramUsername,
                photo_url: userData.photo_url || null,
                is_active: true,
            });
            await this.userRepository.save(user);
        }
        else {
            user.first_name = userData.first_name || user.first_name;
            user.last_name = userData.last_name || user.last_name;
            user.username = userData.username || user.username;
            if (userData.photo_url) {
                user.photo_url = userData.photo_url;
            }
            if (!user.shortId) {
                const { ShortIdUtil } = await Promise.resolve().then(() => require('../../common/utils/short-id.util'));
                user.shortId = ShortIdUtil.generate();
            }
            await this.userRepository.save(user);
        }
        return user;
    }
};
exports.TelegramStrategy = TelegramStrategy;
exports.TelegramStrategy = TelegramStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        telegram_auth_service_1.TelegramAuthService,
        typeorm_2.Repository])
], TelegramStrategy);
//# sourceMappingURL=telegram.strategy.js.map
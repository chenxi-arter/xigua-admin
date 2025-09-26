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
var TelegramAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let TelegramAuthService = TelegramAuthService_1 = class TelegramAuthService {
    configService;
    logger = new common_1.Logger(TelegramAuthService_1.name);
    botToken;
    constructor(configService) {
        this.configService = configService;
        const token = this.configService.get('TELEGRAM_BOT_TOKEN') || '8303051100:AAETrfsTOPHgjlDv1v06jdRTpzjE-cnX7-w';
        this.botToken = token;
        this.logger.log(`Using Telegram Bot Token: ${token.substring(0, 10)}...`);
    }
    verifyInitData(initData) {
        try {
            const urlParams = new URLSearchParams(initData);
            const data = Object.fromEntries(urlParams.entries());
            const receivedHash = data.hash;
            delete data.hash;
            if (!receivedHash) {
                this.logger.warn('缺少hash参数');
                return null;
            }
            const authDate = parseInt(data.auth_date);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeDiff = currentTime - authDate;
            const maxAge = parseInt(process.env.TELEGRAM_AUTH_MAX_AGE || '604800');
            if (timeDiff > maxAge) {
                this.logger.warn(`initData过期: ${timeDiff}秒前的数据，最大允许${maxAge}秒`);
                return null;
            }
            const dataCheckArr = [];
            for (const key of Object.keys(data).sort()) {
                const value = data[key];
                if (typeof value === 'string') {
                    dataCheckArr.push(`${key}=${value}`);
                }
            }
            const dataCheckString = dataCheckArr.join('\n');
            const secretKey = crypto
                .createHmac('sha256', 'WebAppData')
                .update(this.botToken)
                .digest();
            const hmacHash = crypto
                .createHmac('sha256', secretKey)
                .update(dataCheckString)
                .digest('hex');
            if (hmacHash !== receivedHash) {
                this.logger.warn(`initData hash验证失败 - 计算值: ${hmacHash}, 接收值: ${receivedHash}`);
                return null;
            }
            if (!data.user) {
                this.logger.warn('缺少用户数据');
                return null;
            }
            const userData = JSON.parse(decodeURIComponent(data.user));
            this.logger.log(`Telegram用户验证成功: ${userData.id} (${userData.username || userData.first_name})`);
            return userData;
        }
        catch (error) {
            this.logger.error('验证initData时发生错误:', error);
            return null;
        }
    }
    generateLoginUrl(redirectUrl) {
        const botUsername = this.configService.get('TELEGRAM_BOT_USERNAME');
        if (!botUsername) {
            throw new Error('TELEGRAM_BOT_USERNAME is not defined');
        }
        const params = new URLSearchParams({
            start: 'auth',
            redirect_uri: redirectUrl,
        });
        return `https://t.me/${botUsername}?${params.toString()}`;
    }
};
exports.TelegramAuthService = TelegramAuthService;
exports.TelegramAuthService = TelegramAuthService = TelegramAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramAuthService);
//# sourceMappingURL=telegram-auth.service.js.map
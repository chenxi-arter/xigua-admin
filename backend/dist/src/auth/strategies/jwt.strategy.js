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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = require("jsonwebtoken");
const security_env_util_1 = require("../../common/utils/security-env.util");
const strategyLogger = new common_1.Logger('JwtStrategy');
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    constructor(configService) {
        const newSecret = (0, security_env_util_1.assertStrongSecret)('JWT_SECRET', configService.get('JWT_SECRET'));
        const legacySecret = (0, security_env_util_1.optionalSecret)('JWT_SECRET_LEGACY', configService.get('JWT_SECRET_LEGACY'));
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (_request, rawJwtToken, done) => {
                if (!legacySecret) {
                    return done(null, newSecret);
                }
                try {
                    (0, jsonwebtoken_1.verify)(rawJwtToken, newSecret);
                    return done(null, newSecret);
                }
                catch {
                    try {
                        (0, jsonwebtoken_1.verify)(rawJwtToken, legacySecret);
                        strategyLogger.warn('检测到使用过渡期旧密钥签发的 token，请尽快完成迁移');
                        return done(null, legacySecret);
                    }
                    catch {
                        return done(null, newSecret);
                    }
                }
            },
        });
        this.configService = configService;
    }
    async validate(payload) {
        if (!payload?.sub) {
            throw new common_1.UnauthorizedException('登录信息无效或已过期');
        }
        const userId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
        if (!Number.isFinite(userId) || userId <= 0) {
            throw new common_1.UnauthorizedException('登录信息无效或已过期');
        }
        return { userId };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map
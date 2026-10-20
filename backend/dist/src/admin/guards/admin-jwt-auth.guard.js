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
exports.AdminJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_auth_service_1 = require("../services/admin-auth.service");
const config_1 = require("@nestjs/config");
const security_env_util_1 = require("../../common/utils/security-env.util");
let AdminJwtAuthGuard = class AdminJwtAuthGuard {
    jwtService;
    adminAuthService;
    configService;
    newSecret;
    legacySecret;
    constructor(jwtService, adminAuthService, configService) {
        this.jwtService = jwtService;
        this.adminAuthService = adminAuthService;
        this.configService = configService;
        this.newSecret = (0, security_env_util_1.assertStrongSecret)('ADMIN_JWT_SECRET', this.configService.get('ADMIN_JWT_SECRET'));
        this.legacySecret = (0, security_env_util_1.optionalSecret)('ADMIN_JWT_SECRET_LEGACY', this.configService.get('ADMIN_JWT_SECRET_LEGACY'));
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = this.extractToken(req);
        if (!token) {
            throw new common_1.UnauthorizedException('缺少管理员登录凭证');
        }
        try {
            return await this.authenticateWith(token, this.newSecret, req, false);
        }
        catch (newSecretError) {
            if (!this.legacySecret) {
                throw this.normalizeError(newSecretError);
            }
            try {
                return await this.authenticateWith(token, this.legacySecret, req, true);
            }
            catch {
                throw this.normalizeError(newSecretError);
            }
        }
    }
    async authenticateWith(token, secret, req, isLegacy) {
        const payload = await this.jwtService.verifyAsync(token, { secret });
        if (payload.typ !== 'admin' || !payload.sub) {
            throw new common_1.UnauthorizedException('无效的管理员登录凭证');
        }
        if (isLegacy) {
            console.warn('[AdminJWT] 使用过渡期旧密钥验证成功，管理员ID:', payload.sub);
        }
        const admin = await this.adminAuthService.validateAdmin(payload.sub);
        req.admin = this.adminAuthService.toSafeAdmin(admin);
        return true;
    }
    normalizeError(error) {
        if (error instanceof common_1.UnauthorizedException)
            return error;
        return new common_1.UnauthorizedException('管理员登录已过期或无效');
    }
    extractToken(req) {
        const authorization = req.headers?.authorization;
        const value = Array.isArray(authorization) ? authorization[0] : authorization;
        if (!value)
            return null;
        const [type, token] = value.split(' ');
        return type === 'Bearer' && token ? token : null;
    }
};
exports.AdminJwtAuthGuard = AdminJwtAuthGuard;
exports.AdminJwtAuthGuard = AdminJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        admin_auth_service_1.AdminAuthService,
        config_1.ConfigService])
], AdminJwtAuthGuard);
//# sourceMappingURL=admin-jwt-auth.guard.js.map
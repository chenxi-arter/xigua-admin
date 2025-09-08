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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    jwtService;
    refreshTokenRepo;
    constructor(jwtService, refreshTokenRepo) {
        this.jwtService = jwtService;
        this.refreshTokenRepo = refreshTokenRepo;
    }
    async generateTokens(user, deviceInfo, ipAddress) {
        const accessToken = this.jwtService.sign({ sub: user.id }, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });
        const refreshTokenValue = (0, crypto_1.randomBytes)(32).toString('hex');
        const refreshToken = this.refreshTokenRepo.create({
            userId: user.id,
            token: refreshTokenValue,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo,
            ipAddress,
        });
        await this.refreshTokenRepo.save(refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshTokenValue,
            expires_in: this.getExpiresInSeconds(),
            token_type: 'Bearer',
        };
    }
    async refreshAccessToken(refreshTokenValue, ipAddress) {
        if (!refreshTokenValue) {
            throw new common_1.BadRequestException('Refresh token 不能为空');
        }
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: { token: refreshTokenValue, isRevoked: false },
            relations: ['user'],
        });
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('无效的 refresh token');
        }
        if (refreshToken.expiresAt < new Date()) {
            await this.refreshTokenRepo.update(refreshToken.id, { isRevoked: true });
            throw new common_1.UnauthorizedException('Refresh token 已过期，请重新登录');
        }
        if (!refreshToken.user || !refreshToken.user.is_active) {
            await this.refreshTokenRepo.update(refreshToken.id, { isRevoked: true });
            throw new common_1.UnauthorizedException('用户账号已被禁用');
        }
        if (ipAddress && refreshToken.ipAddress &&
            this.isIpSuspicious(refreshToken.ipAddress, ipAddress)) {
            console.warn(`IP地址变化检测: ${refreshToken.ipAddress} -> ${ipAddress}`);
        }
        const accessToken = this.jwtService.sign({ sub: refreshToken.userId }, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });
        return {
            access_token: accessToken,
            expires_in: this.getExpiresInSeconds(),
            token_type: 'Bearer',
        };
    }
    async revokeRefreshToken(refreshTokenValue) {
        const result = await this.refreshTokenRepo.update({ token: refreshTokenValue }, { isRevoked: true });
        if (result.affected === 0) {
            throw new common_1.UnauthorizedException('无效的 refresh token');
        }
    }
    async revokeAllUserTokens(userId) {
        await this.refreshTokenRepo.update({ userId, isRevoked: false }, { isRevoked: true });
    }
    async cleanupExpiredTokens() {
        const result = await this.refreshTokenRepo.delete({
            expiresAt: (0, typeorm_2.LessThan)(new Date()),
        });
        console.log(`清理了 ${result.affected} 个过期的 refresh token`);
        return result.affected;
    }
    async getUserActiveTokens(userId) {
        return this.refreshTokenRepo.find({
            where: {
                userId,
                isRevoked: false,
                expiresAt: (0, typeorm_2.LessThan)(new Date())
            },
            select: ['id', 'createdAt', 'expiresAt', 'deviceInfo', 'ipAddress'],
            order: { createdAt: 'DESC' },
        });
    }
    getExpiresInSeconds() {
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
        const timeUnit = expiresIn.slice(-1);
        const timeValue = parseInt(expiresIn.slice(0, -1));
        switch (timeUnit) {
            case 's': return timeValue;
            case 'm': return timeValue * 60;
            case 'h': return timeValue * 60 * 60;
            case 'd': return timeValue * 24 * 60 * 60;
            default: return 3600;
        }
    }
    isIpSuspicious(oldIp, newIp) {
        if (oldIp === newIp)
            return false;
        const oldSegments = oldIp.split('.');
        const newSegments = newIp.split('.');
        if (oldSegments.length === 4 && newSegments.length === 4) {
            return !(oldSegments[0] === newSegments[0] &&
                oldSegments[1] === newSegments[1] &&
                oldSegments[2] === newSegments[2]);
        }
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map
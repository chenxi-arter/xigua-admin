import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entity/refresh-token.entity';
import { User } from '../user/entity/user.entity';
export declare class AuthService {
    private readonly jwtService;
    private readonly refreshTokenRepo;
    private readonly configService;
    constructor(jwtService: JwtService, refreshTokenRepo: Repository<RefreshToken>, configService: ConfigService);
    generateTokens(user: User, deviceInfo?: string, ipAddress?: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    refreshAccessToken(refreshTokenValue: string, ipAddress?: string): Promise<{
        access_token: string;
        expires_in: number;
        token_type: string;
    }>;
    revokeRefreshToken(refreshTokenValue: string): Promise<void>;
    revokeAllUserTokens(userId: number): Promise<void>;
    cleanupExpiredTokens(): Promise<number | null | undefined>;
    getUserActiveTokens(userId: number): Promise<RefreshToken[]>;
    private getExpiresInSeconds;
    private isIpSuspicious;
}

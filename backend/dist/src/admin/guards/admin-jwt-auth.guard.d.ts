import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthService } from '../services/admin-auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AdminJwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly adminAuthService;
    private readonly configService;
    private readonly newSecret;
    private readonly legacySecret?;
    constructor(jwtService: JwtService, adminAuthService: AdminAuthService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private authenticateWith;
    private normalizeError;
    private extractToken;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthService } from '../services/admin-auth.service';
export declare class AdminJwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly adminAuthService;
    constructor(jwtService: JwtService, adminAuthService: AdminAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}

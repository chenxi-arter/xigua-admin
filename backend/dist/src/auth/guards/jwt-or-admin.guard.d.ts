import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminJwtAuthGuard } from '../../admin/guards/admin-jwt-auth.guard';
export declare class JwtOrAdminGuard implements CanActivate {
    private readonly userGuard;
    private readonly adminGuard;
    constructor(userGuard: JwtAuthGuard, adminGuard: AdminJwtAuthGuard);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

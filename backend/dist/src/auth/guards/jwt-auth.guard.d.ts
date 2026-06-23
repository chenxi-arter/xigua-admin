import { ExecutionContext } from '@nestjs/common';
import { DauService } from '../../admin/services/dau.service';
type JwtGuardUser = {
    id?: number | string;
};
type JwtGuardInfo = {
    name?: string;
};
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly dauService;
    constructor(dauService: DauService);
    handleRequest<TUser = any>(err: unknown, user: JwtGuardUser | undefined, info: JwtGuardInfo | undefined, context: ExecutionContext): TUser;
}
export {};

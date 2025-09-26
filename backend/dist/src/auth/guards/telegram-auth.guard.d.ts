import { ExecutionContext } from '@nestjs/common';
declare const TelegramAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TelegramAuthGuard extends TelegramAuthGuard_base {
    constructor();
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: any, user: any, info: any): any;
}
export {};

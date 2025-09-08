import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: Request, res: Response, next: NextFunction): void;
    private getClientIp;
    private logPerformanceDetails;
    private sanitizeHeaders;
}
export declare class PerformanceMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly slowRequestThreshold;
    private readonly memoryWarningThreshold;
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class SecurityLoggerMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly suspiciousPatterns;
    use(req: Request, res: Response, next: NextFunction): void;
    private getClientIp;
    private detectSuspiciousActivity;
}

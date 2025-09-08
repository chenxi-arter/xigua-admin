import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';
export declare class ErrorHandlingMiddleware implements NestMiddleware {
    private readonly appLogger;
    private readonly logger;
    constructor(appLogger: AppLoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class RequestLoggingMiddleware implements NestMiddleware {
    private readonly appLogger;
    constructor(appLogger: AppLoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
    private sanitizeBody;
}
export declare class SecurityHeadersMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly appLogger;
    private readonly requests;
    private readonly maxRequests;
    private readonly windowMs;
    constructor(appLogger: AppLoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
    private cleanup;
}

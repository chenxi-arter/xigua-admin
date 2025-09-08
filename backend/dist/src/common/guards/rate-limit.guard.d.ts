import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export declare const RATE_LIMIT_KEY = "rate-limit-config";
export declare const RateLimit: (config: RateLimitConfig) => import("@nestjs/common").CustomDecorator<string>;
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private readonly logger;
    private readonly requestCounts;
    private readonly defaultConfig;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getRateLimitConfig;
    private generateKey;
    private getClientIp;
    private checkRateLimit;
    private cleanup;
    getRateLimitStatus(request: Request): {
        count: number;
        resetTime: number;
    } | null;
}
export declare const RateLimitConfigs: {
    STRICT: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    NORMAL: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    LOOSE: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    LOGIN: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    COMMENT: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
};

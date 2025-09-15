import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
export declare abstract class BaseController {
    protected success<T = any>(data: T, message?: string | null, code?: number): ApiResponse<T>;
    protected error(message?: string, code?: number, status?: HttpStatus): ApiResponse<null>;
    protected paginatedSuccess<T = any>(data: T[], total: number, page: number, size: number, message?: string | null): PaginatedApiResponse<T>;
    protected setCacheHeaders(res: Response, ttl?: number): void;
    protected setNoCacheHeaders(res: Response): void;
    protected normalizePagination(page: any, size: any, maxSize?: number): {
        page: number;
        size: number;
    };
    protected validateId(id: any, fieldName?: string): number;
    protected handleServiceError(error: any, defaultMessage?: string): void;
}
export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string | null;
    timestamp: string;
}
export interface PaginatedApiResponse<T = any> extends ApiResponse {
    data: {
        list: T[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    };
}
export declare const RetCodes: {
    readonly SUCCESS: 200;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_ERROR: 500;
    readonly VALIDATION_ERROR: 422;
};
export declare const ErrorMessages: {
    readonly 400: "请求参数错误";
    readonly 401: "未授权访问";
    readonly 403: "访问被拒绝";
    readonly 404: "资源不存在";
    readonly 409: "数据冲突";
    readonly 500: "服务器内部错误";
    readonly 422: "数据验证失败";
};

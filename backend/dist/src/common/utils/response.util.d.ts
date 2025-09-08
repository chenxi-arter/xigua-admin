export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
    success: boolean;
    timestamp: number;
}
export interface PageResult<T = any> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
export declare class ResponseUtil {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static pageSuccess<T>(items: T[], total: number, page: number, pageSize: number, message?: string): ApiResponse<PageResult<T>>;
    static error(message?: string, code?: number): ApiResponse<null>;
    static listSuccess<T>(items: T[], total: number, page: number, pageSize: number, message?: string): ApiResponse<{
        list: T[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>;
    static validationError(errors: any, message?: string, code?: number): ApiResponse<{
        errors: any;
    }>;
}

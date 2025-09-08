export interface AdminResponse<T = any> {
    code: number;
    data: T;
    message: string;
    success: boolean;
    timestamp: number;
}
export interface AdminPageResult<T = any> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
export declare class AdminResponseUtil {
    static success<T>(data: T, message?: string): AdminResponse<T>;
    static pageSuccess<T>(items: T[], total: number, page: number, pageSize: number, message?: string): AdminResponse<AdminPageResult<T>>;
    static error(message?: string, code?: number): AdminResponse<null>;
    static listSuccess<T>(items: T[], total: number, page: number, pageSize: number, message?: string): AdminResponse<{
        list: T[];
        total: number;
        page: number;
        size: number;
        hasMore: boolean;
    }>;
    static validationError(errors: any, message?: string, code?: number): AdminResponse<{
        errors: any;
    }>;
}

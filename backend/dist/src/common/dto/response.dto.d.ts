export interface ApiResponse<T = any> {
    code: number;
    data?: T;
    message?: string;
    timestamp?: string;
    path?: string;
}
export interface PaginationInfo {
    total: number;
    page: number;
    size: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface PaginatedResponse<T = any> {
    code: number;
    data: T[];
    pagination: PaginationInfo;
    message?: string;
    timestamp?: string;
}
export interface PaginatedResult<T = any> {
    data: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}
export declare class ResponseWrapper {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static paginated<T>(data: T[], total: number, page: number, size: number, message?: string): PaginatedResponse<T>;
    static error(message: string, code?: number): ApiResponse<null>;
    static create<T>(data: T, code?: number, msg?: string | null): any;
}

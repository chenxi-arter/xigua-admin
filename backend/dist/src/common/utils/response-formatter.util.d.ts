export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
    requestId?: string;
    pagination?: PaginationInfo;
}
export interface PaginationInfo {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface ErrorResponse {
    code: number;
    message: string;
    error?: string;
    details?: any;
    timestamp: string;
    path?: string;
    requestId?: string;
}
export declare class ResponseFormatter {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static successWithPagination<T>(data: T[], pagination: PaginationInfo, message?: string): ApiResponse<T[]>;
    static created<T>(data: T, message?: string): ApiResponse<T>;
    static noContent(message?: string): ApiResponse<null>;
    static clientError(message?: string, code?: number, details?: any): ErrorResponse;
    static validationError(message?: string, details?: any): ErrorResponse;
    static unauthorized(message?: string): ErrorResponse;
    static forbidden(message?: string): ErrorResponse;
    static notFound(message?: string): ErrorResponse;
    static conflict(message?: string): ErrorResponse;
    static tooManyRequests(message?: string): ErrorResponse;
    static serverError(message?: string, error?: string, details?: any): ErrorResponse;
    static serviceUnavailable(message?: string): ErrorResponse;
    static gatewayTimeout(message?: string): ErrorResponse;
    static withRequestId<T extends ApiResponse | ErrorResponse>(response: T, requestId: string): T;
    static withPath(response: ErrorResponse, path: string): ErrorResponse;
    static createPagination(page: number, size: number, total: number): PaginationInfo;
    static formatValidationErrors(errors: any[]): any;
    static isSuccess(response: ApiResponse | ErrorResponse): response is ApiResponse;
    static isError(response: ApiResponse | ErrorResponse): response is ErrorResponse;
    static getStatusText(code: number): string;
}
export declare function ApiResponseDecorator(description?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

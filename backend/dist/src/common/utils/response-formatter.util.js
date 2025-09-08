"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
exports.ApiResponseDecorator = ApiResponseDecorator;
class ResponseFormatter {
    static success(data, message = '操作成功') {
        return {
            code: 200,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }
    static successWithPagination(data, pagination, message = '获取成功') {
        return {
            code: 200,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString(),
        };
    }
    static created(data, message = '创建成功') {
        return {
            code: 201,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }
    static noContent(message = '操作成功') {
        return {
            code: 204,
            message,
            data: null,
            timestamp: new Date().toISOString(),
        };
    }
    static clientError(message = '请求错误', code = 400, details) {
        return {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
        };
    }
    static validationError(message = '数据验证失败', details) {
        return {
            code: 422,
            message,
            error: 'Validation Error',
            details,
            timestamp: new Date().toISOString(),
        };
    }
    static unauthorized(message = '未授权访问') {
        return {
            code: 401,
            message,
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
        };
    }
    static forbidden(message = '禁止访问') {
        return {
            code: 403,
            message,
            error: 'Forbidden',
            timestamp: new Date().toISOString(),
        };
    }
    static notFound(message = '资源未找到') {
        return {
            code: 404,
            message,
            error: 'Not Found',
            timestamp: new Date().toISOString(),
        };
    }
    static conflict(message = '请求冲突') {
        return {
            code: 409,
            message,
            error: 'Conflict',
            timestamp: new Date().toISOString(),
        };
    }
    static tooManyRequests(message = '请求过于频繁') {
        return {
            code: 429,
            message,
            error: 'Too Many Requests',
            timestamp: new Date().toISOString(),
        };
    }
    static serverError(message = '服务器内部错误', error, details) {
        return {
            code: 500,
            message,
            error: error || 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? details : undefined,
            timestamp: new Date().toISOString(),
        };
    }
    static serviceUnavailable(message = '服务暂时不可用') {
        return {
            code: 503,
            message,
            error: 'Service Unavailable',
            timestamp: new Date().toISOString(),
        };
    }
    static gatewayTimeout(message = '网关超时') {
        return {
            code: 504,
            message,
            error: 'Gateway Timeout',
            timestamp: new Date().toISOString(),
        };
    }
    static withRequestId(response, requestId) {
        return {
            ...response,
            requestId,
        };
    }
    static withPath(response, path) {
        return {
            ...response,
            path,
        };
    }
    static createPagination(page, size, total) {
        const totalPages = Math.ceil(total / size);
        return {
            page,
            size,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }
    static formatValidationErrors(errors) {
        const formatted = {};
        errors.forEach(error => {
            const property = error.property;
            const constraints = error.constraints || {};
            formatted[property] = Object.values(constraints);
        });
        return formatted;
    }
    static isSuccess(response) {
        return response.code >= 200 && response.code < 300;
    }
    static isError(response) {
        return response.code >= 400;
    }
    static getStatusText(code) {
        const statusTexts = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Unprocessable Entity',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
        };
        return statusTexts[code] || 'Unknown Status';
    }
}
exports.ResponseFormatter = ResponseFormatter;
function ApiResponseDecorator(description) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                const result = await originalMethod.apply(this, args);
                if (result && typeof result === 'object' && 'code' in result) {
                    return result;
                }
                return ResponseFormatter.success(result, description || '操作成功');
            }
            catch (error) {
                if (error instanceof Error && 'status' in error) {
                    throw error;
                }
                throw ResponseFormatter.serverError('操作失败', error instanceof Error ? error.message : String(error));
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=response-formatter.util.js.map
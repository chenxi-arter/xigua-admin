"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.RetCodes = exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
class BaseController {
    success(data, message = null, code = 200) {
        return {
            code,
            data,
            message,
            timestamp: new Date().toISOString()
        };
    }
    error(message = 'error', code = 500, status = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new common_1.HttpException({
            code,
            data: null,
            message,
            timestamp: new Date().toISOString()
        }, status);
    }
    paginatedSuccess(data, total, page, size, message = null) {
        return {
            code: 200,
            data: {
                list: data,
                total,
                page,
                size,
                hasMore: total > page * size
            },
            message,
            timestamp: new Date().toISOString()
        };
    }
    setCacheHeaders(res, ttl = 300) {
        res.setHeader('Cache-Control', `public, max-age=${ttl}`);
        res.setHeader('X-Cache-TTL', ttl.toString());
    }
    setNoCacheHeaders(res) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    normalizePagination(page, size, maxSize = 50) {
        const pageNum = Math.max(1, parseInt(page?.toString() || '1', 10));
        const pageSize = Math.min(maxSize, Math.max(1, parseInt(size?.toString() || '20', 10)));
        return { page: pageNum, size: pageSize };
    }
    validateId(id, fieldName = 'ID') {
        const numId = parseInt(id?.toString(), 10);
        if (isNaN(numId) || numId <= 0) {
            this.error(`${fieldName}参数无效`, 400, common_1.HttpStatus.BAD_REQUEST);
        }
        return numId;
    }
    handleServiceError(error, defaultMessage = '操作失败') {
        console.error('Service Error:', error);
        if (error instanceof common_1.HttpException) {
            throw error;
        }
        if (error.code === 'ER_DUP_ENTRY') {
            this.error('数据已存在', 409, common_1.HttpStatus.CONFLICT);
        }
        if (error.code === 'ER_NO_REFERENCED_ROW') {
            this.error('关联数据不存在', 404, common_1.HttpStatus.NOT_FOUND);
        }
        this.error(defaultMessage, 500, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.BaseController = BaseController;
exports.RetCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    VALIDATION_ERROR: 422
};
exports.ErrorMessages = {
    [exports.RetCodes.BAD_REQUEST]: '请求参数错误',
    [exports.RetCodes.UNAUTHORIZED]: '未授权访问',
    [exports.RetCodes.FORBIDDEN]: '访问被拒绝',
    [exports.RetCodes.NOT_FOUND]: '资源不存在',
    [exports.RetCodes.CONFLICT]: '数据冲突',
    [exports.RetCodes.INTERNAL_ERROR]: '服务器内部错误',
    [exports.RetCodes.VALIDATION_ERROR]: '数据验证失败'
};
//# sourceMappingURL=base.controller.js.map
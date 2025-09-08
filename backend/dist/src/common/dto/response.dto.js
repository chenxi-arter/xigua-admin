"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseWrapper = void 0;
class ResponseWrapper {
    static success(data, message = 'success') {
        return {
            code: 200,
            data,
            message,
            timestamp: new Date().toISOString(),
        };
    }
    static paginated(data, total, page, size, message = 'success') {
        const totalPages = Math.ceil(total / size);
        return {
            code: 200,
            data,
            pagination: {
                total,
                page,
                size,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
            message,
            timestamp: new Date().toISOString(),
        };
    }
    static error(message, code = 400) {
        return {
            code,
            data: null,
            message,
            timestamp: new Date().toISOString(),
        };
    }
    static create(data, code = 200, msg = null) {
        return {
            data,
            code,
            msg,
        };
    }
}
exports.ResponseWrapper = ResponseWrapper;
//# sourceMappingURL=response.dto.js.map
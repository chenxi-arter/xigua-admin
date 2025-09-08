"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminResponseUtil = void 0;
class AdminResponseUtil {
    static success(data, message = '操作成功') {
        return {
            code: 200,
            data,
            message,
            success: true,
            timestamp: Date.now(),
        };
    }
    static pageSuccess(items, total, page, pageSize, message = '获取成功') {
        const hasMore = total > page * pageSize;
        return this.success({ items, total, page, pageSize, hasMore }, message);
    }
    static error(message = '操作失败', code = 400) {
        return {
            code,
            data: null,
            message,
            success: false,
            timestamp: Date.now(),
        };
    }
    static listSuccess(items, total, page, pageSize, message = '获取成功') {
        const hasMore = total > page * pageSize;
        return this.success({ list: items, total, page, size: pageSize, hasMore }, message);
    }
    static validationError(errors, message = '参数验证失败', code = 422) {
        return {
            code,
            data: { errors },
            message,
            success: false,
            timestamp: Date.now(),
        };
    }
}
exports.AdminResponseUtil = AdminResponseUtil;
//# sourceMappingURL=admin-response.util.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestResultInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const response_util_1 = require("../utils/response.util");
let IngestResultInterceptor = class IngestResultInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            if (data && data.summary && Array.isArray(data.items)) {
                return response_util_1.ResponseUtil.success(data, '系列数据导入完成');
            }
            if (data && data.seriesId) {
                const item = {
                    statusCode: 200,
                    seriesId: data.seriesId,
                    shortId: data.shortId ?? null,
                    externalId: data.externalId ?? null,
                    action: data.action ?? 'updated',
                };
                const wrapped = {
                    summary: {
                        created: data.action === 'created' ? 1 : 0,
                        updated: data.action === 'updated' ? 1 : 0,
                        failed: 0,
                        total: 1,
                    },
                    items: [item],
                };
                return response_util_1.ResponseUtil.success(wrapped, '系列数据导入完成');
            }
            return response_util_1.ResponseUtil.success(data, '系列数据导入完成');
        }), (0, rxjs_1.catchError)((err) => {
            const status = err?.status || 400;
            const error = err?.response?.message || err?.message || 'unknown error';
            const details = err?.response?.details;
            const item = { statusCode: status, error, details };
            const wrapped = {
                summary: { created: 0, updated: 0, failed: 1, total: 1 },
                items: [item],
            };
            return (0, rxjs_1.of)(response_util_1.ResponseUtil.success(wrapped, '系列数据导入完成'));
        }));
    }
};
exports.IngestResultInterceptor = IngestResultInterceptor;
exports.IngestResultInterceptor = IngestResultInterceptor = __decorate([
    (0, common_1.Injectable)()
], IngestResultInterceptor);
//# sourceMappingURL=ingest-result.interceptor.js.map
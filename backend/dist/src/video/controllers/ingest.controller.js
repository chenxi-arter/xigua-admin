"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestController = void 0;
const common_1 = require("@nestjs/common");
const ingest_result_interceptor_1 = require("../../common/interceptors/ingest-result.interceptor");
const validation_to_items_pipe_1 = require("../../common/pipes/validation-to-items.pipe");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ingest_service_1 = require("../services/ingest.service");
const ingest_series_dto_1 = require("../dto/ingest-series.dto");
const update_ingest_series_dto_1 = require("../dto/update-ingest-series.dto");
const response_util_1 = require("../../common/utils/response.util");
let IngestController = class IngestController {
    ingestService;
    constructor(ingestService) {
        this.ingestService = ingestService;
    }
    async ingestSeries(dto) {
        return this.ingestService.upsertSeries(dto);
    }
    async ingestSeriesBatch(payload) {
        const results = [];
        let createdCount = 0;
        let updatedCount = 0;
        let failedCount = 0;
        for (const item of payload.items || []) {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(ingest_series_dto_1.IngestSeriesDto, item);
            const errors = await (0, class_validator_1.validate)(dtoInstance, { whitelist: false, forbidNonWhitelisted: false });
            if (errors.length) {
                failedCount++;
                const details = errors.map((e) => ({ property: e.property, constraints: e.constraints, children: e.children?.length ? e.children : undefined }));
                results.push({ statusCode: 400, error: '参数验证失败', details, externalId: item.externalId, title: item.title });
                continue;
            }
            try {
                const res = await this.ingestService.upsertSeries(item);
                results.push({ statusCode: 200, seriesId: res.seriesId, shortId: res.shortId, action: res.action, externalId: res.externalId, title: item.title });
                if (res.action === 'created')
                    createdCount++;
                if (res.action === 'updated')
                    updatedCount++;
            }
            catch (e) {
                failedCount++;
                results.push({ statusCode: e?.status || 400, error: e?.response?.message || e?.message || 'unknown error', details: e?.response?.details, externalId: item.externalId, title: item.title });
            }
        }
        return response_util_1.ResponseUtil.success({
            summary: { created: createdCount, updated: updatedCount, failed: failedCount, total: (payload.items || []).length },
            items: results
        }, '批量系列数据导入完成');
    }
    async updateSeries(dto) {
        return this.ingestService.updateSeries(dto);
    }
    async getSeriesProgress(externalId) {
        try {
            const data = await this.ingestService.getSeriesProgressByExternalId(externalId);
            return response_util_1.ResponseUtil.success(data, '系列进度获取成功');
        }
        catch (e) {
            const status = e?.status || 400;
            const message = e?.response?.message || e?.message || 'unknown error';
            return response_util_1.ResponseUtil.error(message, status);
        }
    }
};
exports.IngestController = IngestController;
__decorate([
    (0, common_1.Post)('series'),
    (0, common_1.UseInterceptors)(ingest_result_interceptor_1.IngestResultInterceptor),
    __param(0, (0, common_1.Body)(new validation_to_items_pipe_1.ValidationToItemsPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_series_dto_1.IngestSeriesDto]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestSeries", null);
__decorate([
    (0, common_1.Post)('series/batch'),
    (0, common_1.UseInterceptors)(ingest_result_interceptor_1.IngestResultInterceptor),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestSeriesBatch", null);
__decorate([
    (0, common_1.Post)('series/update'),
    (0, common_1.UseInterceptors)(ingest_result_interceptor_1.IngestResultInterceptor),
    __param(0, (0, common_1.Body)(new validation_to_items_pipe_1.ValidationToItemsPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_ingest_series_dto_1.UpdateIngestSeriesDto]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "updateSeries", null);
__decorate([
    (0, common_1.Get)('series/progress/:externalId'),
    __param(0, (0, common_1.Param)('externalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "getSeriesProgress", null);
exports.IngestController = IngestController = __decorate([
    (0, common_1.Controller)('admin/ingest'),
    __metadata("design:paramtypes", [ingest_service_1.IngestService])
], IngestController);
//# sourceMappingURL=ingest.controller.js.map
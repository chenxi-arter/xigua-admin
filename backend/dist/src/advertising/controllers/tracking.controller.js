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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const dto_1 = require("../dto");
let TrackingController = class TrackingController {
    trackingService;
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async createEvent(createEventDto, req) {
        const ipAddress = this.getClientIp(req);
        const result = await this.trackingService.createEvent(createEventDto, ipAddress);
        return {
            code: result.success ? 200 : 400,
            message: result.message || (result.success ? 'success' : 'error'),
            data: result,
        };
    }
    async createEventsBatch(batchCreateEventDto, req) {
        const ipAddress = this.getClientIp(req);
        const result = await this.trackingService.createEventsBatch(batchCreateEventDto, ipAddress);
        return {
            code: result.success ? 200 : 400,
            message: result.message || (result.success ? 'success' : 'error'),
            data: result,
        };
    }
    async createConversion(createConversionDto) {
        const result = await this.trackingService.createConversion(createConversionDto);
        return {
            code: result.success ? 200 : 400,
            message: result.message || (result.success ? 'success' : 'error'),
            data: result,
        };
    }
    getClientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '');
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Post)('event'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Post)('events/batch'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BatchCreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "createEventsBatch", null);
__decorate([
    (0, common_1.Post)('conversion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConversionDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "createConversion", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('tracking/advertising'),
    __metadata("design:paramtypes", [services_1.TrackingService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map
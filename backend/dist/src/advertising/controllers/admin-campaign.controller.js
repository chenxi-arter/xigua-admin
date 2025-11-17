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
exports.AdminCampaignController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const dto_1 = require("../dto");
let AdminCampaignController = class AdminCampaignController {
    campaignService;
    analyticsService;
    constructor(campaignService, analyticsService) {
        this.campaignService = campaignService;
        this.analyticsService = analyticsService;
    }
    async findAll(query) {
        const result = await this.campaignService.findAll(query);
        return {
            code: 200,
            message: 'success',
            data: result,
        };
    }
    async findOne(id) {
        const campaign = await this.campaignService.findOne(id);
        return {
            code: 200,
            message: 'success',
            data: campaign,
        };
    }
    async create(createCampaignDto) {
        const campaign = await this.campaignService.create(createCampaignDto, 'admin');
        return {
            code: 200,
            message: 'Campaign created successfully',
            data: campaign,
        };
    }
    async update(id, updateCampaignDto) {
        const campaign = await this.campaignService.update(id, updateCampaignDto);
        return {
            code: 200,
            message: 'Campaign updated successfully',
            data: campaign,
        };
    }
    async updateStatus(id, updateStatusDto) {
        const campaign = await this.campaignService.updateStatus(id, updateStatusDto);
        return {
            code: 200,
            message: 'Campaign status updated successfully',
            data: campaign,
        };
    }
    async remove(id) {
        await this.campaignService.remove(id);
        return {
            code: 200,
            message: 'Campaign deleted successfully',
        };
    }
    async getStats(id, query) {
        const stats = await this.analyticsService.getCampaignStats(id, query.from, query.to);
        return {
            code: 200,
            message: 'success',
            data: stats,
        };
    }
};
exports.AdminCampaignController = AdminCampaignController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CampaignQueryDto]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCampaignDto]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCampaignStatusDto]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminCampaignController.prototype, "getStats", null);
exports.AdminCampaignController = AdminCampaignController = __decorate([
    (0, common_1.Controller)('admin/advertising/campaigns'),
    __metadata("design:paramtypes", [services_1.CampaignService,
        services_1.AnalyticsService])
], AdminCampaignController);
//# sourceMappingURL=admin-campaign.controller.js.map
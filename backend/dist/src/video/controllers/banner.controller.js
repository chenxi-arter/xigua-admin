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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("../services/banner.service");
const admin_response_util_1 = require("../../common/utils/admin-response.util");
const banner_dto_1 = require("../dto/banner.dto");
let BannerController = class BannerController {
    bannerService;
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async createBanner(createBannerDto) {
        const banner = await this.bannerService.createBanner(createBannerDto);
        const resp = admin_response_util_1.AdminResponseUtil.success(banner, '创建成功');
        return { code: resp.code, msg: '创建成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async updateBanner(id, updateBannerDto) {
        const banner = await this.bannerService.updateBanner(id, updateBannerDto);
        const resp = admin_response_util_1.AdminResponseUtil.success(banner, '更新成功');
        return { code: resp.code, msg: '更新成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async deleteBanner(id) {
        await this.bannerService.deleteBanner(id);
        const resp = admin_response_util_1.AdminResponseUtil.success(null, '删除成功');
        return { code: resp.code, msg: '删除成功', success: resp.success, timestamp: resp.timestamp };
    }
    async getBannerById(id) {
        const banner = await this.bannerService.getBannerById(id);
        const resp = admin_response_util_1.AdminResponseUtil.success(banner, '获取成功');
        return { code: resp.code, msg: '获取成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async getBanners(queryDto) {
        const result = await this.bannerService.getBanners(queryDto);
        const resp = admin_response_util_1.AdminResponseUtil.success(result, '获取成功');
        return { code: resp.code, msg: '获取成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async toggleBannerStatus(id, isActive) {
        const banner = await this.bannerService.toggleBannerStatus(id, isActive);
        const resp = admin_response_util_1.AdminResponseUtil.success(banner, '操作成功');
        return { code: resp.code, msg: '操作成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async updateBannerWeights(updates) {
        await this.bannerService.updateBannerWeights(updates);
        const resp = admin_response_util_1.AdminResponseUtil.success(null, '更新成功');
        return { code: resp.code, msg: '更新成功', success: resp.success, timestamp: resp.timestamp };
    }
    async getActiveBanners(categoryId, limit = 5) {
        const banners = await this.bannerService.getActiveBanners(categoryId, limit);
        const resp = admin_response_util_1.AdminResponseUtil.success(banners, '获取成功');
        return { code: resp.code, msg: '获取成功', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
    async impression(id) {
        await this.bannerService.incrementImpression(id);
        const resp = admin_response_util_1.AdminResponseUtil.success(null, 'ok');
        return { code: resp.code, msg: 'ok', success: resp.success, timestamp: resp.timestamp };
    }
    async track(body) {
        const { id, type } = body;
        if (type === 'click') {
            await this.bannerService.incrementClick(id);
        }
        else if (type === 'impression') {
            await this.bannerService.incrementImpression(id);
        }
        const resp = admin_response_util_1.AdminResponseUtil.success(null, 'ok');
        return { code: resp.code, msg: 'ok', success: resp.success, timestamp: resp.timestamp };
    }
    async click(id) {
        await this.bannerService.incrementClick(id);
        const resp = admin_response_util_1.AdminResponseUtil.success(null, 'ok');
        return { code: resp.code, msg: 'ok', success: resp.success, timestamp: resp.timestamp };
    }
    async stats(id, from, to) {
        const data = await this.bannerService.getBannerDailyStats(id, from, to);
        const resp = admin_response_util_1.AdminResponseUtil.success(data, 'ok');
        return { code: resp.code, msg: 'ok', data: resp.data, success: resp.success, timestamp: resp.timestamp };
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "createBanner", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, banner_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "updateBanner", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "deleteBanner", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBannerById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banner_dto_1.BannerQueryDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "toggleBannerStatus", null);
__decorate([
    (0, common_1.Put)('weights'),
    __param(0, (0, common_1.Body)('updates')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "updateBannerWeights", null);
__decorate([
    (0, common_1.Get)('active/list'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getActiveBanners", null);
__decorate([
    (0, common_1.Post)(':id/impression'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "impression", null);
__decorate([
    (0, common_1.Post)('track'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "track", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "click", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "stats", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map
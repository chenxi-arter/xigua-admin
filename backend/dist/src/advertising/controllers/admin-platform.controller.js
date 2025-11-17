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
exports.AdminPlatformController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const dto_1 = require("../dto");
let AdminPlatformController = class AdminPlatformController {
    platformService;
    constructor(platformService) {
        this.platformService = platformService;
    }
    async findAll(enabled) {
        const enabledFilter = enabled !== undefined ? enabled === 'true' : undefined;
        const platforms = await this.platformService.findAll(enabledFilter);
        return {
            code: 200,
            message: 'success',
            data: platforms.map(platform => ({
                id: platform.id,
                name: platform.name,
                code: platform.code,
                description: platform.description,
                iconUrl: platform.iconUrl,
                color: platform.color,
                isEnabled: platform.isEnabled,
                sortOrder: platform.sortOrder,
                config: platform.config,
                createdAt: platform.createdAt,
                updatedAt: platform.updatedAt,
            })),
        };
    }
    async findOne(id) {
        const platform = await this.platformService.findOne(id);
        return {
            code: 200,
            message: 'success',
            data: {
                id: platform.id,
                name: platform.name,
                code: platform.code,
                description: platform.description,
                iconUrl: platform.iconUrl,
                color: platform.color,
                isEnabled: platform.isEnabled,
                sortOrder: platform.sortOrder,
                config: platform.config,
                createdAt: platform.createdAt,
                updatedAt: platform.updatedAt,
            },
        };
    }
    async create(createPlatformDto) {
        const platform = await this.platformService.create(createPlatformDto, 'admin');
        return {
            code: 200,
            message: 'Platform created successfully',
            data: {
                id: platform.id,
                name: platform.name,
                code: platform.code,
                description: platform.description,
                iconUrl: platform.iconUrl,
                color: platform.color,
                isEnabled: platform.isEnabled,
                sortOrder: platform.sortOrder,
                config: platform.config,
                createdAt: platform.createdAt,
                updatedAt: platform.updatedAt,
            },
        };
    }
    async update(id, updatePlatformDto) {
        const platform = await this.platformService.update(id, updatePlatformDto);
        return {
            code: 200,
            message: 'Platform updated successfully',
            data: {
                id: platform.id,
                name: platform.name,
                code: platform.code,
                description: platform.description,
                iconUrl: platform.iconUrl,
                color: platform.color,
                isEnabled: platform.isEnabled,
                sortOrder: platform.sortOrder,
                config: platform.config,
                createdAt: platform.createdAt,
                updatedAt: platform.updatedAt,
            },
        };
    }
    async updateStatus(id, updateStatusDto) {
        const platform = await this.platformService.updateStatus(id, updateStatusDto);
        return {
            code: 200,
            message: 'Platform status updated successfully',
            data: {
                id: platform.id,
                name: platform.name,
                code: platform.code,
                description: platform.description,
                iconUrl: platform.iconUrl,
                color: platform.color,
                isEnabled: platform.isEnabled,
                sortOrder: platform.sortOrder,
                config: platform.config,
                createdAt: platform.createdAt,
                updatedAt: platform.updatedAt,
            },
        };
    }
    async updateSort(updateSortDto) {
        await this.platformService.updateSort(updateSortDto);
        return {
            code: 200,
            message: 'Platform sort order updated successfully',
        };
    }
    async remove(id) {
        await this.platformService.remove(id);
        return {
            code: 200,
            message: 'Platform deleted successfully',
        };
    }
};
exports.AdminPlatformController = AdminPlatformController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('enabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePlatformDto]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdatePlatformDto]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdatePlatformStatusDto]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('sort'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdatePlatformSortDto]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "updateSort", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPlatformController.prototype, "remove", null);
exports.AdminPlatformController = AdminPlatformController = __decorate([
    (0, common_1.Controller)('admin/advertising/platforms'),
    __metadata("design:paramtypes", [services_1.PlatformService])
], AdminPlatformController);
//# sourceMappingURL=admin-platform.controller.js.map
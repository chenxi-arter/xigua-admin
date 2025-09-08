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
exports.BaseModuleController = void 0;
const common_1 = require("@nestjs/common");
const home_videos_dto_1 = require("./dto/home-videos.dto");
class BaseModuleController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async getHomeVideos(dto) {
        if (dto.channeid === undefined || dto.channeid === null) {
            return {
                data: null,
                code: 400,
                msg: '请选择具体的频道分类，不支持显示全部分类'
            };
        }
        const method = this.getModuleVideosMethod();
        return await method.call(this.videoService, dto.channeid, dto.page || 1);
    }
    async getFiltersTags(channeid) {
        return this.videoService.getFiltersTags(channeid || this.getDefaultChannelId().toString());
    }
    async getFiltersData(channeid, ids, page) {
        return this.videoService.getFiltersData(channeid || this.getDefaultChannelId().toString(), ids || '0,0,0,0,0', page || '1');
    }
}
exports.BaseModuleController = BaseModuleController;
__decorate([
    (0, common_1.Get)('gethomemodules'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_videos_dto_1.HomeVideosDto]),
    __metadata("design:returntype", Promise)
], BaseModuleController.prototype, "getHomeVideos", null);
__decorate([
    (0, common_1.Get)('getfilterstags'),
    __param(0, (0, common_1.Query)('channeid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseModuleController.prototype, "getFiltersTags", null);
__decorate([
    (0, common_1.Get)('getfiltersdata'),
    __param(0, (0, common_1.Query)('channeid')),
    __param(1, (0, common_1.Query)('ids')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BaseModuleController.prototype, "getFiltersData", null);
//# sourceMappingURL=base-module.controller.js.map
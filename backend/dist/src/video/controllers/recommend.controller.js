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
exports.RecommendController = void 0;
const common_1 = require("@nestjs/common");
const recommend_service_1 = require("../services/recommend.service");
const recommend_dto_1 = require("../dto/recommend.dto");
const base_controller_1 = require("./base.controller");
let RecommendController = class RecommendController extends base_controller_1.BaseController {
    recommendService;
    constructor(recommendService) {
        super();
        this.recommendService = recommendService;
    }
    async getRecommendList(dto) {
        try {
            const { page, size } = this.normalizePagination(dto.page, dto.size, 20);
            const result = await this.recommendService.getRecommendList(page, size);
            return this.success(result, '获取推荐成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取推荐失败');
        }
    }
};
exports.RecommendController = RecommendController;
__decorate([
    (0, common_1.Get)('recommend'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recommend_dto_1.RecommendQueryDto]),
    __metadata("design:returntype", Promise)
], RecommendController.prototype, "getRecommendList", null);
exports.RecommendController = RecommendController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [recommend_service_1.RecommendService])
], RecommendController);
//# sourceMappingURL=recommend.controller.js.map
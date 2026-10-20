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
exports.ShortLinkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const short_link_service_1 = require("../services/short-link.service");
const short_link_dto_1 = require("../dto/short-link.dto");
const response_dto_1 = require("../dto/response.dto");
const jwt_or_admin_guard_1 = require("../../auth/guards/jwt-or-admin.guard");
let ShortLinkController = class ShortLinkController {
    shortLinkService;
    constructor(shortLinkService) {
        this.shortLinkService = shortLinkService;
    }
    async createShortLink(dto) {
        const result = await this.shortLinkService.createShortLink(dto);
        return response_dto_1.ResponseWrapper.success(result, '短链接创建成功');
    }
};
exports.ShortLinkController = ShortLinkController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: '创建短链接',
        description: '需要登录。创建短链接会消耗 Short.io 配额，请谨慎使用。'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '短链接创建成功', type: short_link_dto_1.ShortLinkResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '请求参数错误' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '未授权，需要登录' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'URL 不在白名单内' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '服务器错误' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [short_link_dto_1.CreateShortLinkDto]),
    __metadata("design:returntype", Promise)
], ShortLinkController.prototype, "createShortLink", null);
exports.ShortLinkController = ShortLinkController = __decorate([
    (0, swagger_1.ApiTags)('短链接'),
    (0, common_1.Controller)('short-links'),
    (0, common_1.UseGuards)(jwt_or_admin_guard_1.JwtOrAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [short_link_service_1.ShortLinkService])
], ShortLinkController);
//# sourceMappingURL=short-link.controller.js.map
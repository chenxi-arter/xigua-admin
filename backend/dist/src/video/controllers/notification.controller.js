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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const base_controller_1 = require("./base.controller");
const notification_service_1 = require("../services/notification.service");
let NotificationController = class NotificationController extends base_controller_1.BaseController {
    notificationService;
    constructor(notificationService) {
        super();
        this.notificationService = notificationService;
    }
    async getUnreadCount(req) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return this.error('未认证', 401);
            const counts = await this.notificationService.getUnreadCounts(userId);
            return this.success(counts, '获取成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取未读通知数量失败');
        }
    }
    async getAllUnread(req, page, size) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return this.error('未认证', 401);
            const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);
            const sizeNum = Math.max(parseInt(size ?? '20', 10) || 20, 1);
            const result = await this.notificationService.getAllUnreadNotifications(userId, pageNum, sizeNum);
            return this.success(result, '获取成功', 200);
        }
        catch (error) {
            return this.handleServiceError(error, '获取未读通知失败');
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllUnread", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map
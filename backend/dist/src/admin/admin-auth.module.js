"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const admin_user_entity_1 = require("./entity/admin-user.entity");
const admin_auth_service_1 = require("./services/admin-auth.service");
const admin_jwt_auth_guard_1 = require("./guards/admin-jwt-auth.guard");
let AdminAuthModule = class AdminAuthModule {
};
exports.AdminAuthModule = AdminAuthModule;
exports.AdminAuthModule = AdminAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '8h' },
            }),
            typeorm_1.TypeOrmModule.forFeature([admin_user_entity_1.AdminUser]),
        ],
        providers: [admin_auth_service_1.AdminAuthService, admin_jwt_auth_guard_1.AdminJwtAuthGuard],
        exports: [jwt_1.JwtModule, typeorm_1.TypeOrmModule, admin_auth_service_1.AdminAuthService, admin_jwt_auth_guard_1.AdminJwtAuthGuard],
    })
], AdminAuthModule);
//# sourceMappingURL=admin-auth.module.js.map
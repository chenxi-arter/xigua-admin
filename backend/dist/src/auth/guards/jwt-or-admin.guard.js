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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtOrAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const admin_jwt_auth_guard_1 = require("../../admin/guards/admin-jwt-auth.guard");
let JwtOrAdminGuard = class JwtOrAdminGuard {
    userGuard;
    adminGuard;
    constructor(userGuard, adminGuard) {
        this.userGuard = userGuard;
        this.adminGuard = adminGuard;
    }
    async canActivate(context) {
        try {
            if (await this.adminGuard.canActivate(context)) {
                return true;
            }
        }
        catch {
        }
        return (await this.userGuard.canActivate(context));
    }
};
exports.JwtOrAdminGuard = JwtOrAdminGuard;
exports.JwtOrAdminGuard = JwtOrAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_auth_guard_1.JwtAuthGuard,
        admin_jwt_auth_guard_1.AdminJwtAuthGuard])
], JwtOrAdminGuard);
//# sourceMappingURL=jwt-or-admin.guard.js.map
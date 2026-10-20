"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkModule = void 0;
const common_1 = require("@nestjs/common");
const short_link_controller_1 = require("./controllers/short-link.controller");
const short_link_service_1 = require("./services/short-link.service");
const dau_service_1 = require("../admin/services/dau.service");
const admin_auth_module_1 = require("../admin/admin-auth.module");
const jwt_or_admin_guard_1 = require("../auth/guards/jwt-or-admin.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ShortLinkModule = class ShortLinkModule {
};
exports.ShortLinkModule = ShortLinkModule;
exports.ShortLinkModule = ShortLinkModule = __decorate([
    (0, common_1.Module)({
        imports: [admin_auth_module_1.AdminAuthModule],
        controllers: [short_link_controller_1.ShortLinkController],
        providers: [short_link_service_1.ShortLinkService, dau_service_1.DauService, jwt_auth_guard_1.JwtAuthGuard, jwt_or_admin_guard_1.JwtOrAdminGuard],
        exports: [short_link_service_1.ShortLinkService],
    })
], ShortLinkModule);
//# sourceMappingURL=short-link.module.js.map
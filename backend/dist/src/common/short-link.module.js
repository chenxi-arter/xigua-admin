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
let ShortLinkModule = class ShortLinkModule {
};
exports.ShortLinkModule = ShortLinkModule;
exports.ShortLinkModule = ShortLinkModule = __decorate([
    (0, common_1.Module)({
        controllers: [short_link_controller_1.ShortLinkController],
        providers: [short_link_service_1.ShortLinkService],
        exports: [short_link_service_1.ShortLinkService],
    })
], ShortLinkModule);
//# sourceMappingURL=short-link.module.js.map
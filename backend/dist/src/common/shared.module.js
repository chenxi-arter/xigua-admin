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
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const entities_module_1 = require("./base/entities.module");
const access_key_util_1 = require("./utils/access-key.util");
let SharedModule = class SharedModule {
    constructor() {
        console.log('🔧 Shared utilities and entities loaded');
    }
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            entities_module_1.EntitiesModule,
        ],
        providers: [
            access_key_util_1.AccessKeyUtil,
        ],
        exports: [
            entities_module_1.EntitiesModule,
            access_key_util_1.AccessKeyUtil,
        ],
    }),
    __metadata("design:paramtypes", [])
], SharedModule);
//# sourceMappingURL=shared.module.js.map
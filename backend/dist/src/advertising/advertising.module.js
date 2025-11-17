"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entity_1 = require("./entity");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
let AdvertisingModule = class AdvertisingModule {
};
exports.AdvertisingModule = AdvertisingModule;
exports.AdvertisingModule = AdvertisingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entity_1.AdvertisingPlatform,
                entity_1.AdvertisingCampaign,
                entity_1.AdvertisingEvent,
                entity_1.AdvertisingConversion,
                entity_1.AdvertisingCampaignStats,
            ]),
        ],
        controllers: [
            controllers_1.AdminPlatformController,
            controllers_1.AdminCampaignController,
            controllers_1.AdminAnalyticsController,
            controllers_1.TrackingController,
        ],
        providers: [
            services_1.PlatformService,
            services_1.CampaignService,
            services_1.TrackingService,
            services_1.AnalyticsService,
        ],
        exports: [
            services_1.PlatformService,
            services_1.CampaignService,
            services_1.TrackingService,
            services_1.AnalyticsService,
        ],
    })
], AdvertisingModule);
//# sourceMappingURL=advertising.module.js.map
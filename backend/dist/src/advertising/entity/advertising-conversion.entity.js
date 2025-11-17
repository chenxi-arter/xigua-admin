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
exports.AdvertisingConversion = exports.ConversionType = void 0;
const typeorm_1 = require("typeorm");
const advertising_campaign_entity_1 = require("./advertising-campaign.entity");
var ConversionType;
(function (ConversionType) {
    ConversionType["REGISTER"] = "register";
    ConversionType["FIRST_PLAY"] = "first_play";
    ConversionType["SUBSCRIPTION"] = "subscription";
    ConversionType["PURCHASE"] = "purchase";
})(ConversionType || (exports.ConversionType = ConversionType = {}));
let AdvertisingConversion = class AdvertisingConversion {
    id;
    campaignId;
    campaignCode;
    conversionType;
    conversionValue;
    userId;
    sessionId;
    deviceId;
    firstClickTime;
    conversionTime;
    timeToConversion;
    attributionModel;
    createdAt;
    campaign;
};
exports.AdvertisingConversion = AdvertisingConversion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], AdvertisingConversion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_id', type: 'bigint', nullable: false, comment: '投放计划ID' }),
    __metadata("design:type", Number)
], AdvertisingConversion.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_code', type: 'varchar', length: 50, nullable: false, comment: '计划代码' }),
    __metadata("design:type", String)
], AdvertisingConversion.prototype, "campaignCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'conversion_type',
        type: 'enum',
        enum: ConversionType,
        nullable: false,
        comment: '转化类型'
    }),
    __metadata("design:type", String)
], AdvertisingConversion.prototype, "conversionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_value', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '转化价值' }),
    __metadata("design:type", Number)
], AdvertisingConversion.prototype, "conversionValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', nullable: false, comment: '用户ID' }),
    __metadata("design:type", Number)
], AdvertisingConversion.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', type: 'varchar', length: 100, nullable: true, comment: '会话ID' }),
    __metadata("design:type", String)
], AdvertisingConversion.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 100, nullable: true, comment: '设备ID' }),
    __metadata("design:type", String)
], AdvertisingConversion.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_click_time', type: 'timestamp', nullable: true, comment: '首次点击时间' }),
    __metadata("design:type", Date)
], AdvertisingConversion.prototype, "firstClickTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '转化时间' }),
    __metadata("design:type", Date)
], AdvertisingConversion.prototype, "conversionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_to_conversion', type: 'int', nullable: true, comment: '转化耗时（秒）' }),
    __metadata("design:type", Number)
], AdvertisingConversion.prototype, "timeToConversion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attribution_model', type: 'varchar', length: 50, default: 'last_click', comment: '归因模型' }),
    __metadata("design:type", String)
], AdvertisingConversion.prototype, "attributionModel", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], AdvertisingConversion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => advertising_campaign_entity_1.AdvertisingCampaign, campaign => campaign.conversions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaign_id' }),
    __metadata("design:type", advertising_campaign_entity_1.AdvertisingCampaign)
], AdvertisingConversion.prototype, "campaign", void 0);
exports.AdvertisingConversion = AdvertisingConversion = __decorate([
    (0, typeorm_1.Entity)('advertising_conversions'),
    (0, typeorm_1.Index)(['campaignId']),
    (0, typeorm_1.Index)(['campaignCode']),
    (0, typeorm_1.Index)(['conversionType']),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['conversionTime']),
    (0, typeorm_1.Index)(['createdAt'])
], AdvertisingConversion);
//# sourceMappingURL=advertising-conversion.entity.js.map
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
exports.AdvertisingCampaign = exports.CampaignStatus = void 0;
const typeorm_1 = require("typeorm");
const advertising_platform_entity_1 = require("./advertising-platform.entity");
const advertising_event_entity_1 = require("./advertising-event.entity");
const advertising_conversion_entity_1 = require("./advertising-conversion.entity");
const advertising_campaign_stats_entity_1 = require("./advertising-campaign-stats.entity");
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
let AdvertisingCampaign = class AdvertisingCampaign {
    id;
    name;
    description;
    platformId;
    platformCode;
    campaignCode;
    targetUrl;
    budget;
    targetClicks;
    targetConversions;
    startDate;
    endDate;
    status;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
    platform;
    events;
    conversions;
    stats;
};
exports.AdvertisingCampaign = AdvertisingCampaign;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], AdvertisingCampaign.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false, comment: '计划名称' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '计划描述' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'platform_id', type: 'bigint', nullable: false, comment: '投放平台ID' }),
    __metadata("design:type", Number)
], AdvertisingCampaign.prototype, "platformId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'platform_code', type: 'varchar', length: 50, nullable: false, comment: '平台代码（冗余字段，便于查询）' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "platformCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_code', type: 'varchar', length: 50, unique: true, nullable: false, comment: '计划唯一标识码' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "campaignCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_url', type: 'text', nullable: false, comment: '目标落地页URL' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "targetUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '预算金额' }),
    __metadata("design:type", Number)
], AdvertisingCampaign.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_clicks', type: 'int', nullable: true, comment: '目标点击量' }),
    __metadata("design:type", Number)
], AdvertisingCampaign.prototype, "targetClicks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_conversions', type: 'int', nullable: true, comment: '目标转化量' }),
    __metadata("design:type", Number)
], AdvertisingCampaign.prototype, "targetConversions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'datetime', nullable: false, comment: '开始时间' }),
    __metadata("design:type", Date)
], AdvertisingCampaign.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'datetime', nullable: true, comment: '结束时间' }),
    __metadata("design:type", Date)
], AdvertisingCampaign.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.DRAFT,
        comment: '状态'
    }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true, comment: '是否活跃' }),
    __metadata("design:type", Boolean)
], AdvertisingCampaign.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, nullable: true, comment: '创建人' }),
    __metadata("design:type", String)
], AdvertisingCampaign.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], AdvertisingCampaign.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], AdvertisingCampaign.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => advertising_platform_entity_1.AdvertisingPlatform, platform => platform.campaigns),
    (0, typeorm_1.JoinColumn)({ name: 'platform_id' }),
    __metadata("design:type", advertising_platform_entity_1.AdvertisingPlatform)
], AdvertisingCampaign.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => advertising_event_entity_1.AdvertisingEvent, event => event.campaign),
    __metadata("design:type", Array)
], AdvertisingCampaign.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => advertising_conversion_entity_1.AdvertisingConversion, conversion => conversion.campaign),
    __metadata("design:type", Array)
], AdvertisingCampaign.prototype, "conversions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => advertising_campaign_stats_entity_1.AdvertisingCampaignStats, stats => stats.campaign),
    __metadata("design:type", Array)
], AdvertisingCampaign.prototype, "stats", void 0);
exports.AdvertisingCampaign = AdvertisingCampaign = __decorate([
    (0, typeorm_1.Entity)('advertising_campaigns'),
    (0, typeorm_1.Index)(['platformId']),
    (0, typeorm_1.Index)(['platformCode']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['campaignCode']),
    (0, typeorm_1.Index)(['startDate', 'endDate']),
    (0, typeorm_1.Index)(['createdAt'])
], AdvertisingCampaign);
//# sourceMappingURL=advertising-campaign.entity.js.map
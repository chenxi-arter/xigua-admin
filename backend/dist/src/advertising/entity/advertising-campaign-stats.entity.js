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
exports.AdvertisingCampaignStats = void 0;
const typeorm_1 = require("typeorm");
const advertising_campaign_entity_1 = require("./advertising-campaign.entity");
let AdvertisingCampaignStats = class AdvertisingCampaignStats {
    id;
    campaignId;
    statDate;
    totalClicks;
    totalViews;
    totalConversions;
    conversionRate;
    cost;
    cpc;
    cpa;
    newUsers;
    returningUsers;
    updatedAt;
    campaign;
};
exports.AdvertisingCampaignStats = AdvertisingCampaignStats;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_id', type: 'bigint', nullable: false, comment: '投放计划ID' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stat_date', type: 'date', nullable: false, comment: '统计日期' }),
    __metadata("design:type", Date)
], AdvertisingCampaignStats.prototype, "statDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_clicks', type: 'int', default: 0, comment: '总点击量' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "totalClicks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_views', type: 'int', default: 0, comment: '总浏览量' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "totalViews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_conversions', type: 'int', default: 0, comment: '总转化量' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "totalConversions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_rate', type: 'decimal', precision: 5, scale: 4, default: 0, comment: '转化率' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "conversionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '花费' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '单次点击成本' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "cpc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '单次获客成本' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "cpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_users', type: 'int', default: 0, comment: '新用户数' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "newUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'returning_users', type: 'int', default: 0, comment: '回访用户数' }),
    __metadata("design:type", Number)
], AdvertisingCampaignStats.prototype, "returningUsers", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], AdvertisingCampaignStats.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => advertising_campaign_entity_1.AdvertisingCampaign, campaign => campaign.stats, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaign_id' }),
    __metadata("design:type", advertising_campaign_entity_1.AdvertisingCampaign)
], AdvertisingCampaignStats.prototype, "campaign", void 0);
exports.AdvertisingCampaignStats = AdvertisingCampaignStats = __decorate([
    (0, typeorm_1.Entity)('advertising_campaign_stats'),
    (0, typeorm_1.Unique)(['campaignId', 'statDate']),
    (0, typeorm_1.Index)(['statDate']),
    (0, typeorm_1.Index)(['updatedAt'])
], AdvertisingCampaignStats);
//# sourceMappingURL=advertising-campaign-stats.entity.js.map
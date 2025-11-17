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
exports.PlatformComparisonDto = exports.DashboardResponseDto = exports.RecentEventDto = exports.PlatformStatsDto = exports.CampaignStatsResponseDto = exports.TimelineStatsDto = exports.OverviewStatsDto = exports.CampaignStatsQueryDto = exports.AnalyticsQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AnalyticsQueryDto {
    from;
    to;
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "to", void 0);
class CampaignStatsQueryDto extends AnalyticsQueryDto {
    id;
}
exports.CampaignStatsQueryDto = CampaignStatsQueryDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CampaignStatsQueryDto.prototype, "id", void 0);
class OverviewStatsDto {
    totalClicks;
    totalViews;
    totalConversions;
    conversionRate;
    cost;
    cpc;
    cpa;
}
exports.OverviewStatsDto = OverviewStatsDto;
class TimelineStatsDto {
    date;
    clicks;
    views;
    conversions;
}
exports.TimelineStatsDto = TimelineStatsDto;
class CampaignStatsResponseDto {
    overview;
    timeline;
}
exports.CampaignStatsResponseDto = CampaignStatsResponseDto;
class PlatformStatsDto {
    platform;
    campaigns;
    clicks;
    conversions;
    spend;
}
exports.PlatformStatsDto = PlatformStatsDto;
class RecentEventDto {
    id;
    campaignCode;
    eventType;
    eventTime;
}
exports.RecentEventDto = RecentEventDto;
class DashboardResponseDto {
    totalCampaigns;
    activeCampaigns;
    totalSpend;
    totalClicks;
    totalConversions;
    avgConversionRate;
    platformStats;
    recentEvents;
}
exports.DashboardResponseDto = DashboardResponseDto;
class PlatformComparisonDto {
    platform;
    clicks;
    conversions;
    conversionRate;
    cost;
    cpc;
    cpa;
}
exports.PlatformComparisonDto = PlatformComparisonDto;
//# sourceMappingURL=analytics.dto.js.map
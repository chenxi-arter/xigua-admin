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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("../entity");
const campaign_utils_1 = require("../utils/campaign-utils");
let AnalyticsService = class AnalyticsService {
    campaignRepository;
    eventRepository;
    conversionRepository;
    statsRepository;
    constructor(campaignRepository, eventRepository, conversionRepository, statsRepository) {
        this.campaignRepository = campaignRepository;
        this.eventRepository = eventRepository;
        this.conversionRepository = conversionRepository;
        this.statsRepository = statsRepository;
    }
    async getCampaignStats(campaignId, from, to) {
        const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = to ? new Date(to) : new Date();
        const overview = await this.calculateOverviewStats(campaignId, startDate, endDate);
        const timeline = await this.getTimelineStats(campaignId, startDate, endDate);
        return {
            overview,
            timeline,
        };
    }
    async getDashboardStats(from, to) {
        const hasTimeFilter = from || to;
        let startDate;
        let endDate;
        if (from) {
            startDate = new Date(from);
            startDate.setHours(0, 0, 0, 0);
        }
        if (to) {
            endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);
        }
        const totalCampaigns = await this.campaignRepository.count();
        const activeCampaigns = await this.campaignRepository.count({
            where: { isActive: true }
        });
        let totalClicks = 0;
        let totalConversions = 0;
        if (hasTimeFilter) {
            const clicksQueryBuilder = this.eventRepository
                .createQueryBuilder('event')
                .select('COUNT(*)', 'totalClicks')
                .where('event.eventType = :clickType', { clickType: entity_1.EventType.CLICK });
            if (startDate) {
                clicksQueryBuilder.andWhere('event.eventTime >= :startDate', { startDate });
            }
            if (endDate) {
                clicksQueryBuilder.andWhere('event.eventTime <= :endDate', { endDate });
            }
            const clickStats = await clicksQueryBuilder.getRawOne();
            totalClicks = parseInt(clickStats?.totalClicks || '0') || 0;
            const conversionQueryBuilder = this.conversionRepository
                .createQueryBuilder('conversion')
                .select('COUNT(*)', 'totalConversions');
            if (startDate) {
                conversionQueryBuilder.andWhere('conversion.conversionTime >= :startDate', { startDate });
            }
            if (endDate) {
                conversionQueryBuilder.andWhere('conversion.conversionTime <= :endDate', { endDate });
            }
            const conversionStats = await conversionQueryBuilder.getRawOne();
            totalConversions = parseInt(conversionStats?.totalConversions || '0') || 0;
        }
        else {
            const clickStats = await this.eventRepository
                .createQueryBuilder('event')
                .select('COUNT(*)', 'totalClicks')
                .where('event.eventType = :eventType', { eventType: entity_1.EventType.CLICK })
                .getRawOne();
            totalClicks = parseInt(clickStats?.totalClicks || '0') || 0;
            const conversionStats = await this.conversionRepository
                .createQueryBuilder('conversion')
                .select('COUNT(*)', 'totalConversions')
                .getRawOne();
            totalConversions = parseInt(conversionStats?.totalConversions || '0') || 0;
        }
        const avgConversionRate = campaign_utils_1.CampaignUtils.calculateConversionRate(totalConversions, totalClicks);
        const platformStats = await this.getPlatformStats(startDate, endDate);
        const recentEvents = await this.getRecentEvents(10);
        const totalSpend = 0;
        return {
            totalCampaigns,
            activeCampaigns,
            totalSpend,
            totalClicks,
            totalConversions,
            avgConversionRate,
            platformStats,
            recentEvents,
        };
    }
    async getPlatformComparison(from, to) {
        const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = to ? new Date(to) : new Date();
        const platformStats = await this.eventRepository
            .createQueryBuilder('event')
            .leftJoin('event.campaign', 'campaign')
            .leftJoin('campaign.platform', 'platform')
            .select([
            'platform.code as platform',
            'COUNT(CASE WHEN event.eventType = :clickType THEN 1 END) as clicks',
            'COUNT(CASE WHEN event.eventType = :viewType THEN 1 END) as views',
        ])
            .where('event.eventTime BETWEEN :startDate AND :endDate', { startDate, endDate })
            .setParameter('clickType', entity_1.EventType.CLICK)
            .setParameter('viewType', entity_1.EventType.VIEW)
            .groupBy('platform.code')
            .getRawMany();
        const result = [];
        for (const stat of platformStats) {
            const conversions = await this.conversionRepository
                .createQueryBuilder('conversion')
                .leftJoin('conversion.campaign', 'campaign')
                .leftJoin('campaign.platform', 'platform')
                .where('platform.code = :platform', { platform: stat.platform })
                .andWhere('conversion.conversionTime BETWEEN :startDate AND :endDate', { startDate, endDate })
                .getCount();
            const clicks = parseInt(stat.clicks) || 0;
            const conversionRate = campaign_utils_1.CampaignUtils.calculateConversionRate(conversions, clicks);
            const cost = 0;
            const cpc = campaign_utils_1.CampaignUtils.calculateCPC(cost, clicks);
            const cpa = campaign_utils_1.CampaignUtils.calculateCPA(cost, conversions);
            result.push({
                platform: stat.platform,
                clicks,
                conversions,
                conversionRate,
                cost,
                cpc,
                cpa,
            });
        }
        return result;
    }
    async calculateOverviewStats(campaignId, startDate, endDate) {
        const clickCount = await this.eventRepository.count({
            where: {
                campaignId,
                eventType: entity_1.EventType.CLICK,
                eventTime: { $gte: startDate, $lte: endDate },
            },
        });
        const viewCount = await this.eventRepository.count({
            where: {
                campaignId,
                eventType: entity_1.EventType.VIEW,
                eventTime: { $gte: startDate, $lte: endDate },
            },
        });
        const conversionCount = await this.conversionRepository.count({
            where: {
                campaignId,
                conversionTime: { $gte: startDate, $lte: endDate },
            },
        });
        const conversionRate = campaign_utils_1.CampaignUtils.calculateConversionRate(conversionCount, clickCount);
        const cost = 0;
        const cpc = campaign_utils_1.CampaignUtils.calculateCPC(cost, clickCount);
        const cpa = campaign_utils_1.CampaignUtils.calculateCPA(cost, conversionCount);
        return {
            totalClicks: clickCount,
            totalViews: viewCount,
            totalConversions: conversionCount,
            conversionRate,
            cost,
            cpc,
            cpa,
        };
    }
    async getTimelineStats(campaignId, startDate, endDate) {
        const timeline = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const clicks = await this.eventRepository.count({
                where: {
                    campaignId,
                    eventType: entity_1.EventType.CLICK,
                    eventTime: { $gte: dayStart, $lte: dayEnd },
                },
            });
            const views = await this.eventRepository.count({
                where: {
                    campaignId,
                    eventType: entity_1.EventType.VIEW,
                    eventTime: { $gte: dayStart, $lte: dayEnd },
                },
            });
            const conversions = await this.conversionRepository.count({
                where: {
                    campaignId,
                    conversionTime: { $gte: dayStart, $lte: dayEnd },
                },
            });
            timeline.push({
                date: currentDate.toISOString().split('T')[0],
                clicks,
                views,
                conversions,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return timeline;
    }
    async getPlatformStats(startDate, endDate) {
        const platforms = await this.campaignRepository
            .createQueryBuilder('campaign')
            .leftJoin('campaign.platform', 'platform')
            .where('campaign.isActive = :isActive', { isActive: true })
            .select('DISTINCT platform.code', 'platform')
            .getRawMany();
        const result = [];
        for (const { platform } of platforms) {
            if (!platform)
                continue;
            const campaignsCount = await this.campaignRepository.count({
                where: {
                    isActive: true,
                    platformCode: platform,
                },
            });
            let clicksQuery = this.eventRepository
                .createQueryBuilder('event')
                .leftJoin('event.campaign', 'campaign')
                .where('campaign.platformCode = :platform', { platform })
                .andWhere('event.eventType = :clickType', { clickType: entity_1.EventType.CLICK });
            if (startDate) {
                clicksQuery = clicksQuery.andWhere('event.eventTime >= :startDate', { startDate });
            }
            if (endDate) {
                clicksQuery = clicksQuery.andWhere('event.eventTime <= :endDate', { endDate });
            }
            const clicks = await clicksQuery.getCount();
            let conversionsQuery = this.conversionRepository
                .createQueryBuilder('conversion')
                .leftJoin('conversion.campaign', 'campaign')
                .where('campaign.platformCode = :platform', { platform });
            if (startDate) {
                conversionsQuery = conversionsQuery.andWhere('conversion.conversionTime >= :startDate', { startDate });
            }
            if (endDate) {
                conversionsQuery = conversionsQuery.andWhere('conversion.conversionTime <= :endDate', { endDate });
            }
            const conversions = await conversionsQuery.getCount();
            result.push({
                platform,
                campaigns: campaignsCount,
                clicks,
                conversions,
                spend: 0,
            });
        }
        return result;
    }
    async getRecentEvents(limit) {
        const events = await this.eventRepository
            .createQueryBuilder('event')
            .select(['event.id', 'event.campaignCode', 'event.eventType', 'event.eventTime'])
            .orderBy('event.eventTime', 'DESC')
            .limit(limit)
            .getMany();
        return events.map(event => ({
            id: event.id,
            campaignCode: event.campaignCode,
            eventType: event.eventType,
            eventTime: event.eventTime,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingCampaign)),
    __param(1, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingEvent)),
    __param(2, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingConversion)),
    __param(3, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingCampaignStats)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map
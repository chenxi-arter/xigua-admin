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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("../entity");
const campaign_utils_1 = require("../utils/campaign-utils");
const campaign_service_1 = require("./campaign.service");
let TrackingService = class TrackingService {
    eventRepository;
    conversionRepository;
    campaignService;
    constructor(eventRepository, conversionRepository, campaignService) {
        this.eventRepository = eventRepository;
        this.conversionRepository = conversionRepository;
        this.campaignService = campaignService;
    }
    async createEvent(createEventDto, ipAddress, userId) {
        try {
            const campaign = await this.campaignService.findByCode(createEventDto.campaignCode);
            if (!campaign.isActive) {
                return {
                    success: false,
                    message: '广告计划已暂停，无法记录事件',
                };
            }
            const location = await campaign_utils_1.CampaignUtils.getLocationFromIp(ipAddress || '');
            const event = this.eventRepository.create({
                campaignId: campaign.id,
                campaignCode: createEventDto.campaignCode,
                eventType: createEventDto.eventType,
                eventData: createEventDto.eventData,
                sessionId: createEventDto.sessionId,
                deviceId: createEventDto.deviceId,
                referrer: createEventDto.referrer,
                userAgent: createEventDto.userAgent,
                userId: userId,
                ipAddress,
                country: location.country,
                region: location.region,
                city: location.city,
                eventTime: new Date(),
            });
            await this.eventRepository.save(event);
            return {
                success: true,
                message: '事件记录成功',
            };
        }
        catch (error) {
            console.error('Failed to record event:', error);
            return {
                success: false,
                message: '事件记录失败',
            };
        }
    }
    async createEventsBatch(batchCreateEventDto, ipAddress) {
        const queryRunner = this.eventRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const events = [];
            for (const eventDto of batchCreateEventDto.events) {
                const campaign = await this.campaignService.findByCode(eventDto.campaignCode);
                if (!campaign.isActive) {
                    continue;
                }
                const location = await campaign_utils_1.CampaignUtils.getLocationFromIp(ipAddress || '');
                const event = this.eventRepository.create({
                    campaignId: campaign.id,
                    campaignCode: eventDto.campaignCode,
                    eventType: eventDto.eventType,
                    eventData: eventDto.eventData,
                    sessionId: eventDto.sessionId,
                    deviceId: eventDto.deviceId,
                    referrer: eventDto.referrer,
                    userAgent: eventDto.userAgent,
                    ipAddress,
                    country: location.country,
                    region: location.region,
                    city: location.city,
                    eventTime: new Date(),
                });
                events.push(event);
            }
            await queryRunner.manager.save(entity_1.AdvertisingEvent, events);
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: `成功记录 ${events.length} 个事件`,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Failed to record batch events:', error);
            return {
                success: false,
                message: '批量事件记录失败',
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async createConversion(createConversionDto, userId) {
        try {
            const campaign = await this.campaignService.findByCode(createConversionDto.campaignCode);
            if (!campaign.isActive) {
                return {
                    success: false,
                    message: '广告计划已暂停，无法记录转化',
                };
            }
            const existingConversion = await this.conversionRepository.findOne({
                where: {
                    campaignId: campaign.id,
                    userId: userId,
                    conversionType: createConversionDto.conversionType,
                },
            });
            if (existingConversion) {
                return {
                    success: false,
                    message: '该用户的此类型转化已存在',
                };
            }
            const firstClickEvent = await this.eventRepository.findOne({
                where: {
                    campaignId: campaign.id,
                    userId: userId,
                    eventType: entity_1.EventType.CLICK,
                },
                order: { eventTime: 'ASC' },
            });
            const conversionTime = new Date();
            const firstClickTime = firstClickEvent?.eventTime;
            const timeToConversion = firstClickTime
                ? campaign_utils_1.CampaignUtils.calculateTimeToConversion(firstClickTime, conversionTime)
                : undefined;
            const conversion = this.conversionRepository.create({
                campaignId: campaign.id,
                campaignCode: createConversionDto.campaignCode,
                conversionType: createConversionDto.conversionType,
                conversionValue: createConversionDto.conversionValue || 0,
                userId: userId,
                sessionId: createConversionDto.sessionId,
                deviceId: createConversionDto.deviceId,
                firstClickTime,
                conversionTime,
                timeToConversion,
            });
            const savedConversion = await this.conversionRepository.save(conversion);
            return {
                success: true,
                message: '转化记录成功',
                conversionId: savedConversion.id,
            };
        }
        catch (error) {
            console.error('Failed to record conversion:', error);
            return {
                success: false,
                message: '转化记录失败',
            };
        }
    }
    async getEventsByCampaign(campaignId, startDate, endDate) {
        const queryBuilder = this.eventRepository
            .createQueryBuilder('event')
            .where('event.campaignId = :campaignId', { campaignId });
        if (startDate) {
            queryBuilder.andWhere('event.eventTime >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('event.eventTime <= :endDate', { endDate });
        }
        return queryBuilder
            .orderBy('event.eventTime', 'DESC')
            .getMany();
    }
    async getConversionsByCampaign(campaignId, startDate, endDate) {
        const queryBuilder = this.conversionRepository
            .createQueryBuilder('conversion')
            .where('conversion.campaignId = :campaignId', { campaignId });
        if (startDate) {
            queryBuilder.andWhere('conversion.conversionTime >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('conversion.conversionTime <= :endDate', { endDate });
        }
        return queryBuilder
            .orderBy('conversion.conversionTime', 'DESC')
            .getMany();
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingConversion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        campaign_service_1.CampaignService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map
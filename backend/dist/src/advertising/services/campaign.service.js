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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("../entity");
const campaign_utils_1 = require("../utils/campaign-utils");
const platform_service_1 = require("./platform.service");
let CampaignService = class CampaignService {
    campaignRepository;
    platformRepository;
    platformService;
    constructor(campaignRepository, platformRepository, platformService) {
        this.campaignRepository = campaignRepository;
        this.platformRepository = platformRepository;
        this.platformService = platformService;
    }
    async findAll(query) {
        const { page = 1, size = 20, platform, status, keyword, startDate, endDate } = query;
        const queryBuilder = this.campaignRepository
            .createQueryBuilder('campaign')
            .leftJoinAndSelect('campaign.platform', 'platform');
        if (platform) {
            queryBuilder.andWhere('campaign.platformCode = :platform', { platform });
        }
        if (status) {
            queryBuilder.andWhere('campaign.status = :status', { status });
        }
        if (keyword) {
            queryBuilder.andWhere('(campaign.name LIKE :keyword OR campaign.description LIKE :keyword)', { keyword: `%${keyword}%` });
        }
        if (startDate) {
            queryBuilder.andWhere('campaign.startDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('campaign.endDate <= :endDate', { endDate });
        }
        const offset = (page - 1) * size;
        queryBuilder.skip(offset).take(size);
        queryBuilder.orderBy('campaign.createdAt', 'DESC');
        const [items, total] = await queryBuilder.getManyAndCount();
        const responseItems = await Promise.all(items.map(item => this.transformToResponseDto(item)));
        return {
            items: responseItems,
            total,
            page,
            size,
        };
    }
    async findOne(id) {
        const campaign = await this.campaignRepository.findOne({
            where: { id },
            relations: ['platform']
        });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return this.transformToResponseDto(campaign);
    }
    async findByCode(campaignCode) {
        const campaign = await this.campaignRepository.findOne({
            where: { campaignCode },
            relations: ['platform']
        });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with code ${campaignCode} not found`);
        }
        return campaign;
    }
    async create(createCampaignDto, createdBy) {
        const platform = await this.platformService.findByCode(createCampaignDto.platform);
        const startDate = new Date(createCampaignDto.startDate);
        const endDate = createCampaignDto.endDate ? new Date(createCampaignDto.endDate) : null;
        if (startDate < new Date()) {
            throw new common_1.BadRequestException('Start date cannot be in the past');
        }
        if (endDate && endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const campaignCode = campaign_utils_1.CampaignUtils.generateCampaignCode(createCampaignDto.platform);
        const campaign = this.campaignRepository.create({
            name: createCampaignDto.name,
            description: createCampaignDto.description,
            platformId: platform.id,
            platformCode: platform.code,
            campaignCode,
            targetUrl: createCampaignDto.targetUrl,
            budget: createCampaignDto.budget,
            targetClicks: createCampaignDto.targetClicks,
            targetConversions: createCampaignDto.targetConversions,
            startDate,
            endDate: endDate || undefined,
            createdBy,
        });
        const savedCampaign = await this.campaignRepository.save(campaign);
        return this.findOne(savedCampaign.id);
    }
    async update(id, updateCampaignDto) {
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        if (updateCampaignDto.startDate || updateCampaignDto.endDate) {
            const startDate = updateCampaignDto.startDate ? new Date(updateCampaignDto.startDate) : campaign.startDate;
            const endDate = updateCampaignDto.endDate ? new Date(updateCampaignDto.endDate) : campaign.endDate;
            if (endDate && endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            updateCampaignDto.startDate = startDate.toISOString();
            if (endDate) {
                updateCampaignDto.endDate = endDate.toISOString();
            }
        }
        Object.assign(campaign, updateCampaignDto);
        await this.campaignRepository.save(campaign);
        return this.findOne(id);
    }
    async updateStatus(id, updateStatusDto) {
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        campaign.status = updateStatusDto.status;
        campaign.isActive = updateStatusDto.status === entity_1.CampaignStatus.ACTIVE;
        await this.campaignRepository.save(campaign);
        return this.findOne(id);
    }
    async remove(id) {
        const campaign = await this.campaignRepository.findOne({ where: { id } });
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        await this.campaignRepository.remove(campaign);
    }
    async transformToResponseDto(campaign) {
        const stats = {
            totalClicks: 0,
            totalViews: 0,
            totalConversions: 0,
            conversionRate: 0,
            cost: 0,
            cpc: 0,
            cpa: 0,
        };
        return {
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            platform: campaign.platformCode,
            campaignCode: campaign.campaignCode,
            targetUrl: campaign.targetUrl,
            budget: campaign.budget,
            targetClicks: campaign.targetClicks,
            targetConversions: campaign.targetConversions,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            status: campaign.status,
            isActive: campaign.isActive,
            stats,
            createdBy: campaign.createdBy,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
        };
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingCampaign)),
    __param(1, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingPlatform)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        platform_service_1.PlatformService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map
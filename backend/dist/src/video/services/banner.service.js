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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banner_entity_1 = require("../entity/banner.entity");
const banner_metric_daily_entity_1 = require("../entity/banner-metric-daily.entity");
let BannerService = class BannerService {
    bannerRepo;
    metricRepo;
    constructor(bannerRepo, metricRepo) {
        this.bannerRepo = bannerRepo;
        this.metricRepo = metricRepo;
    }
    async createBanner(createBannerDto) {
        if (createBannerDto.startTime && createBannerDto.endTime) {
            const startTime = new Date(createBannerDto.startTime);
            const endTime = new Date(createBannerDto.endTime);
            if (startTime >= endTime) {
                throw new common_1.BadRequestException('开始时间必须早于结束时间');
            }
        }
        const banner = this.bannerRepo.create({
            ...createBannerDto,
            startTime: createBannerDto.startTime ? new Date(createBannerDto.startTime) : undefined,
            endTime: createBannerDto.endTime ? new Date(createBannerDto.endTime) : undefined,
        });
        const savedBanner = await this.bannerRepo.save(banner);
        return this.formatBannerResponse(savedBanner);
    }
    async incrementImpression(id) {
        await this.bannerRepo.increment({ id }, 'impressions', 1);
        const date = new Date();
        const d = date.toISOString().slice(0, 10);
        await this.metricRepo
            .createQueryBuilder()
            .insert()
            .into(banner_metric_daily_entity_1.BannerMetricDaily)
            .values({ bannerId: id, date: d, impressions: 1, clicks: 0 })
            .orUpdate(['impressions'], ['banner_id', 'date'])
            .execute();
    }
    async incrementClick(id) {
        await this.bannerRepo.increment({ id }, 'clicks', 1);
        const date = new Date();
        const d = date.toISOString().slice(0, 10);
        await this.metricRepo
            .createQueryBuilder()
            .insert()
            .into(banner_metric_daily_entity_1.BannerMetricDaily)
            .values({ bannerId: id, date: d, impressions: 0, clicks: 1 })
            .orUpdate(['clicks'], ['banner_id', 'date'])
            .execute();
    }
    async getBannerDailyStats(id, from, to) {
        return this.metricRepo.find({
            where: { bannerId: id, date: (0, typeorm_2.Between)(from, to) },
            order: { date: 'ASC' },
        });
    }
    async updateBanner(id, updateBannerDto) {
        const banner = await this.bannerRepo.findOne({
            where: { id },
            relations: ['category', 'series'],
        });
        if (!banner) {
            throw new common_1.NotFoundException('轮播图不存在');
        }
        if (updateBannerDto.startTime && updateBannerDto.endTime) {
            const startTime = new Date(updateBannerDto.startTime);
            const endTime = new Date(updateBannerDto.endTime);
            if (startTime >= endTime) {
                throw new common_1.BadRequestException('开始时间必须早于结束时间');
            }
        }
        Object.assign(banner, {
            ...updateBannerDto,
            startTime: updateBannerDto.startTime ? new Date(updateBannerDto.startTime) : banner.startTime,
            endTime: updateBannerDto.endTime ? new Date(updateBannerDto.endTime) : banner.endTime,
        });
        const savedBanner = await this.bannerRepo.save(banner);
        return this.formatBannerResponse(savedBanner);
    }
    async deleteBanner(id) {
        const banner = await this.bannerRepo.findOne({ where: { id } });
        if (!banner) {
            throw new common_1.NotFoundException('轮播图不存在');
        }
        await this.bannerRepo.remove(banner);
    }
    async getBannerById(id) {
        const banner = await this.bannerRepo.findOne({
            where: { id },
            relations: ['category', 'series'],
        });
        if (!banner) {
            throw new common_1.NotFoundException('轮播图不存在');
        }
        return this.formatBannerResponse(banner);
    }
    async getBanners(queryDto) {
        const { categoryId, isActive, page = 1, size = 10 } = queryDto;
        const skip = (page - 1) * size;
        const whereConditions = {};
        if (categoryId !== undefined) {
            whereConditions.categoryId = categoryId;
        }
        if (isActive !== undefined) {
            whereConditions.isActive = isActive;
        }
        const [banners, total] = await this.bannerRepo.findAndCount({
            where: whereConditions,
            relations: ['category', 'series'],
            order: {
                weight: 'DESC',
                createdAt: 'DESC',
            },
            skip,
            take: size,
        });
        return {
            data: banners.map(banner => this.formatBannerResponse(banner)),
            total,
            page,
            size,
        };
    }
    async getActiveBanners(categoryId, limit = 5) {
        const now = new Date();
        const whereConditions = {
            isActive: true,
        };
        if (categoryId) {
            whereConditions.categoryId = categoryId;
        }
        const queryBuilder = this.bannerRepo.createQueryBuilder('banner')
            .leftJoinAndSelect('banner.category', 'category')
            .leftJoinAndSelect('banner.series', 'series')
            .where('banner.isActive = :isActive', { isActive: true })
            .andWhere('(banner.startTime IS NULL OR banner.startTime <= :now)', { now })
            .andWhere('(banner.endTime IS NULL OR banner.endTime >= :now)', { now });
        if (categoryId) {
            queryBuilder.andWhere('banner.categoryId = :categoryId', { categoryId });
        }
        const banners = await queryBuilder
            .orderBy('banner.weight', 'DESC')
            .addOrderBy('banner.createdAt', 'DESC')
            .limit(limit)
            .getMany();
        return banners.map(banner => ({
            showURL: banner.imageUrl,
            title: banner.title,
            id: banner.seriesId || banner.id,
            shortId: banner.series?.shortId,
            channeID: banner.categoryId,
            url: banner.linkUrl || (banner.seriesId ? banner.seriesId.toString() : banner.id.toString()),
        }));
    }
    async updateBannerWeights(updates) {
        const updatePromises = updates.map(({ id, weight }) => this.bannerRepo.update(id, { weight }));
        await Promise.all(updatePromises);
    }
    async toggleBannerStatus(id, isActive) {
        const banner = await this.bannerRepo.findOne({
            where: { id },
            relations: ['category', 'series'],
        });
        if (!banner) {
            throw new common_1.NotFoundException('轮播图不存在');
        }
        banner.isActive = isActive;
        const savedBanner = await this.bannerRepo.save(banner);
        return this.formatBannerResponse(savedBanner);
    }
    formatBannerResponse(banner) {
        return {
            id: banner.id,
            title: banner.title,
            imageUrl: banner.imageUrl,
            seriesId: banner.seriesId,
            categoryId: banner.categoryId,
            linkUrl: banner.linkUrl,
            weight: banner.weight,
            isActive: banner.isActive,
            startTime: banner.startTime,
            endTime: banner.endTime,
            description: banner.description,
            createdAt: banner.createdAt,
            updatedAt: banner.updatedAt,
            category: banner.category ? {
                id: banner.category.id,
                name: banner.category.name,
            } : undefined,
            series: banner.series ? {
                id: banner.series.id,
                title: banner.series.title,
                shortId: banner.series.shortId,
            } : undefined,
        };
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __param(1, (0, typeorm_1.InjectRepository)(banner_metric_daily_entity_1.BannerMetricDaily)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BannerService);
//# sourceMappingURL=banner.service.js.map
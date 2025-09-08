import { Repository } from 'typeorm';
import { Banner } from '../entity/banner.entity';
import { BannerMetricDaily } from '../entity/banner-metric-daily.entity';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto, BannerResponseDto } from '../dto/banner.dto';
import { BannerItem } from '../dto/home-videos.dto';
export declare class BannerService {
    private readonly bannerRepo;
    private readonly metricRepo;
    constructor(bannerRepo: Repository<Banner>, metricRepo: Repository<BannerMetricDaily>);
    createBanner(createBannerDto: CreateBannerDto): Promise<BannerResponseDto>;
    incrementImpression(id: number): Promise<void>;
    incrementClick(id: number): Promise<void>;
    getBannerDailyStats(id: number, from: string, to: string): Promise<BannerMetricDaily[]>;
    updateBanner(id: number, updateBannerDto: UpdateBannerDto): Promise<BannerResponseDto>;
    deleteBanner(id: number): Promise<void>;
    getBannerById(id: number): Promise<BannerResponseDto>;
    getBanners(queryDto: BannerQueryDto): Promise<{
        data: BannerResponseDto[];
        total: number;
        page: number;
        size: number;
    }>;
    getActiveBanners(categoryId?: number, limit?: number): Promise<BannerItem[]>;
    updateBannerWeights(updates: {
        id: number;
        weight: number;
    }[]): Promise<void>;
    toggleBannerStatus(id: number, isActive: boolean): Promise<BannerResponseDto>;
    private formatBannerResponse;
}

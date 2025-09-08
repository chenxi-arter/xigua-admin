import { BannerService } from '../services/banner.service';
import { CreateBannerDto, UpdateBannerDto, BannerQueryDto, BannerResponseDto } from '../dto/banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    createBanner(createBannerDto: CreateBannerDto): Promise<{
        code: number;
        msg: string;
        data: BannerResponseDto;
        success: boolean;
        timestamp: number;
    }>;
    updateBanner(id: number, updateBannerDto: UpdateBannerDto): Promise<{
        code: number;
        msg: string;
        data: BannerResponseDto;
        success: boolean;
        timestamp: number;
    }>;
    deleteBanner(id: number): Promise<{
        code: number;
        msg: string;
        success: boolean;
        timestamp: number;
    }>;
    getBannerById(id: number): Promise<{
        code: number;
        msg: string;
        data: BannerResponseDto;
        success: boolean;
        timestamp: number;
    }>;
    getBanners(queryDto: BannerQueryDto): Promise<{
        code: number;
        msg: string;
        data: {
            data: BannerResponseDto[];
            total: number;
            page: number;
            size: number;
        };
        success: boolean;
        timestamp: number;
    }>;
    toggleBannerStatus(id: number, isActive: boolean): Promise<{
        code: number;
        msg: string;
        data: BannerResponseDto;
        success: boolean;
        timestamp: number;
    }>;
    updateBannerWeights(updates: {
        id: number;
        weight: number;
    }[]): Promise<{
        code: number;
        msg: string;
        success: boolean;
        timestamp: number;
    }>;
    getActiveBanners(categoryId?: number, limit?: number): Promise<{
        code: number;
        msg: string;
        data: any[];
        success: boolean;
        timestamp: number;
    }>;
    impression(id: number): Promise<{
        code: number;
        msg: string;
        success: boolean;
        timestamp: number;
    }>;
    click(id: number): Promise<{
        code: number;
        msg: string;
        success: boolean;
        timestamp: number;
    }>;
    stats(id: number, from: string, to: string): Promise<{
        code: number;
        msg: string;
        data: any;
        success: boolean;
        timestamp: number;
    }>;
}

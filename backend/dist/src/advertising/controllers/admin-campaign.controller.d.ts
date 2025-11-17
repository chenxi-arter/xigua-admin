import { CampaignService, AnalyticsService } from '../services';
import { CreateCampaignDto, UpdateCampaignDto, UpdateCampaignStatusDto, CampaignQueryDto, CampaignListResponseDto, CampaignResponseDto, CampaignStatsResponseDto, AnalyticsQueryDto } from '../dto';
export declare class AdminCampaignController {
    private readonly campaignService;
    private readonly analyticsService;
    constructor(campaignService: CampaignService, analyticsService: AnalyticsService);
    findAll(query: CampaignQueryDto): Promise<{
        code: number;
        message: string;
        data: CampaignListResponseDto;
    }>;
    findOne(id: number): Promise<{
        code: number;
        message: string;
        data: CampaignResponseDto;
    }>;
    create(createCampaignDto: CreateCampaignDto): Promise<{
        code: number;
        message: string;
        data: CampaignResponseDto;
    }>;
    update(id: number, updateCampaignDto: UpdateCampaignDto): Promise<{
        code: number;
        message: string;
        data: CampaignResponseDto;
    }>;
    updateStatus(id: number, updateStatusDto: UpdateCampaignStatusDto): Promise<{
        code: number;
        message: string;
        data: CampaignResponseDto;
    }>;
    remove(id: number): Promise<{
        code: number;
        message: string;
    }>;
    getStats(id: number, query: AnalyticsQueryDto): Promise<{
        code: number;
        message: string;
        data: CampaignStatsResponseDto;
    }>;
}

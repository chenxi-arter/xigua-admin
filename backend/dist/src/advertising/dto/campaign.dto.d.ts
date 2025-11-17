import { CampaignStatus } from '../entity';
export declare class CreateCampaignDto {
    name: string;
    description?: string;
    platform: string;
    targetUrl: string;
    budget?: number;
    targetClicks?: number;
    targetConversions?: number;
    startDate: string;
    endDate?: string;
}
export declare class UpdateCampaignDto {
    name?: string;
    description?: string;
    targetUrl?: string;
    budget?: number;
    targetClicks?: number;
    targetConversions?: number;
    startDate?: string;
    endDate?: string;
}
export declare class UpdateCampaignStatusDto {
    status: CampaignStatus;
}
export declare class CampaignQueryDto {
    page?: number;
    size?: number;
    platform?: string;
    status?: CampaignStatus;
    keyword?: string;
    startDate?: string;
    endDate?: string;
}
export declare class CampaignStatsDto {
    totalClicks: number;
    totalViews: number;
    totalConversions: number;
    conversionRate: number;
    cost: number;
    cpc: number;
    cpa: number;
}
export declare class CampaignResponseDto {
    id: number;
    name: string;
    description: string;
    platform: string;
    campaignCode: string;
    targetUrl: string;
    budget: number;
    targetClicks: number;
    targetConversions: number;
    startDate: Date;
    endDate: Date;
    status: CampaignStatus;
    isActive: boolean;
    stats?: CampaignStatsDto;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CampaignListResponseDto {
    items: CampaignResponseDto[];
    total: number;
    page: number;
    size: number;
}

import { AdvertisingPlatform } from './advertising-platform.entity';
import { AdvertisingEvent } from './advertising-event.entity';
import { AdvertisingConversion } from './advertising-conversion.entity';
import { AdvertisingCampaignStats } from './advertising-campaign-stats.entity';
export declare enum CampaignStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class AdvertisingCampaign {
    id: number;
    name: string;
    description: string;
    platformId: number;
    platformCode: string;
    campaignCode: string;
    targetUrl: string;
    budget: number;
    targetClicks: number;
    targetConversions: number;
    startDate: Date;
    endDate: Date;
    status: CampaignStatus;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    platform: AdvertisingPlatform;
    events: AdvertisingEvent[];
    conversions: AdvertisingConversion[];
    stats: AdvertisingCampaignStats[];
}

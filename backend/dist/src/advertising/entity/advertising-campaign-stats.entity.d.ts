import { AdvertisingCampaign } from './advertising-campaign.entity';
export declare class AdvertisingCampaignStats {
    id: number;
    campaignId: number;
    statDate: Date;
    totalClicks: number;
    totalViews: number;
    totalConversions: number;
    conversionRate: number;
    cost: number;
    cpc: number;
    cpa: number;
    newUsers: number;
    returningUsers: number;
    updatedAt: Date;
    campaign: AdvertisingCampaign;
}

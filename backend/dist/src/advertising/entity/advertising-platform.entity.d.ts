import { AdvertisingCampaign } from './advertising-campaign.entity';
export declare class AdvertisingPlatform {
    id: number;
    name: string;
    code: string;
    description: string;
    iconUrl: string;
    color: string;
    isEnabled: boolean;
    sortOrder: number;
    config: any;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    campaigns: AdvertisingCampaign[];
}

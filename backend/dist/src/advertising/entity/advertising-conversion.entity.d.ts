import { AdvertisingCampaign } from './advertising-campaign.entity';
export declare enum ConversionType {
    REGISTER = "register",
    FIRST_PLAY = "first_play",
    SUBSCRIPTION = "subscription",
    PURCHASE = "purchase"
}
export declare class AdvertisingConversion {
    id: number;
    campaignId: number;
    campaignCode: string;
    conversionType: ConversionType;
    conversionValue: number;
    userId: number;
    sessionId: string;
    deviceId: string;
    firstClickTime: Date;
    conversionTime: Date;
    timeToConversion: number;
    attributionModel: string;
    createdAt: Date;
    campaign: AdvertisingCampaign;
}

import { AdvertisingCampaign } from './advertising-campaign.entity';
export declare enum EventType {
    CLICK = "click",
    VIEW = "view",
    REGISTER = "register",
    LOGIN = "login",
    PLAY = "play",
    SHARE = "share"
}
export declare class AdvertisingEvent {
    id: number;
    campaignId: number;
    campaignCode: string;
    eventType: EventType;
    eventData: any;
    userId: number;
    sessionId: string;
    deviceId: string;
    referrer: string;
    userAgent: string;
    ipAddress: string;
    country: string;
    region: string;
    city: string;
    eventTime: Date;
    createdAt: Date;
    campaign: AdvertisingCampaign;
}

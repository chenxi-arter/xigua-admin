export interface LocationInfo {
    country?: string;
    region?: string;
    city?: string;
}
export declare class CampaignUtils {
    private static readonly PLATFORM_CODES;
    static generateCampaignCode(platform: string): string;
    static getLocationFromIp(ipAddress: string): Promise<LocationInfo>;
    static calculateTimeToConversion(firstClickTime: Date, conversionTime: Date): number;
    static calculateConversionRate(conversions: number, clicks: number): number;
    static calculateCPC(cost: number, clicks: number): number;
    static calculateCPA(cost: number, conversions: number): number;
}

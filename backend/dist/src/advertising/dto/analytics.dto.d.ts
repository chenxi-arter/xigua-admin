export declare class AnalyticsQueryDto {
    from?: string;
    to?: string;
}
export declare class CampaignStatsQueryDto extends AnalyticsQueryDto {
    id: number;
}
export declare class OverviewStatsDto {
    totalClicks: number;
    totalViews: number;
    totalConversions: number;
    conversionRate: number;
    cost: number;
    cpc: number;
    cpa: number;
}
export declare class TimelineStatsDto {
    date: string;
    clicks: number;
    views: number;
    conversions: number;
}
export declare class CampaignStatsResponseDto {
    overview: OverviewStatsDto;
    timeline: TimelineStatsDto[];
}
export declare class PlatformStatsDto {
    platform: string;
    campaigns: number;
    clicks: number;
    conversions: number;
    spend: number;
}
export declare class RecentEventDto {
    id: number;
    campaignCode: string;
    eventType: string;
    eventTime: Date;
}
export declare class DashboardResponseDto {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalClicks: number;
    totalConversions: number;
    avgConversionRate: number;
    platformStats: PlatformStatsDto[];
    recentEvents: RecentEventDto[];
}
export declare class PlatformComparisonDto {
    platform: string;
    clicks: number;
    conversions: number;
    conversionRate: number;
    cost: number;
    cpc: number;
    cpa: number;
}

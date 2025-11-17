import { Repository } from 'typeorm';
import { AdvertisingCampaign, AdvertisingEvent, AdvertisingConversion, AdvertisingCampaignStats } from '../entity';
import { CampaignStatsResponseDto, DashboardResponseDto, PlatformComparisonDto } from '../dto';
export declare class AnalyticsService {
    private campaignRepository;
    private eventRepository;
    private conversionRepository;
    private statsRepository;
    constructor(campaignRepository: Repository<AdvertisingCampaign>, eventRepository: Repository<AdvertisingEvent>, conversionRepository: Repository<AdvertisingConversion>, statsRepository: Repository<AdvertisingCampaignStats>);
    getCampaignStats(campaignId: number, from?: string, to?: string): Promise<CampaignStatsResponseDto>;
    getDashboardStats(from?: string, to?: string): Promise<DashboardResponseDto>;
    getPlatformComparison(from?: string, to?: string): Promise<PlatformComparisonDto[]>;
    private calculateOverviewStats;
    private getTimelineStats;
    private getPlatformStats;
    private getRecentEvents;
}

import { AnalyticsService } from '../services';
import { AnalyticsQueryDto, DashboardResponseDto, PlatformComparisonDto } from '../dto';
export declare class AdminAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(query: AnalyticsQueryDto): Promise<{
        code: number;
        message: string;
        data: DashboardResponseDto;
    }>;
    getPlatformComparison(query: AnalyticsQueryDto): Promise<{
        code: number;
        message: string;
        data: PlatformComparisonDto[];
    }>;
}

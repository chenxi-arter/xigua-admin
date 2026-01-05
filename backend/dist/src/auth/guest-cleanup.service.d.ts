import { GuestService } from './guest.service';
export declare class GuestCleanupService {
    private readonly guestService;
    private readonly logger;
    constructor(guestService: GuestService);
    handleDailyCleanup(): Promise<void>;
    handleWeeklyStatistics(): Promise<void>;
    manualCleanup(inactiveDays?: number, recentActivityDays?: number): Promise<{
        success: boolean;
        deactivated: number;
        message: string;
        details?: undefined;
    } | {
        success: boolean;
        deactivated: number;
        message: string;
        details: {
            inactiveDays: number;
            recentActivityDays: number;
            cutoffDate: string;
            recentDate: string;
        };
    }>;
}

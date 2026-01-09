import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
export declare class GuestService {
    private readonly userRepo;
    private readonly authService;
    private readonly logger;
    constructor(userRepo: Repository<User>, authService: AuthService);
    guestLogin(guestToken?: string, deviceInfo?: string): Promise<{
        guestToken: string;
        isNewGuest: boolean;
        userId: number;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    private createGuestUser;
    private generateGuestToken;
    convertGuestToUser(userId: number, email?: string, telegramId?: number): Promise<User>;
    cleanInactiveGuests(inactiveDays?: number, recentActivityDays?: number): Promise<{
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
    getGuestStatistics(): Promise<{
        totalGuests: number;
        activeGuests: number;
        inactiveGuests: number;
        convertedGuests: number;
        recentGuests: number;
        conversionRate: string;
    }>;
    reactivateGuest(userId: number): Promise<{
        success: boolean;
        message: string;
        userId: number;
    }>;
}

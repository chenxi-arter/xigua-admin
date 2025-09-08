import { UserService } from './user.service';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { AuthService } from '../auth/auth.service';
import { RefreshTokenDto } from '../auth/dto/refresh-token.dto';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    telegramLogin(dto: TelegramUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    telegramLoginGet(dto: TelegramUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    getMe(req: any): Promise<{
        message: string;
        id?: undefined;
        username?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
    } | {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        createdAt: Date;
        message?: undefined;
    }>;
    refreshToken(dto: RefreshTokenDto, req: any): Promise<{
        access_token: string;
        expires_in: number;
        token_type: string;
    }>;
    verifyRefreshToken(dto: RefreshTokenDto): Promise<{
        valid: boolean;
        message: any;
    }>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
        success: boolean;
    }>;
    logoutAll(req: any): Promise<{
        message: string;
        success: boolean;
    }>;
    getActiveDevices(req: any): Promise<{
        devices: {
            id: number;
            deviceInfo: string;
            ipAddress: string;
            createdAt: Date;
            expiresAt: Date;
        }[];
        total: number;
    }>;
    revokeDevice(tokenId: string, req: any): Promise<{
        message: string;
        success: boolean;
    }>;
}

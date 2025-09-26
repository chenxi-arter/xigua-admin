import { AuthService } from './auth.service';
import { TelegramLoginDto, TelegramLoginResponseDto } from './dto/telegram-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailLoginDto } from '../user/dto/email-login.dto';
import { RegisterDto, RegisterResponseDto } from '../user/dto/register.dto';
import { BotLoginDto } from './dto/bot-login.dto';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    telegramLogin(loginDto: TelegramLoginDto): Promise<TelegramLoginResponseDto>;
    telegramBotLogin(dto: BotLoginDto): Promise<TelegramLoginResponseDto>;
    emailLogin(dto: EmailLoginDto): Promise<import("../user/dto/email-login.dto").EmailLoginResponseDto>;
    register(dto: RegisterDto): Promise<RegisterResponseDto>;
    refreshToken(refreshDto: RefreshTokenDto, ip: string): Promise<{
        access_token: string;
        expires_in: number;
        token_type: string;
    }>;
    getActiveDevices(req: {
        user?: {
            userId: number;
        };
    }): Promise<{
        devices: {
            id: number;
            deviceInfo: string;
            ipAddress: string;
            createdAt: Date;
            expiresAt: Date;
        }[];
        total: number;
    }>;
    revokeDevice(tokenId: string): {
        message: string;
        success: boolean;
    };
    logout(refreshDto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    logoutAll(req: {
        user?: {
            userId: number;
        };
    }): Promise<{
        message: string;
    }>;
    getProfile(req: {
        user?: {
            userId: number;
        };
    }): {
        userId: number;
        message: string;
    };
}

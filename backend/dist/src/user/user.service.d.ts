import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { EmailLoginDto, EmailLoginResponseDto } from './dto/email-login.dto';
import { BindTelegramDto, BindTelegramResponseDto } from './dto/bind-telegram.dto';
import { BindEmailDto } from './dto/bind-email.dto';
import { UpdateNicknameDto, UpdateNicknameResponseDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto, UpdatePasswordResponseDto } from './dto/update-password.dto';
import { AuthService } from '../auth/auth.service';
import { TelegramAuthService } from '../auth/telegram-auth.service';
interface TokenResult {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}
export declare class UserService {
    private readonly userRepo;
    private readonly authService;
    private readonly telegramAuthService;
    constructor(userRepo: Repository<User>, authService: AuthService, telegramAuthService: TelegramAuthService);
    telegramLogin(dto: TelegramUserDto): Promise<TokenResult>;
    private validateBotToken;
    bindEmail(userId: number, dto: BindEmailDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            shortId: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            telegramId: number;
            isActive: boolean;
        };
    }>;
    private validateAndExtractUserData;
    private validateWebAppLogin;
    private validateBotLogin;
    private findOrCreateUser;
    private createNewUser;
    private updateExistingUser;
    private generateUserTokens;
    findUserById(id: number): Promise<User | null>;
    register(dto: RegisterDto): Promise<RegisterResponseDto>;
    emailLogin(dto: EmailLoginDto): Promise<EmailLoginResponseDto>;
    bindTelegram(userId: number, dto: BindTelegramDto): Promise<BindTelegramResponseDto>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByTelegramId(telegramId: number): Promise<User | null>;
    updateNickname(userId: number, dto: UpdateNicknameDto): Promise<UpdateNicknameResponseDto>;
    updatePassword(userId: number, dto: UpdatePasswordDto): Promise<UpdatePasswordResponseDto>;
}
export {};

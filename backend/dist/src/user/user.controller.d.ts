import { UserService } from './user.service';
import { BindTelegramDto, BindTelegramResponseDto } from './dto/bind-telegram.dto';
import { AuthService } from '../auth/auth.service';
import { BindEmailDto } from './dto/bind-email.dto';
import { UpdateNicknameDto, UpdateNicknameResponseDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto, UpdatePasswordResponseDto } from './dto/update-password.dto';
import { UpdateAvatarDto, UpdateAvatarResponseDto } from './dto/update-avatar.dto';
interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
    };
}
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    getMe(req: AuthenticatedRequest): Promise<{
        message: string;
        email?: undefined;
        username?: undefined;
        nickname?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        photoUrl?: undefined;
        hasTelegram?: undefined;
        tgusername?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
    } | {
        email: string | null;
        username: string;
        nickname: string;
        firstName: string;
        lastName: string;
        photoUrl: string | null;
        hasTelegram: boolean;
        tgusername: number | null;
        isActive: boolean;
        createdAt: Date;
        message?: undefined;
    }>;
    bindTelegram(dto: BindTelegramDto, req: AuthenticatedRequest): Promise<BindTelegramResponseDto>;
    bindEmail(dto: BindEmailDto, req: AuthenticatedRequest): Promise<{
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
    updateNickname(dto: UpdateNicknameDto, req: AuthenticatedRequest): Promise<UpdateNicknameResponseDto>;
    updatePassword(dto: UpdatePasswordDto, req: AuthenticatedRequest): Promise<UpdatePasswordResponseDto>;
    updateAvatar(dto: UpdateAvatarDto, req: AuthenticatedRequest): Promise<UpdateAvatarResponseDto>;
}
export {};

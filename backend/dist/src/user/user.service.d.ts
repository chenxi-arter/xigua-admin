import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { AuthService } from '../auth/auth.service';
export declare class UserService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly authService;
    constructor(userRepo: Repository<User>, jwtService: JwtService, authService: AuthService);
    telegramLogin(dto: TelegramUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    }>;
    findUserById(id: number): Promise<User | null>;
}

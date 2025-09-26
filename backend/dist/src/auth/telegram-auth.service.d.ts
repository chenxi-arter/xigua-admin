import { ConfigService } from '@nestjs/config';
export interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}
export interface TelegramInitData {
    query_id?: string;
    user: TelegramUser;
    auth_date: number;
    hash: string;
}
export declare class TelegramAuthService {
    private configService;
    private readonly logger;
    private readonly botToken;
    constructor(configService: ConfigService);
    verifyInitData(initData: string): TelegramUser | null;
    generateLoginUrl(redirectUrl: string): string;
}

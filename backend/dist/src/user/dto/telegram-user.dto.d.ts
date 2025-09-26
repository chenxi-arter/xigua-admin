export declare enum LoginType {
    WEBAPP = "webapp",
    BOT = "bot"
}
export declare class TelegramUserDto {
    loginType: LoginType;
    initData?: string;
    deviceInfo?: string;
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    auth_date?: number;
    hash?: string;
    photo_url?: string;
}

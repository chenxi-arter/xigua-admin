export declare class TelegramLoginDto {
    initData: string;
    deviceInfo?: string;
    guestToken?: string;
}
export declare class TelegramLoginResponseDto {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

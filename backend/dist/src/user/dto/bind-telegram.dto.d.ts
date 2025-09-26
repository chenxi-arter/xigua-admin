export declare class BindTelegramDto {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    auth_date: number;
    hash: string;
}
export declare class BindTelegramResponseDto {
    success: boolean;
    message: string;
    user: {
        id: number;
        shortId: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        telegramId: number | null;
        isActive: boolean;
    };
}

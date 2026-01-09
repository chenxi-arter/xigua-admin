export declare class ConvertGuestToEmailDto {
    email: string;
    password: string;
    confirmPassword: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}
export declare class ConvertGuestResponseDto {
    success: boolean;
    message: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

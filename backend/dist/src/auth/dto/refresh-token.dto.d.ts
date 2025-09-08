export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class LoginResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
export declare class RefreshResponseDto {
    access_token: string;
    expires_in: number;
    token_type: string;
}

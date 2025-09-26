export declare class EmailLoginDto {
    email: string;
    password: string;
    deviceInfo?: string;
}
export declare class EmailLoginResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

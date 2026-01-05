export declare class GuestLoginDto {
    guestToken?: string;
    deviceInfo?: string;
}
export declare class GuestLoginResponseDto {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    guestToken: string;
    isNewGuest: boolean;
    userId: number;
}

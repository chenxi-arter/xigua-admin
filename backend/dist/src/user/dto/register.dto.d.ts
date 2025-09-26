export declare class RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}
export declare class RegisterResponseDto {
    id: number;
    shortId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
}

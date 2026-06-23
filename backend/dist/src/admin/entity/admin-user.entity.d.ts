export declare class AdminUser {
    id: number;
    username: string;
    passwordHash: string;
    name?: string | null;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

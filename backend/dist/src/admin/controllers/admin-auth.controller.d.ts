import { AdminAuthService } from '../services/admin-auth.service';
type AdminRequest = {
    admin?: {
        id: number;
        username: string;
        role: string;
    };
};
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        admin: {
            id: number;
            username: string;
            name: string | null | undefined;
            role: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    init(body: {
        username: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    me(req: AdminRequest): {
        id: number;
        username: string;
        role: string;
    } | undefined;
    list(): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    add(body: {
        username: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: AdminRequest, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(id: number, body: {
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: number, req: AdminRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};

import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user.entity';
type AdminLoginDto = {
    username: string;
    password: string;
};
type CreateAdminDto = {
    username: string;
    password: string;
    name?: string;
    role?: string;
};
export declare class AdminAuthService implements OnModuleInit {
    private readonly adminUserRepo;
    private readonly jwtService;
    constructor(adminUserRepo: Repository<AdminUser>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    login(dto: AdminLoginDto): Promise<{
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
    createFirstAdmin(dto: CreateAdminDto): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addAdmin(dto: CreateAdminDto): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(adminId: number, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(adminId: number, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAdmin(adminId: number, currentAdminId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    listAdmins(): Promise<{
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    validateAdmin(adminId: number): Promise<AdminUser>;
    toSafeAdmin(admin: AdminUser): {
        id: number;
        username: string;
        name: string | null | undefined;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    private createAdmin;
    private getExpiresInSeconds;
    private ensureTable;
}
export {};

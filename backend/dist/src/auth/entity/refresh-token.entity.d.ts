import { User } from '../../user/entity/user.entity';
export declare class RefreshToken {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    isRevoked: boolean;
    deviceInfo?: string;
    ipAddress?: string;
    user: User;
}

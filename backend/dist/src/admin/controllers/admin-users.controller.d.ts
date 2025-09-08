import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
export declare class AdminUsersController {
    private readonly userRepo;
    private readonly refreshTokenRepo;
    constructor(userRepo: Repository<User>, refreshTokenRepo: Repository<RefreshToken>);
    list(page?: number, size?: number): Promise<{
        total: number;
        items: any[];
        page: number;
        size: number;
    }>;
    get(id: string): Promise<any>;
    create(body: Partial<User>): Promise<User>;
    update(id: string, body: Partial<User>): Promise<User | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

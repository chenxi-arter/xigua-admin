import { Repository } from 'typeorm';
import { Banner } from '../../video/entity/banner.entity';
export declare class AdminBannersController {
    private readonly bannerRepo;
    constructor(bannerRepo: Repository<Banner>);
    private normalize;
    list(page?: number, size?: number): Promise<{
        total: number;
        items: Banner[];
        page: number;
        size: number;
    }>;
    get(id: string): Promise<Banner | null>;
    create(body: Partial<Banner>): Promise<Banner>;
    update(id: string, body: Partial<Banner>): Promise<Banner | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

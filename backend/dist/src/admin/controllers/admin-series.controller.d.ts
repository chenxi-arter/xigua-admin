import { Repository } from 'typeorm';
import { Series } from '../../video/entity/series.entity';
export declare class AdminSeriesController {
    private readonly seriesRepo;
    constructor(seriesRepo: Repository<Series>);
    list(page?: number, size?: number): Promise<{
        total: number;
        items: Series[];
        page: number;
        size: number;
    }>;
    get(id: string): Promise<Series | null>;
    create(body: Partial<Series>): Promise<Series>;
    update(id: string, body: Partial<Series>): Promise<Series | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

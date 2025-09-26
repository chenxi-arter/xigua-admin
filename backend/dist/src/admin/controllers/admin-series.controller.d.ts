import { Repository } from 'typeorm';
import { Series } from '../../video/entity/series.entity';
import { VideoService } from '../../video/video.service';
export declare class AdminSeriesController {
    private readonly seriesRepo;
    private readonly videoService;
    constructor(seriesRepo: Repository<Series>, videoService: VideoService);
    list(page?: number, size?: number, includeDeleted?: string): Promise<{
        total: number;
        items: Series[];
        page: number;
        size: number;
    }>;
    getDeleted(page?: number, size?: number): Promise<{
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
        message: string;
    }>;
    restore(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

import { VideoService } from './video.service';
export declare class AdminController {
    private readonly videoService;
    constructor(videoService: VideoService);
    softDeleteSeries(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreSeries(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getDeletedSeries(page?: number, size?: number): Promise<{
        list: any[];
        total: number;
        page: number;
        size: number;
    }>;
}

import { Repository } from 'typeorm';
import { Series } from '../../video/entity/series.entity';
import { FilterOption } from '../../video/entity/filter-option.entity';
import { VideoService } from '../../video/video.service';
import { R2StorageService } from '../../core/storage/r2-storage.service';
import { GetPresignedUrlDto, UploadCompleteDto } from '../dto/presigned-upload.dto';
export declare class AdminSeriesController {
    private readonly seriesRepo;
    private readonly filterOptionRepo;
    private readonly videoService;
    private readonly storage;
    constructor(seriesRepo: Repository<Series>, filterOptionRepo: Repository<FilterOption>, videoService: VideoService, storage: R2StorageService);
    private findFilterOptionIdByName;
    private resolveChineseFilters;
    private normalize;
    list(page?: number, size?: number, includeDeleted?: string, categoryId?: string): Promise<{
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
    getPresignedUploadUrl(id: string, query: GetPresignedUrlDto): Promise<{
        uploadUrl: string;
        fileKey: string;
        publicUrl: string;
    }>;
    uploadComplete(id: string, body: UploadCompleteDto): Promise<{
        success: boolean;
        message: string;
        coverUrl: string;
    }>;
    get(id: string): Promise<Series | null>;
    create(body: any): Promise<Series>;
    private validateFilterOptionIds;
    update(id: string, body: any): Promise<Series | null>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    restore(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    uploadCover(id: string, file?: {
        buffer?: Buffer;
        originalname?: string;
        mimetype?: string;
    }): Promise<Series | null>;
    uploadCoverFromUrl(id: string, src?: string): Promise<Series | null>;
}

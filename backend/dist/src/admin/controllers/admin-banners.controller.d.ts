import { Repository } from 'typeorm';
import { Banner } from '../../video/entity/banner.entity';
import { R2StorageService } from '../../core/storage/r2-storage.service';
import { GetPresignedUrlDto, UploadCompleteDto } from '../dto/presigned-upload.dto';
export declare class AdminBannersController {
    private readonly bannerRepo;
    private readonly storage;
    constructor(bannerRepo: Repository<Banner>, storage: R2StorageService);
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
    uploadImage(id: string, file?: {
        buffer?: Buffer;
        originalname?: string;
        mimetype?: string;
    }): Promise<Banner | null>;
    uploadImageFromUrl(id: string, src?: string): Promise<Banner | null>;
    getPresignedUploadUrl(id: string, query: GetPresignedUrlDto): Promise<{
        uploadUrl: string;
        fileKey: string;
        publicUrl: string;
    }>;
    uploadComplete(id: string, body: UploadCompleteDto): Promise<{
        success: boolean;
        message: string;
        imageUrl: string;
    }>;
}

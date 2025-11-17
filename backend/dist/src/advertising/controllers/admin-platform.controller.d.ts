import { PlatformService } from '../services';
import { CreatePlatformDto, UpdatePlatformDto, UpdatePlatformStatusDto, UpdatePlatformSortDto, PlatformResponseDto } from '../dto';
export declare class AdminPlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    findAll(enabled?: string): Promise<{
        code: number;
        message: string;
        data: PlatformResponseDto[];
    }>;
    findOne(id: number): Promise<{
        code: number;
        message: string;
        data: PlatformResponseDto;
    }>;
    create(createPlatformDto: CreatePlatformDto): Promise<{
        code: number;
        message: string;
        data: PlatformResponseDto;
    }>;
    update(id: number, updatePlatformDto: UpdatePlatformDto): Promise<{
        code: number;
        message: string;
        data: PlatformResponseDto;
    }>;
    updateStatus(id: number, updateStatusDto: UpdatePlatformStatusDto): Promise<{
        code: number;
        message: string;
        data: PlatformResponseDto;
    }>;
    updateSort(updateSortDto: UpdatePlatformSortDto): Promise<{
        code: number;
        message: string;
    }>;
    remove(id: number): Promise<{
        code: number;
        message: string;
    }>;
}

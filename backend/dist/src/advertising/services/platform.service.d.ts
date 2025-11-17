import { Repository } from 'typeorm';
import { AdvertisingPlatform } from '../entity';
import { CreatePlatformDto, UpdatePlatformDto, UpdatePlatformStatusDto, UpdatePlatformSortDto } from '../dto';
export declare class PlatformService {
    private platformRepository;
    constructor(platformRepository: Repository<AdvertisingPlatform>);
    findAll(enabled?: boolean): Promise<AdvertisingPlatform[]>;
    findOne(id: number): Promise<AdvertisingPlatform>;
    findByCode(code: string): Promise<AdvertisingPlatform>;
    create(createPlatformDto: CreatePlatformDto, createdBy?: string): Promise<AdvertisingPlatform>;
    update(id: number, updatePlatformDto: UpdatePlatformDto): Promise<AdvertisingPlatform>;
    updateStatus(id: number, updateStatusDto: UpdatePlatformStatusDto): Promise<AdvertisingPlatform>;
    updateSort(updateSortDto: UpdatePlatformSortDto): Promise<void>;
    remove(id: number): Promise<void>;
}

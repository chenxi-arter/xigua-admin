import { Repository } from 'typeorm';
import { AdvertisingCampaign, AdvertisingPlatform } from '../entity';
import { CreateCampaignDto, UpdateCampaignDto, UpdateCampaignStatusDto, CampaignQueryDto, CampaignListResponseDto, CampaignResponseDto } from '../dto';
import { PlatformService } from './platform.service';
export declare class CampaignService {
    private campaignRepository;
    private platformRepository;
    private platformService;
    constructor(campaignRepository: Repository<AdvertisingCampaign>, platformRepository: Repository<AdvertisingPlatform>, platformService: PlatformService);
    findAll(query: CampaignQueryDto): Promise<CampaignListResponseDto>;
    findOne(id: number): Promise<CampaignResponseDto>;
    findByCode(campaignCode: string): Promise<AdvertisingCampaign>;
    create(createCampaignDto: CreateCampaignDto, createdBy?: string): Promise<CampaignResponseDto>;
    update(id: number, updateCampaignDto: UpdateCampaignDto): Promise<CampaignResponseDto>;
    updateStatus(id: number, updateStatusDto: UpdateCampaignStatusDto): Promise<CampaignResponseDto>;
    remove(id: number): Promise<void>;
    private transformToResponseDto;
}

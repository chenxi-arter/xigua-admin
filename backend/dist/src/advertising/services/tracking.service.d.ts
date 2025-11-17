import { Repository } from 'typeorm';
import { AdvertisingEvent, AdvertisingConversion } from '../entity';
import { CreateEventDto, BatchCreateEventDto, CreateConversionDto, EventResponseDto, ConversionResponseDto } from '../dto';
import { CampaignService } from './campaign.service';
export declare class TrackingService {
    private eventRepository;
    private conversionRepository;
    private campaignService;
    constructor(eventRepository: Repository<AdvertisingEvent>, conversionRepository: Repository<AdvertisingConversion>, campaignService: CampaignService);
    createEvent(createEventDto: CreateEventDto, ipAddress?: string): Promise<EventResponseDto>;
    createEventsBatch(batchCreateEventDto: BatchCreateEventDto, ipAddress?: string): Promise<EventResponseDto>;
    createConversion(createConversionDto: CreateConversionDto): Promise<ConversionResponseDto>;
    getEventsByCampaign(campaignId: number, startDate?: Date, endDate?: Date): Promise<AdvertisingEvent[]>;
    getConversionsByCampaign(campaignId: number, startDate?: Date, endDate?: Date): Promise<AdvertisingConversion[]>;
}

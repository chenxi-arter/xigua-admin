import { Request } from 'express';
import { TrackingService } from '../services';
import { CreateEventDto, BatchCreateEventDto, CreateConversionDto, EventResponseDto, ConversionResponseDto } from '../dto';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    createEvent(createEventDto: CreateEventDto, req: Request & {
        user?: {
            userId: number;
        };
    }): Promise<{
        code: number;
        message: string;
        data: EventResponseDto;
    }>;
    createEventsBatch(batchCreateEventDto: BatchCreateEventDto, req: Request): Promise<{
        code: number;
        message: string;
        data: EventResponseDto;
    }>;
    createConversion(createConversionDto: CreateConversionDto, req: Request & {
        user?: {
            userId: number;
        };
    }): Promise<{
        code: number;
        message: string;
        data: ConversionResponseDto;
    }>;
    private getClientIp;
}

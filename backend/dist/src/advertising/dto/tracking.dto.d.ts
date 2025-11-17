import { EventType, ConversionType } from '../entity';
export declare class CreateEventDto {
    campaignCode: string;
    eventType: EventType;
    eventData?: any;
    sessionId?: string;
    deviceId?: string;
    referrer?: string;
    userAgent?: string;
}
export declare class BatchCreateEventDto {
    events: CreateEventDto[];
}
export declare class CreateConversionDto {
    campaignCode: string;
    conversionType: ConversionType;
    conversionValue?: number;
    userId: number;
    sessionId?: string;
    deviceId?: string;
}
export declare class EventResponseDto {
    success: boolean;
    message?: string;
}
export declare class ConversionResponseDto {
    success: boolean;
    message?: string;
    conversionId?: number;
}

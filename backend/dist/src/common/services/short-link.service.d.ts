import { ConfigService } from '@nestjs/config';
import { CreateShortLinkDto, ShortLinkResponseDto } from '../dto/short-link.dto';
export declare class ShortLinkService {
    private configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(configService: ConfigService);
    createShortLink(dto: CreateShortLinkDto): Promise<ShortLinkResponseDto>;
}

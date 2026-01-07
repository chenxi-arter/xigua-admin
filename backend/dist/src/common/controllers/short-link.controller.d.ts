import { ShortLinkService } from '../services/short-link.service';
import { CreateShortLinkDto, ShortLinkResponseDto } from '../dto/short-link.dto';
export declare class ShortLinkController {
    private readonly shortLinkService;
    constructor(shortLinkService: ShortLinkService);
    createShortLink(dto: CreateShortLinkDto): Promise<import("../dto/response.dto").ApiResponse<ShortLinkResponseDto>>;
}

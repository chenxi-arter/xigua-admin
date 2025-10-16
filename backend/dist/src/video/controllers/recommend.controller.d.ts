import { RecommendService } from '../services/recommend.service';
import { RecommendQueryDto } from '../dto/recommend.dto';
import { BaseController } from './base.controller';
export declare class RecommendController extends BaseController {
    private readonly recommendService;
    constructor(recommendService: RecommendService);
    getRecommendList(dto: RecommendQueryDto, req: {
        user?: {
            userId?: number;
        };
    }): Promise<void | import("./base.controller").ApiResponse<{
        list: import("../dto/recommend.dto").RecommendEpisodeItem[];
        page: number;
        size: number;
        hasMore: boolean;
    }>>;
}

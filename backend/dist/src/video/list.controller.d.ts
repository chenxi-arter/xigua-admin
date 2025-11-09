import { VideoService } from './video.service';
import { FilterTagsDto } from './dto/filter-tags.dto';
import { FilterDataDto } from './dto/filter-data.dto';
import { ConditionFilterDto } from './dto/condition-filter.dto';
import { FuzzySearchDto } from './dto/fuzzy-search.dto';
import { CategoryValidator } from '../common/validators/category-validator';
export declare class ListController {
    private readonly videoService;
    private readonly categoryValidator;
    constructor(videoService: VideoService, categoryValidator: CategoryValidator);
    getFiltersTags(dto: FilterTagsDto): Promise<import("./dto/filter-tags.dto").FilterTagsResponse>;
    getFiltersData(dto: FilterDataDto): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
    getConditionFilterData(dto: ConditionFilterDto): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
    fuzzySearch(dto: FuzzySearchDto): Promise<import("./dto/fuzzy-search.dto").FuzzySearchResponse | {
        code: number;
        msg: string;
        data: null;
        success: boolean;
        timestamp: number;
    }>;
    clearFilterCache(channeid?: string): Promise<{
        code: number;
        msg: string;
        data: null;
        success: boolean;
        timestamp: number;
    }>;
}

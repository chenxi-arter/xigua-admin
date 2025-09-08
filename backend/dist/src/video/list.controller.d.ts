import { VideoService } from './video.service';
import { FilterTagsDto } from './dto/filter-tags.dto';
import { FilterDataDto } from './dto/filter-data.dto';
import { ConditionFilterDto } from './dto/condition-filter.dto';
import { FuzzySearchDto } from './dto/fuzzy-search.dto';
export declare class ListController {
    private readonly videoService;
    constructor(videoService: VideoService);
    getFiltersTags(dto: FilterTagsDto): Promise<import("./dto/filter-tags.dto").FilterTagsResponse>;
    getFiltersData(dto: FilterDataDto): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
    getConditionFilterData(dto: ConditionFilterDto): Promise<import("./dto/condition-filter.dto").ConditionFilterResponse>;
    fuzzySearch(dto: FuzzySearchDto): Promise<any>;
    clearFilterCache(channeid?: string): Promise<{
        code: number;
        msg: string;
        data: null;
        success: boolean;
        timestamp: number;
    }>;
}

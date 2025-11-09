import { SearchSuggestionsService } from '../services/search-suggestions.service';
import { BaseController } from './base.controller';
export declare class SearchController extends BaseController {
    private readonly searchSuggestionsService;
    constructor(searchSuggestionsService: SearchSuggestionsService);
    getHotSuggestions(limit?: string, categoryId?: string, daysRange?: string): Promise<void | import("./base.controller").ApiResponse<{
        id: number;
        title: string;
        shortId: string;
        categoryName: string;
        playCount: number;
        score: string;
    }[]>>;
    getHotKeywords(limit?: string, categoryId?: string): Promise<void | import("./base.controller").ApiResponse<string[]>>;
}

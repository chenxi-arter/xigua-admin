import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Category } from './entity/category.entity';
import { Series } from './entity/series.entity';
import { Episode } from './entity/episode.entity';
import { ShortVideo } from "./entity/short-video.entity";
import { FilterOption } from './entity/filter-option.entity';
import { FilterTagsResponse } from './dto/filter-tags.dto';
import { FilterDataResponse } from './dto/filter-data.dto';
import { ConditionFilterDto, ConditionFilterResponse } from './dto/condition-filter.dto';
import { EpisodeListResponse } from './dto/episode-list.dto';
import { WatchProgressService } from './services/watch-progress.service';
import { CommentService } from './services/comment.service';
import { EpisodeService } from './services/episode.service';
import { CategoryService } from './services/category.service';
import { FilterService } from './services/filter.service';
import { SeriesService } from './services/series.service';
import { BannerService } from './services/banner.service';
import { BrowseHistoryService } from './services/browse-history.service';
export declare class VideoService {
    private readonly catRepo;
    private readonly seriesRepo;
    private readonly shortRepo;
    private readonly epRepo;
    private readonly filterOptionRepo;
    private cacheManager;
    private readonly watchProgressService;
    private readonly commentService;
    private readonly episodeService;
    private readonly categoryService;
    private readonly filterService;
    private readonly seriesService;
    private readonly bannerService;
    private readonly browseHistoryService;
    constructor(catRepo: Repository<Category>, seriesRepo: Repository<Series>, shortRepo: Repository<ShortVideo>, epRepo: Repository<Episode>, filterOptionRepo: Repository<FilterOption>, cacheManager: Cache, watchProgressService: WatchProgressService, commentService: CommentService, episodeService: EpisodeService, categoryService: CategoryService, filterService: FilterService, seriesService: SeriesService, bannerService: BannerService, browseHistoryService: BrowseHistoryService);
    listCategories(): Promise<{}>;
    listSeriesByCategory(categoryId: number): Promise<{}>;
    getSeriesDetail(seriesId: number): Promise<{} | null>;
    saveProgress(userId: number, episodeId: number, stopAtSecond: number): Promise<{
        ok: boolean;
    }>;
    getProgress(userId: number, episodeId: number): Promise<{
        stopAtSecond: number;
    }>;
    getUserSeriesProgress(userId: number, seriesId: number): Promise<{
        currentEpisode: number;
        currentEpisodeShortId: string;
        watchProgress: number;
        watchPercentage: number;
        totalWatchTime: number;
        lastWatchTime: string;
        isCompleted: boolean;
    } | null>;
    getEpisodeByShortId(episodeShortId: string): Promise<Episode | null>;
    private clearVideoRelatedCache;
    private clearAllListCache;
    addComment(userId: number, episodeId: number, content: string, appearSecond?: number): Promise<import("./entity/comment.entity").Comment>;
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<import("./entity/episode-url.entity").EpisodeUrl>;
    getEpisodeUrlByAccessKey(accessKey: string): Promise<{
        accessKeySource: string;
        episodeId: number;
        episodeShortId: string;
        episodeTitle: string;
        seriesId: number;
        seriesShortId: string;
        urls: {
            id: number;
            quality: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
            accessKey: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getEpisodeUrlByKey(prefix: string, raw: string): Promise<{
        accessKeySource: string;
        episodeId: number;
        episodeShortId: string;
        episodeTitle: string;
        seriesId: number;
        seriesShortId: string;
        urls: {
            id: number;
            quality: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
            accessKey: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<{
        ok: boolean;
    }>;
    generateAccessKeysForExisting(): Promise<{
        updatedUrlKeys: number;
        updatedEpisodeKeys: number;
    }>;
    listMedia(categoryId?: number, type?: 'short' | 'series', userId?: number, sort?: 'latest' | 'like' | 'play', page?: number, size?: number): Promise<[ShortVideo[], number] | {
        list: {
            id: number;
            title: string;
            coverUrl: string;
            totalEpisodes: number;
            categoryName: string;
            latestEpisode: number;
        }[];
        total: number;
        page: number;
        size: number;
    }>;
    listSeriesFull(categoryId?: number, page?: number, size?: number): Promise<{
        list: {
            id: number;
            title: string;
            description: string;
            coverUrl: string;
            totalEpisodes: number;
            categoryName: string;
            createdAt: Date;
            episodes: {
                id: number;
                episodeNumber: number;
                title: string;
                duration: number;
                status: string;
            }[];
        }[];
        total: number;
        page: number;
        size: number;
    }>;
    getHomeVideos(channeid?: number, page?: number): Promise<any>;
    private findCategoryInfo;
    private createBannerBlock;
    private createSearchFilterBlock;
    private createAdvertisementBlock;
    private createVideoListBlock;
    getMovieVideos(catid?: string, page?: number): Promise<any>;
    getDramaVideos(catid?: string, page?: number): Promise<any>;
    getVarietyVideos(catid?: string, page?: number): Promise<any>;
    private getModuleVideos;
    private getTopSeries;
    private getVideoList;
    getFiltersTags(channeid: string): Promise<FilterTagsResponse>;
    clearFilterCache(channeid?: string): Promise<void>;
    getFiltersData(channeid: string, ids: string, page: string): Promise<FilterDataResponse>;
    fuzzySearch(keyword: string, channeid?: string, page?: number, size?: number): Promise<any>;
    getConditionFilterData(dto: ConditionFilterDto): Promise<ConditionFilterResponse>;
    private applyConditionFilters;
    private parseFilterIds;
    private applySorting;
    createFilterOption(data: any): Promise<{
        success: boolean;
        data: any;
    }>;
    updateFilterOption(id: number, data: any): Promise<{
        success: boolean;
        id: number;
        data: any;
    }>;
    deleteFilterOption(id: number): Promise<{
        success: boolean;
        id: number;
    }>;
    batchCreateFilterOptions(options: any[]): Promise<{
        success: boolean;
        count: number;
    }>;
    getEpisodeList(seriesIdentifier?: string, isShortId?: boolean, page?: number, size?: number, userId?: number, req?: any): Promise<EpisodeListResponse>;
    private clearProgressRelatedCache;
    private clearSeriesRelatedCache;
    private clearCommentRelatedCache;
    softDeleteSeries(seriesId: number, deletedBy?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreSeries(seriesId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getDeletedSeries(page?: number, size?: number): Promise<{
        success: boolean;
        data: {
            list: Series[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}

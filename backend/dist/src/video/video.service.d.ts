import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Episode } from './entity/episode.entity';
import { Series } from './entity/series.entity';
import { Comment } from './entity/comment.entity';
import { PlaybackService } from './services/playback.service';
import { ContentService } from './services/content.service';
import { HomeService } from './services/home.service';
import { MediaService } from './services/media.service';
import { UrlService } from './services/url.service';
import { FilterService } from './services/filter.service';
import { CommentService } from './services/comment.service';
import { SeriesService } from './services/series.service';
import { CategoryService } from './services/category.service';
export declare class VideoService {
    private readonly playbackService;
    private readonly contentService;
    private readonly homeService;
    private readonly mediaService;
    private readonly urlService;
    private readonly filterService;
    private readonly commentService;
    private readonly seriesService;
    private readonly categoryService;
    private readonly episodeRepo;
    private readonly seriesRepo;
    private readonly commentRepo;
    private readonly cacheManager;
    constructor(playbackService: PlaybackService, contentService: ContentService, homeService: HomeService, mediaService: MediaService, urlService: UrlService, filterService: FilterService, commentService: CommentService, seriesService: SeriesService, categoryService: CategoryService, episodeRepo: Repository<Episode>, seriesRepo: Repository<Series>, commentRepo: Repository<Comment>, cacheManager: Cache);
    saveProgress(userId: number, episodeId: number, stopAtSecond: number): Promise<{
        readonly ok: false;
        readonly reason: "episode_not_found";
    } | {
        readonly ok: true;
        readonly reason?: undefined;
    }>;
    saveProgressWithBrowseHistory(userId: number, episodeId: number, stopAtSecond: number, req?: any): Promise<{
        readonly ok: false;
        readonly reason: "episode_not_found";
    } | {
        readonly ok: true;
        readonly reason?: undefined;
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
    getEpisodeList(seriesIdentifier?: string, isShortId?: boolean, page?: number, size?: number, userId?: number, req?: any): Promise<import("./dto/episode-list.dto").EpisodeListResponse>;
    getEpisodeByShortId(shortId: string): Promise<Episode | null>;
    getSeriesDetail(id: number): Promise<{}>;
    getHomeVideos(channeid: number, page: number): Promise<{}>;
    getHomeModules(channeid: number, page: number): Promise<{
        code: number;
        msg: string;
        data: {
            list: any[];
        };
    }>;
    listCategories(): Promise<{}>;
    listMedia(categoryId?: number, type?: 'short' | 'series', userId?: number, sort?: 'latest' | 'like' | 'play', page?: number, size?: number): Promise<{
        code: number;
        data: {
            list: {
                id: number;
                shortId: string;
                title: string;
                description: string;
                coverUrl: string;
                type: string;
                categoryId: number;
                episodeCount: number;
                status: string;
                score: number;
                playCount: number;
                starring: string;
                director: string;
                createdAt: string;
            }[];
            total: number;
            page: number;
            size: number;
            hasMore: boolean;
        };
        msg: null;
    }>;
    listSeriesFull(categoryId?: number, page?: number, size?: number): Promise<{}>;
    listSeriesByCategory(categoryId: number): Promise<{}>;
    createEpisodeUrl(episodeId: number, quality: string, ossUrl: string, cdnUrl: string, subtitleUrl?: string): Promise<{
        code: number;
        data: {
            id: number;
            episodeId: number;
            quality: string;
            accessKey: string;
            ossUrl: string;
            cdnUrl: string;
            subtitleUrl: string | null;
        };
        msg: string;
    }>;
    getEpisodeUrlByAccessKey(accessKey: string): Promise<{
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
        accessKeySource: string;
    }>;
    getEpisodeUrlByKey(prefix: string, key: string): Promise<{
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
        accessKeySource: string;
    }>;
    generateAccessKeysForExisting(): Promise<{
        code: number;
        data: {
            updatedCount: number;
            message: string;
        };
        msg: string;
    }>;
    updateEpisodeSequel(episodeId: number, hasSequel: boolean): Promise<{
        code: number;
        data: {
            episodeId: number;
            hasSequel: boolean;
        };
        msg: string;
    }>;
    getFiltersTags(channeid: string): Promise<import("./dto/filter-tags.dto").FilterTagsResponse>;
    getFiltersData(channelId: string, ids: string, page: string): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
    fuzzySearch(keyword: string, channelId?: string, page?: number, size?: number): Promise<import("./dto/fuzzy-search.dto").FuzzySearchResponse>;
    getConditionFilterData(dto: any): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
    clearFilterCache(channeid?: string): Promise<void>;
    addComment(userId: number, episodeShortId: string, content: string, appearSecond?: number): Promise<Comment>;
    getSeriesByCategory(categoryId: number, page?: number, pageSize?: number): Promise<{
        series: Series[];
        total: number;
    }>;
    getAllCategories(): Promise<import("./entity/category.entity").Category[]>;
    getCategoriesWithStats(): Promise<{}>;
    softDeleteSeries(seriesId: number, deletedBy?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreSeries(seriesId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getDeletedSeries(page?: number, size?: number): Promise<{
        list: any[];
        total: number;
        page: number;
        size: number;
    }>;
    clearProgressRelatedCache(episodeId: number): void;
    clearSeriesRelatedCache(seriesId: number): void;
}

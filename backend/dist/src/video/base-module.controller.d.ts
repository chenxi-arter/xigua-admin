import { VideoService } from './video.service';
import { HomeVideosDto } from './dto/home-videos.dto';
export declare abstract class BaseModuleController {
    protected readonly videoService: VideoService;
    constructor(videoService: VideoService);
    protected abstract getDefaultChannelId(): number;
    protected abstract getModuleVideosMethod(): (channeid: number, page: number) => Promise<any>;
    getHomeVideos(dto: HomeVideosDto): Promise<any>;
    getFiltersTags(channeid: string): Promise<import("./dto/filter-tags.dto").FilterTagsResponse>;
    getFiltersData(channeid: string, ids: string, page: string): Promise<import("./dto/filter-data.dto").FilterDataResponse>;
}

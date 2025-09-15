import { VideoService } from './video.service';
import { BaseModuleController } from './base-module.controller';
import { CategoryService } from './services/category.service';
export declare class HomeController extends BaseModuleController {
    private readonly categoryService;
    constructor(videoService: VideoService, categoryService: CategoryService);
    protected getDefaultChannelId(): number;
    protected getModuleVideosMethod(): (channeid: number, page: number) => Promise<{
        code: number;
        msg: string;
        data: {
            list: any[];
        };
    }>;
    getCategories(): Promise<{}>;
}

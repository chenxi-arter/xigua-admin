import { VideoService } from './video.service';
import { BaseModuleController } from './base-module.controller';
export declare class HomeController extends BaseModuleController {
    constructor(videoService: VideoService);
    protected getDefaultChannelId(): number;
    protected getModuleVideosMethod(): (channeid: number, page: number) => Promise<any>;
    getCategories(): Promise<{}>;
}

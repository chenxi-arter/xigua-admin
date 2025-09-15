import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Series } from '../entity/series.entity';
import { Category } from '../entity/category.entity';
import { FilterService } from './filter.service';
import { BannerService } from './banner.service';
export declare class HomeService {
    private readonly seriesRepo;
    private readonly categoryRepo;
    private readonly filterService;
    private readonly bannerService;
    private readonly cacheManager;
    constructor(seriesRepo: Repository<Series>, categoryRepo: Repository<Category>, filterService: FilterService, bannerService: BannerService, cacheManager: Cache);
    getHomeVideos(channeid: number, page: number): Promise<{}>;
    getHomeModules(channeid: number, page: number): Promise<{
        code: number;
        msg: string;
        data: {
            list: any[];
        };
    }>;
    listCategories(): Promise<{}>;
    private getVideoList;
    private formatDateTime;
}

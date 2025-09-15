import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Category } from '../entity/category.entity';
import { Series } from '../entity/series.entity';
import { AppLoggerService } from '../../common/logger/app-logger.service';
export declare class CategoryService {
    private readonly categoryRepo;
    private readonly seriesRepo;
    private readonly cacheManager;
    private readonly logger;
    constructor(categoryRepo: Repository<Category>, seriesRepo: Repository<Series>, cacheManager: Cache, appLogger: AppLoggerService);
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category | null>;
    getCategorySeriesCount(categoryId: number): Promise<unknown>;
    getCategoriesWithStats(): Promise<{}>;
    createCategory(name: string): Promise<Category>;
    updateCategory(id: number, name: string): Promise<Category>;
    deleteCategory(id: number): Promise<{
        ok: boolean;
    }>;
    private clearCategoryCache;
    getPopularCategories(limit?: number): Promise<{}>;
    getRawCategories(): Promise<{}>;
    getCategoryList(versionNo?: number): Promise<{}>;
}

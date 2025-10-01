import { Repository } from 'typeorm';
import { Category } from '../../video/entity/category.entity';
export declare class AdminCategoriesController {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    private normalize;
    list(page?: number, size?: number): Promise<{
        total: number;
        items: Category[];
        page: number;
        size: number;
    }>;
    create(body: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

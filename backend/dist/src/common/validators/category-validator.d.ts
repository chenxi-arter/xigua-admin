import { CategoryService } from '../../video/services/category.service';
export declare class CategoryValidator {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    validateCategoryId(categoryId: number): Promise<{
        valid: boolean;
        category?: any;
        message?: string;
    }>;
    getAvailableCategories(): Promise<Array<{
        id: number;
        name: string;
        categoryId: string;
    }>>;
    formatAvailableCategoriesMessage(): Promise<string>;
}

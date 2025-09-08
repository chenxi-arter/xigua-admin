import { CategoryService } from './services/category.service';
import { CategoryListDto } from './dto/category-list.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getCategoryList(dto: CategoryListDto): Promise<{}>;
}

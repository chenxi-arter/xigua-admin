import { Repository } from 'typeorm';
import { FilterOption } from '../../video/entity/filter-option.entity';
export declare class AdminOptionsController {
    private readonly filterOptionRepo;
    constructor(filterOptionRepo: Repository<FilterOption>);
    debugOptions(type: string): Promise<{
        error: string;
        type?: undefined;
        total?: undefined;
        options?: undefined;
    } | {
        type: string;
        total: number;
        options: {
            id: number;
            name: string;
            value: string | null | undefined;
            isActive: boolean;
            isDefault: boolean;
            sortOrder: number;
            filterTypeId: number;
            filterTypeCode: string;
        }[];
        error?: undefined;
    }>;
    getOptions(types: string): Promise<Record<string, any[]>>;
}

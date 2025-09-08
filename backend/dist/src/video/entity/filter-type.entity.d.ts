import { FilterOption } from './filter-option.entity';
export declare class FilterType {
    id: number;
    name: string;
    code: string;
    indexPosition: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    options: FilterOption[];
}

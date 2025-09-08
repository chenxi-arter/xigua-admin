import { FilterType } from './filter-type.entity';
export declare class FilterOption {
    id: number;
    filterTypeId: number;
    name: string;
    value?: string | null;
    isDefault: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    filterType: FilterType;
}

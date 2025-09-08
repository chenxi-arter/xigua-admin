import { Category } from './category.entity';
import { Series } from './series.entity';
export declare class Banner {
    id: number;
    title: string;
    imageUrl: string;
    seriesId?: number;
    categoryId: number;
    linkUrl?: string;
    weight: number;
    isActive: boolean;
    startTime?: Date;
    endTime?: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    impressions: number;
    clicks: number;
    category: Category;
    series?: Series;
}

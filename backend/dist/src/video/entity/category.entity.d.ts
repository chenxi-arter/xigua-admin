import { Series } from './series.entity';
import { ShortVideo } from './short-video.entity';
export declare class Category {
    id: number;
    categoryId: string;
    name: string;
    routeName: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    series: Series[];
    shortVideos: ShortVideo[];
}

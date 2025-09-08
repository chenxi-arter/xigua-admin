import { Category } from './category.entity';
export declare class ShortVideo {
    id: number;
    shortId: string;
    title: string;
    description: string;
    coverUrl: string;
    videoUrl: string;
    duration: number;
    playCount: number;
    likeCount: number;
    platformName: string;
    categoryId: number;
    category: Category;
    createdAt: Date;
    generateShortId(): void;
}

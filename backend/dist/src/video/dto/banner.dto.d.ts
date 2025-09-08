export declare class CreateBannerDto {
    title: string;
    imageUrl: string;
    seriesId?: number;
    categoryId: number;
    linkUrl?: string;
    weight?: number;
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
    description?: string;
}
export declare class UpdateBannerDto {
    title?: string;
    imageUrl?: string;
    seriesId?: number;
    categoryId?: number;
    linkUrl?: string;
    weight?: number;
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
    description?: string;
}
export declare class BannerQueryDto {
    categoryId?: number;
    isActive?: boolean;
    page?: number;
    size?: number;
}
export interface BannerResponseDto {
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
    category?: {
        id: number;
        name: string;
    };
    series?: {
        id: number;
        title: string;
        shortId?: string;
    };
}

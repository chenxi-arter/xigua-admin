export declare class CreatePlatformDto {
    name: string;
    code: string;
    description?: string;
    iconUrl?: string;
    color?: string;
    config?: any;
}
export declare class UpdatePlatformDto {
    name?: string;
    description?: string;
    iconUrl?: string;
    color?: string;
    config?: any;
}
export declare class UpdatePlatformStatusDto {
    isEnabled: boolean;
}
export declare class UpdatePlatformSortDto {
    platforms: PlatformSortItem[];
}
export declare class PlatformSortItem {
    id: number;
    sortOrder: number;
}
export declare class PlatformResponseDto {
    id: number;
    name: string;
    code: string;
    description: string;
    iconUrl: string;
    color: string;
    isEnabled: boolean;
    sortOrder: number;
    config: any;
    createdAt: Date;
    updatedAt: Date;
}

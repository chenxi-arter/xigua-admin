export declare class PaginationDto {
    page: number;
    limit: number;
}
export declare class EnhancedPaginationDto {
    page: number;
    size: number;
    get skip(): number;
    get take(): number;
    createMeta(total: number): {
        page: number;
        size: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

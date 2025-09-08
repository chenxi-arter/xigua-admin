import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
export declare class QueryOptimizer {
    static addPagination<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, page?: number, limit?: number): SelectQueryBuilder<T>;
    static addSorting<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, sortField: string, sortOrder?: 'ASC' | 'DESC'): SelectQueryBuilder<T>;
    static addMultipleSorting<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, sortOptions: Array<{
        field: string;
        order: 'ASC' | 'DESC';
    }>): SelectQueryBuilder<T>;
    static addSearch<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, searchFields: string[], searchTerm: string, alias?: string): SelectQueryBuilder<T>;
    static addDateRange<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, dateField: string, startDate?: Date, endDate?: Date, alias?: string): SelectQueryBuilder<T>;
    static addInCondition<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, field: string, values: any[], alias?: string): SelectQueryBuilder<T>;
    static addStatusFilter<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, statusField: string, status?: number | string, alias?: string): SelectQueryBuilder<T>;
    static addIndexHint<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, indexName: string): SelectQueryBuilder<T>;
    static getPaginationInfo(total: number, page: number, limit: number): {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOptimizer = void 0;
class QueryOptimizer {
    static addPagination(queryBuilder, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return queryBuilder.skip(skip).take(limit);
    }
    static addSorting(queryBuilder, sortField, sortOrder = 'DESC') {
        return queryBuilder.orderBy(sortField, sortOrder);
    }
    static addMultipleSorting(queryBuilder, sortOptions) {
        sortOptions.forEach((option, index) => {
            if (index === 0) {
                queryBuilder.orderBy(option.field, option.order);
            }
            else {
                queryBuilder.addOrderBy(option.field, option.order);
            }
        });
        return queryBuilder;
    }
    static addSearch(queryBuilder, searchFields, searchTerm, alias = 'entity') {
        if (!searchTerm || searchFields.length === 0) {
            return queryBuilder;
        }
        const searchConditions = searchFields
            .map((field, index) => `${alias}.${field} LIKE :searchTerm${index}`)
            .join(' OR ');
        const parameters = {};
        searchFields.forEach((_, index) => {
            parameters[`searchTerm${index}`] = `%${searchTerm}%`;
        });
        return queryBuilder.andWhere(`(${searchConditions})`, parameters);
    }
    static addDateRange(queryBuilder, dateField, startDate, endDate, alias = 'entity') {
        if (startDate) {
            queryBuilder.andWhere(`${alias}.${dateField} >= :startDate`, { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere(`${alias}.${dateField} <= :endDate`, { endDate });
        }
        return queryBuilder;
    }
    static addInCondition(queryBuilder, field, values, alias = 'entity') {
        if (values && values.length > 0) {
            queryBuilder.andWhere(`${alias}.${field} IN (:...${field}Values)`, {
                [`${field}Values`]: values,
            });
        }
        return queryBuilder;
    }
    static addStatusFilter(queryBuilder, statusField, status, alias = 'entity') {
        if (status !== undefined && status !== null) {
            queryBuilder.andWhere(`${alias}.${statusField} = :status`, { status });
        }
        return queryBuilder;
    }
    static addIndexHint(queryBuilder, indexName) {
        return queryBuilder.addSelect(`/*+ USE INDEX (${indexName}) */`);
    }
    static getPaginationInfo(total, page, limit) {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        return {
            total,
            page,
            limit,
            totalPages,
            hasNext,
            hasPrev,
        };
    }
}
exports.QueryOptimizer = QueryOptimizer;
//# sourceMappingURL=query-optimizer.util.js.map
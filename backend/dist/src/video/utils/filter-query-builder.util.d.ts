import { SelectQueryBuilder } from 'typeorm';
export declare class FilterQueryBuilderUtil {
    static applySorting(qb: SelectQueryBuilder<any>, sortType: number): void;
    static applyChannel(qb: SelectQueryBuilder<any>, channelId?: string): void;
    static applyType(qb: SelectQueryBuilder<any>, optionId: number): void;
    static applyRegion(qb: SelectQueryBuilder<any>, optionId: number): void;
    static applyLanguage(qb: SelectQueryBuilder<any>, optionId: number): void;
    static applyYear(qb: SelectQueryBuilder<any>, optionId: number): void;
    static applyStatus(qb: SelectQueryBuilder<any>, optionId: number): void;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterQueryBuilderUtil = void 0;
class FilterQueryBuilderUtil {
    static applySorting(qb, sortType) {
        switch (sortType) {
            case 1:
                qb.orderBy('series.createdAt', 'DESC');
                break;
            case 2:
                qb.orderBy('series.playCount', 'DESC');
                break;
            case 3:
                qb.orderBy('series.score', 'DESC');
                break;
            default:
                qb.orderBy('series.createdAt', 'DESC');
        }
    }
    static applyChannel(qb, channelId) {
        if (channelId && channelId !== '0') {
            const isNumeric = /^\d+$/.test(channelId);
            if (isNumeric) {
                qb.andWhere('category.id = :channelId', { channelId: parseInt(channelId, 10) });
            }
            else {
                qb.andWhere('category.category_id = :categoryId', { categoryId: channelId });
            }
        }
    }
    static applyType(qb, optionId) {
        qb.andWhere('category.id = :typeId', { typeId: optionId });
    }
    static applyRegion(qb, optionId) {
        qb.andWhere('series.region_option_id = :regionId', { regionId: optionId });
    }
    static applyLanguage(qb, optionId) {
        qb.andWhere('series.language_option_id = :languageId', { languageId: optionId });
    }
    static applyYear(qb, optionId) {
        qb.andWhere('series.year_option_id = :yearId', { yearId: optionId });
    }
    static applyStatus(qb, optionId) {
        qb.andWhere('series.status_option_id = :statusId', { statusId: optionId });
    }
}
exports.FilterQueryBuilderUtil = FilterQueryBuilderUtil;
//# sourceMappingURL=filter-query-builder.util.js.map
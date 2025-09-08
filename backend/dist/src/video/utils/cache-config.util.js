"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfig = void 0;
class CacheConfig {
    static TTL = {
        SHORT: 300,
        MEDIUM: 900,
        LONG: 1800,
        EXTENDED: 3600,
        PERMANENT: 86400
    };
    static PREFIX = {
        EPISODE_LIST: 'episode_list',
        EPISODE_DETAIL: 'episode_detail',
        SERIES_DETAIL: 'series_detail',
        SERIES_BY_CATEGORY: 'series_by_category',
        HOME_VIDEOS: 'home_videos',
        CATEGORIES: 'categories',
        FILTER_TAGS: 'filter_tags',
        FILTER_DATA: 'filter_data',
        FUZZY_SEARCH: 'fuzzy_search',
        BANNERS: 'banners'
    };
    static STRATEGY = {
        EPISODE_LIST: {
            PUBLIC: CacheConfig.TTL.LONG,
            USER: CacheConfig.TTL.SHORT
        },
        SERIES_DETAIL: {
            TTL: CacheConfig.TTL.MEDIUM
        },
        HOME_VIDEOS: {
            TTL: CacheConfig.TTL.SHORT
        },
        CATEGORIES: {
            TTL: CacheConfig.TTL.EXTENDED
        },
        FILTER_DATA: {
            TTL: CacheConfig.TTL.MEDIUM
        },
    };
    static generateKey(prefix, ...params) {
        return `${prefix}:${params.join(':')}`;
    }
    static episodeListKey(seriesIdentifier, isShortId, page, size, userId) {
        const identifier = seriesIdentifier || 'all';
        const idType = isShortId ? 'shortId' : 'id';
        const user = userId || 'public';
        return this.generateKey(this.PREFIX.EPISODE_LIST, identifier, idType, page, size, user);
    }
    static seriesDetailKey(seriesId) {
        return this.generateKey(this.PREFIX.SERIES_DETAIL, seriesId);
    }
    static seriesByCategoryKey(categoryId) {
        return this.generateKey(this.PREFIX.SERIES_BY_CATEGORY, categoryId);
    }
    static homeVideosKey(channeid, page = 1) {
        const channel = channeid || 'all';
        return this.generateKey(this.PREFIX.HOME_VIDEOS, channel, page);
    }
    static categoriesKey() {
        return this.generateKey(this.PREFIX.CATEGORIES, 'all');
    }
    static getTTL(type, subType) {
        const strategy = this.STRATEGY[type];
        if (subType && strategy[subType]) {
            return strategy[subType];
        }
        if (typeof strategy === 'object') {
            if ('TTL' in strategy && typeof strategy.TTL === 'number') {
                return strategy.TTL;
            }
            if ('PUBLIC' in strategy && 'USER' in strategy) {
                return this.TTL.MEDIUM;
            }
        }
        return this.TTL.MEDIUM;
    }
}
exports.CacheConfig = CacheConfig;
//# sourceMappingURL=cache-config.util.js.map
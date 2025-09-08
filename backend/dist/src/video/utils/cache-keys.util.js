"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKeys = void 0;
class CacheKeys {
    static PREFIX = {
        HOME: 'home',
        FILTER: 'filter',
        VIDEO: 'video',
        CATEGORY: 'category',
        TAG: 'tag',
        SERIES: 'series'
    };
    static TTL = {
        SHORT: 300,
        MEDIUM: 1800,
        LONG: 3600,
        VERY_LONG: 86400
    };
    static homeVideos(categoryId, page) {
        return `${this.PREFIX.HOME}_videos_${categoryId}_${page}`;
    }
    static filterData(channelId, ids, page) {
        return `${this.PREFIX.FILTER}_data_${channelId}_${ids}_${page}`;
    }
    static filterTags(channelId) {
        return `${this.PREFIX.FILTER}_tags_${channelId}`;
    }
    static videoDetails(videoId) {
        return `${this.PREFIX.VIDEO}_details_${videoId}`;
    }
    static categories() {
        return `${this.PREFIX.CATEGORY}_list`;
    }
    static tags() {
        return `${this.PREFIX.TAG}_list`;
    }
    static seriesDetail(seriesId) {
        return `${this.PREFIX.SERIES}_detail_${seriesId}`;
    }
    static moduleVideos(moduleType, categoryId, page) {
        return `${moduleType}_videos_${categoryId}_${page}`;
    }
    static topSeries(limit) {
        return `${this.PREFIX.SERIES}_top_${limit}`;
    }
    static getPatternKeys(pattern) {
        const patterns = {
            'home_all': [`${this.PREFIX.HOME}_videos_*`],
            'filter_all': [`${this.PREFIX.FILTER}_*`],
            'video_all': [`${this.PREFIX.VIDEO}_*`],
            'category_all': [`${this.PREFIX.CATEGORY}_*`],
            'tag_all': [`${this.PREFIX.TAG}_*`],
            'series_all': [`${this.PREFIX.SERIES}_*`]
        };
        return patterns[pattern] || [];
    }
    static getAllPatterns() {
        return [
            `${this.PREFIX.HOME}_*`,
            `${this.PREFIX.FILTER}_*`,
            `${this.PREFIX.VIDEO}_*`,
            `${this.PREFIX.CATEGORY}_*`,
            `${this.PREFIX.TAG}_*`,
            `${this.PREFIX.SERIES}_*`
        ];
    }
    static getKeyPattern(pattern) {
        return `${pattern}*`;
    }
    static getAllHomeVideosPattern() {
        return this.getKeyPattern(`${this.PREFIX.HOME}_videos`);
    }
    static getAllFilterPattern() {
        return this.getKeyPattern(`${this.PREFIX.FILTER}`);
    }
    static getAllVideoDetailsPattern() {
        return this.getKeyPattern(`${this.PREFIX.VIDEO}_details`);
    }
    static getAllCategoriesPattern() {
        return this.getKeyPattern(`${this.PREFIX.CATEGORY}`);
    }
    static getAllTagsPattern() {
        return this.getKeyPattern(`${this.PREFIX.TAG}`);
    }
    static getAllSeriesPattern() {
        return this.getKeyPattern(`${this.PREFIX.SERIES}`);
    }
    static withTimestamp(key) {
        const timestamp = Math.floor(Date.now() / 1000);
        return `${key}_${timestamp}`;
    }
    static userRelated(userId, key) {
        return `user_${userId}_${key}`;
    }
    static temporary(key) {
        return `temp_${key}`;
    }
}
exports.CacheKeys = CacheKeys;
//# sourceMappingURL=cache-keys.util.js.map
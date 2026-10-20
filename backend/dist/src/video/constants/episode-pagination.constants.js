"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_GLOBAL_EPISODES_PAGE_SIZE = exports.MAX_SERIES_EPISODES_PAGE_SIZE = void 0;
exports.resolveEpisodePageSizeLimit = resolveEpisodePageSizeLimit;
exports.MAX_SERIES_EPISODES_PAGE_SIZE = 1000;
exports.MAX_GLOBAL_EPISODES_PAGE_SIZE = 200;
function resolveEpisodePageSizeLimit(hasSeries) {
    return hasSeries ? exports.MAX_SERIES_EPISODES_PAGE_SIZE : exports.MAX_GLOBAL_EPISODES_PAGE_SIZE;
}
//# sourceMappingURL=episode-pagination.constants.js.map
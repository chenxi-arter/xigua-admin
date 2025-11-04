"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const category_entity_1 = require("../entity/category.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const banner_entity_1 = require("../entity/banner.entity");
const banner_metric_daily_entity_1 = require("../entity/banner-metric-daily.entity");
const browse_history_entity_1 = require("../entity/browse-history.entity");
const series_service_1 = require("../services/series.service");
const episode_service_1 = require("../services/episode.service");
const browse_history_service_1 = require("../services/browse-history.service");
const watch_progress_service_1 = require("../services/watch-progress.service");
const banner_service_1 = require("../services/banner.service");
const comment_service_1 = require("../services/comment.service");
const fake_comment_service_1 = require("../services/fake-comment.service");
const catalog_module_1 = require("./catalog.module");
let SeriesModule = class SeriesModule {
};
exports.SeriesModule = SeriesModule;
exports.SeriesModule = SeriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            catalog_module_1.CatalogModule,
            typeorm_1.TypeOrmModule.forFeature([series_entity_1.Series, episode_entity_1.Episode, episode_url_entity_1.EpisodeUrl, category_entity_1.Category, filter_option_entity_1.FilterOption, browse_history_entity_1.BrowseHistory, banner_entity_1.Banner, banner_metric_daily_entity_1.BannerMetricDaily])
        ],
        providers: [
            series_service_1.SeriesService,
            episode_service_1.EpisodeService,
            browse_history_service_1.BrowseHistoryService,
            watch_progress_service_1.WatchProgressService,
            banner_service_1.BannerService,
            fake_comment_service_1.FakeCommentService,
            comment_service_1.CommentService,
        ],
        exports: [series_service_1.SeriesService, episode_service_1.EpisodeService, comment_service_1.CommentService, typeorm_1.TypeOrmModule],
    })
], SeriesModule);
//# sourceMappingURL=series.module.js.map
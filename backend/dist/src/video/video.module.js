"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cache_module_1 = require("../cache/cache.module");
const series_entity_1 = require("./entity/series.entity");
const episode_entity_1 = require("./entity/episode.entity");
const episode_url_entity_1 = require("./entity/episode-url.entity");
const comment_entity_1 = require("./entity/comment.entity");
const watch_progress_entity_1 = require("./entity/watch-progress.entity");
const browse_history_entity_1 = require("./entity/browse-history.entity");
const category_entity_1 = require("./entity/category.entity");
const short_video_entity_1 = require("./entity/short-video.entity");
const banner_entity_1 = require("./entity/banner.entity");
const user_entity_1 = require("../user/entity/user.entity");
const filter_type_entity_1 = require("./entity/filter-type.entity");
const filter_option_entity_1 = require("./entity/filter-option.entity");
const series_genre_option_entity_1 = require("./entity/series-genre-option.entity");
const video_service_1 = require("./video.service");
const cache_monitor_controller_1 = require("./cache-monitor.controller");
const video_api_module_1 = require("./modules/video-api.module");
const watch_progress_service_1 = require("./services/watch-progress.service");
const comment_service_1 = require("./services/comment.service");
const episode_service_1 = require("./services/episode.service");
const category_service_1 = require("./services/category.service");
const filter_service_1 = require("./services/filter.service");
const series_service_1 = require("./services/series.service");
const browse_history_service_1 = require("./services/browse-history.service");
const browse_history_cleanup_service_1 = require("./services/browse-history-cleanup.service");
const playback_service_1 = require("./services/playback.service");
const content_service_1 = require("./services/content.service");
const home_service_1 = require("./services/home.service");
const media_service_1 = require("./services/media.service");
const url_service_1 = require("./services/url.service");
const app_logger_service_1 = require("../common/logger/app-logger.service");
const app_config_service_1 = require("../common/config/app-config.service");
const catalog_module_1 = require("./modules/catalog.module");
const series_module_1 = require("./modules/series.module");
const episode_module_1 = require("./modules/episode.module");
const banner_module_1 = require("./modules/banner.module");
const history_module_1 = require("./modules/history.module");
const channel_exists_validator_1 = require("./validators/channel-exists.validator");
const ingest_service_1 = require("./services/ingest.service");
const ingest_controller_1 = require("./controllers/ingest.controller");
const test_ingest_controller_1 = require("./controllers/test-ingest.controller");
const play_count_service_1 = require("./services/play-count.service");
let VideoModule = class VideoModule {
};
exports.VideoModule = VideoModule;
exports.VideoModule = VideoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_module_1.RedisCacheModule,
            catalog_module_1.CatalogModule,
            series_module_1.SeriesModule,
            episode_module_1.EpisodeModule,
            banner_module_1.BannerModule,
            history_module_1.HistoryModule,
            typeorm_1.TypeOrmModule.forFeature([
                series_entity_1.Series,
                episode_entity_1.Episode,
                episode_url_entity_1.EpisodeUrl,
                comment_entity_1.Comment,
                watch_progress_entity_1.WatchProgress,
                category_entity_1.Category,
                short_video_entity_1.ShortVideo,
                banner_entity_1.Banner,
                user_entity_1.User,
                filter_type_entity_1.FilterType,
                filter_option_entity_1.FilterOption,
                series_genre_option_entity_1.SeriesGenreOption,
                browse_history_entity_1.BrowseHistory
            ]),
            video_api_module_1.VideoApiModule
        ],
        providers: [
            video_service_1.VideoService,
            playback_service_1.PlaybackService,
            content_service_1.ContentService,
            home_service_1.HomeService,
            media_service_1.MediaService,
            url_service_1.UrlService,
            play_count_service_1.PlayCountService,
            watch_progress_service_1.WatchProgressService,
            comment_service_1.CommentService,
            episode_service_1.EpisodeService,
            category_service_1.CategoryService,
            ingest_service_1.IngestService,
            filter_service_1.FilterService,
            series_service_1.SeriesService,
            browse_history_service_1.BrowseHistoryService,
            browse_history_cleanup_service_1.BrowseHistoryCleanupService,
            app_logger_service_1.AppLoggerService,
            app_config_service_1.AppConfigService,
            channel_exists_validator_1.IsValidChannelExistsConstraint,
        ],
        controllers: [
            cache_monitor_controller_1.CacheMonitorController,
            ingest_controller_1.IngestController,
            test_ingest_controller_1.TestIngestController
        ],
    })
], VideoModule);
//# sourceMappingURL=video.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoApiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const video_controller_1 = require("../video.controller");
const public_video_controller_1 = require("../public-video.controller");
const browse_history_controller_1 = require("../browse-history.controller");
const home_controller_1 = require("../home.controller");
const list_controller_1 = require("../list.controller");
const category_controller_1 = require("../category.controller");
const banner_controller_1 = require("../controllers/banner.controller");
const video_service_1 = require("../video.service");
const comment_service_1 = require("../services/comment.service");
const catalog_module_1 = require("./catalog.module");
const series_module_1 = require("./series.module");
const episode_module_1 = require("./episode.module");
const banner_module_1 = require("./banner.module");
const history_module_1 = require("./history.module");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const comment_entity_1 = require("../entity/comment.entity");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const category_entity_1 = require("../entity/category.entity");
const short_video_entity_1 = require("../entity/short-video.entity");
const banner_entity_1 = require("../entity/banner.entity");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const browse_history_entity_1 = require("../entity/browse-history.entity");
let VideoApiModule = class VideoApiModule {
};
exports.VideoApiModule = VideoApiModule;
exports.VideoApiModule = VideoApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            catalog_module_1.CatalogModule,
            series_module_1.SeriesModule,
            episode_module_1.EpisodeModule,
            banner_module_1.BannerModule,
            history_module_1.HistoryModule,
            typeorm_1.TypeOrmModule.forFeature([
                series_entity_1.Series, episode_entity_1.Episode, episode_url_entity_1.EpisodeUrl, comment_entity_1.Comment, watch_progress_entity_1.WatchProgress, category_entity_1.Category, short_video_entity_1.ShortVideo, banner_entity_1.Banner, filter_type_entity_1.FilterType, filter_option_entity_1.FilterOption, browse_history_entity_1.BrowseHistory
            ])
        ],
        controllers: [
            public_video_controller_1.PublicVideoController,
            video_controller_1.VideoController,
            home_controller_1.HomeController,
            list_controller_1.ListController,
            category_controller_1.CategoryController,
            banner_controller_1.BannerController,
            browse_history_controller_1.BrowseHistoryController,
        ],
        providers: [video_service_1.VideoService, comment_service_1.CommentService],
        exports: [],
    })
], VideoApiModule);
//# sourceMappingURL=video-api.module.js.map
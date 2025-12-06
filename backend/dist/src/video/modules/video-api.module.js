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
const home_controller_1 = require("../home.controller");
const list_controller_1 = require("../list.controller");
const category_controller_1 = require("../category.controller");
const banner_controller_1 = require("../controllers/banner.controller");
const progress_controller_1 = require("../controllers/progress.controller");
const comment_controller_1 = require("../controllers/comment.controller");
const comment_like_controller_1 = require("../controllers/comment-like.controller");
const url_controller_1 = require("../controllers/url.controller");
const content_controller_1 = require("../controllers/content.controller");
const interaction_controller_1 = require("../controllers/interaction.controller");
const comments_controller_1 = require("../controllers/comments.controller");
const compat_browse_history_controller_1 = require("../controllers/compat-browse-history.controller");
const recommend_controller_1 = require("../controllers/recommend.controller");
const notification_controller_1 = require("../controllers/notification.controller");
const video_service_1 = require("../video.service");
const comment_service_1 = require("../services/comment.service");
const comment_like_service_1 = require("../services/comment-like.service");
const fake_comment_service_1 = require("../services/fake-comment.service");
const notification_service_1 = require("../services/notification.service");
const playback_service_1 = require("../services/playback.service");
const content_service_1 = require("../services/content.service");
const home_service_1 = require("../services/home.service");
const media_service_1 = require("../services/media.service");
const url_service_1 = require("../services/url.service");
const filter_service_1 = require("../services/filter.service");
const series_service_1 = require("../services/series.service");
const episode_service_1 = require("../services/episode.service");
const watch_progress_service_1 = require("../services/watch-progress.service");
const banner_service_1 = require("../services/banner.service");
const category_service_1 = require("../services/category.service");
const ingest_service_1 = require("../services/ingest.service");
const recommend_service_1 = require("../services/recommend.service");
const app_logger_service_1 = require("../../common/logger/app-logger.service");
const app_config_service_1 = require("../../common/config/app-config.service");
const play_count_service_1 = require("../services/play-count.service");
const episode_interaction_service_1 = require("../services/episode-interaction.service");
const category_validator_1 = require("../../common/validators/category-validator");
const catalog_module_1 = require("./catalog.module");
const series_module_1 = require("./series.module");
const episode_module_1 = require("./episode.module");
const banner_module_1 = require("./banner.module");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const episode_reaction_entity_1 = require("../entity/episode-reaction.entity");
const comment_entity_1 = require("../entity/comment.entity");
const comment_like_entity_1 = require("../entity/comment-like.entity");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const category_entity_1 = require("../entity/category.entity");
const short_video_entity_1 = require("../entity/short-video.entity");
const banner_entity_1 = require("../entity/banner.entity");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const series_genre_option_entity_1 = require("../entity/series-genre-option.entity");
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
            typeorm_1.TypeOrmModule.forFeature([
                series_entity_1.Series, episode_entity_1.Episode, episode_url_entity_1.EpisodeUrl, episode_reaction_entity_1.EpisodeReaction, comment_entity_1.Comment, comment_like_entity_1.CommentLike, watch_progress_entity_1.WatchProgress, category_entity_1.Category, short_video_entity_1.ShortVideo, banner_entity_1.Banner, filter_type_entity_1.FilterType, filter_option_entity_1.FilterOption,
                series_genre_option_entity_1.SeriesGenreOption
            ]),
            (0, common_1.forwardRef)(() => Promise.resolve().then(() => require('../../user/user.module')).then(m => m.UserModule)),
        ],
        controllers: [
            public_video_controller_1.PublicVideoController,
            video_controller_1.VideoController,
            home_controller_1.HomeController,
            list_controller_1.ListController,
            category_controller_1.CategoryController,
            banner_controller_1.BannerController,
            compat_browse_history_controller_1.CompatBrowseHistoryController,
            progress_controller_1.ProgressController,
            comment_controller_1.CommentController,
            comment_like_controller_1.CommentLikeController,
            url_controller_1.UrlController,
            content_controller_1.ContentController,
            interaction_controller_1.InteractionController,
            comments_controller_1.CommentsController,
            recommend_controller_1.RecommendController,
            notification_controller_1.NotificationController,
        ],
        providers: [
            video_service_1.VideoService,
            playback_service_1.PlaybackService,
            content_service_1.ContentService,
            home_service_1.HomeService,
            media_service_1.MediaService,
            url_service_1.UrlService,
            play_count_service_1.PlayCountService,
            episode_interaction_service_1.EpisodeInteractionService,
            filter_service_1.FilterService,
            series_service_1.SeriesService,
            episode_service_1.EpisodeService,
            watch_progress_service_1.WatchProgressService,
            banner_service_1.BannerService,
            category_service_1.CategoryService,
            category_validator_1.CategoryValidator,
            ingest_service_1.IngestService,
            fake_comment_service_1.FakeCommentService,
            comment_service_1.CommentService,
            comment_like_service_1.CommentLikeService,
            notification_service_1.NotificationService,
            recommend_service_1.RecommendService,
            app_logger_service_1.AppLoggerService,
            app_config_service_1.AppConfigService,
        ],
        exports: [],
    })
], VideoApiModule);
//# sourceMappingURL=video-api.module.js.map
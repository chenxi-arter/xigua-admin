"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const banner_entity_1 = require("../video/entity/banner.entity");
const category_entity_1 = require("../video/entity/category.entity");
const series_entity_1 = require("../video/entity/series.entity");
const episode_entity_1 = require("../video/entity/episode.entity");
const episode_url_entity_1 = require("../video/entity/episode-url.entity");
const refresh_token_entity_1 = require("../auth/entity/refresh-token.entity");
const comment_entity_1 = require("../video/entity/comment.entity");
const watch_progress_entity_1 = require("../video/entity/watch-progress.entity");
const browse_history_entity_1 = require("../video/entity/browse-history.entity");
const controllers_1 = require("./controllers");
const admin_categories_controller_1 = require("./controllers/admin-categories.controller");
const ingest_controller_1 = require("./controllers/ingest.controller");
const test_ingest_controller_1 = require("./controllers/test-ingest.controller");
const admin_series_controller_1 = require("./controllers/admin-series.controller");
const admin_dashboard_controller_1 = require("./controllers/admin-dashboard.controller");
const video_module_1 = require("../video/video.module");
const core_module_1 = require("../core/core.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            video_module_1.VideoModule,
            core_module_1.CoreModule,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                banner_entity_1.Banner,
                series_entity_1.Series,
                episode_entity_1.Episode,
                episode_url_entity_1.EpisodeUrl,
                refresh_token_entity_1.RefreshToken,
                comment_entity_1.Comment,
                watch_progress_entity_1.WatchProgress,
                browse_history_entity_1.BrowseHistory,
                category_entity_1.Category,
            ])
        ],
        controllers: [
            controllers_1.AdminUsersController,
            controllers_1.AdminBannersController,
            admin_categories_controller_1.AdminCategoriesController,
            controllers_1.AdminEpisodesController,
            admin_series_controller_1.AdminSeriesController,
            admin_dashboard_controller_1.AdminDashboardController,
            ingest_controller_1.IngestController,
            test_ingest_controller_1.TestIngestController,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map
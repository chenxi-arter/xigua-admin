"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const refresh_token_entity_1 = require("../../auth/entity/refresh-token.entity");
const series_entity_1 = require("../../video/entity/series.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
const episode_url_entity_1 = require("../../video/entity/episode-url.entity");
const comment_entity_1 = require("../../video/entity/comment.entity");
const watch_progress_entity_1 = require("../../video/entity/watch-progress.entity");
const category_entity_1 = require("../../video/entity/category.entity");
const short_video_entity_1 = require("../../video/entity/short-video.entity");
let EntitiesModule = class EntitiesModule {
    constructor() {
        console.log('📦 All entities registered globally');
    }
};
exports.EntitiesModule = EntitiesModule;
exports.EntitiesModule = EntitiesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                refresh_token_entity_1.RefreshToken,
                series_entity_1.Series,
                episode_entity_1.Episode,
                episode_url_entity_1.EpisodeUrl,
                comment_entity_1.Comment,
                watch_progress_entity_1.WatchProgress,
                category_entity_1.Category,
                short_video_entity_1.ShortVideo,
            ])
        ],
        exports: [typeorm_1.TypeOrmModule]
    }),
    __metadata("design:paramtypes", [])
], EntitiesModule);
//# sourceMappingURL=entities.module.js.map
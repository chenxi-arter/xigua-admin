"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const series_entity_1 = require("../entity/series.entity");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const watch_log_entity_1 = require("../entity/watch-log.entity");
const episode_service_1 = require("../services/episode.service");
const watch_progress_service_1 = require("../services/watch-progress.service");
const dau_service_1 = require("../../admin/services/dau.service");
let EpisodeModule = class EpisodeModule {
};
exports.EpisodeModule = EpisodeModule;
exports.EpisodeModule = EpisodeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([episode_entity_1.Episode, episode_url_entity_1.EpisodeUrl, series_entity_1.Series, watch_progress_entity_1.WatchProgress, watch_log_entity_1.WatchLog])],
        providers: [episode_service_1.EpisodeService, watch_progress_service_1.WatchProgressService, dau_service_1.DauService],
        exports: [episode_service_1.EpisodeService, watch_progress_service_1.WatchProgressService, typeorm_1.TypeOrmModule],
    })
], EpisodeModule);
//# sourceMappingURL=episode.module.js.map
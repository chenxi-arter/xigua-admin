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
exports.WatchProgress = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_entity_1 = require("./episode.entity");
let WatchProgress = class WatchProgress {
    userId;
    episodeId;
    stopAtSecond;
    updatedAt;
    user;
    episode;
};
exports.WatchProgress = WatchProgress;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], WatchProgress.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'episode_id' }),
    __metadata("design:type", Number)
], WatchProgress.prototype, "episodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'stop_at_second' }),
    __metadata("design:type", Number)
], WatchProgress.prototype, "stopAtSecond", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], WatchProgress.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, u => u.watchProgresses),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WatchProgress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => episode_entity_1.Episode, ep => ep.watchProgresses),
    (0, typeorm_1.JoinColumn)({ name: 'episode_id' }),
    __metadata("design:type", episode_entity_1.Episode)
], WatchProgress.prototype, "episode", void 0);
exports.WatchProgress = WatchProgress = __decorate([
    (0, typeorm_1.Entity)('watch_progress')
], WatchProgress);
//# sourceMappingURL=watch-progress.entity.js.map
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
exports.Episode = void 0;
const typeorm_1 = require("typeorm");
const series_entity_1 = require("./series.entity");
const episode_url_entity_1 = require("./episode-url.entity");
const watch_progress_entity_1 = require("./watch-progress.entity");
const short_id_util_1 = require("../../common/utils/short-id.util");
const access_key_util_1 = require("../../common/utils/access-key.util");
let Episode = class Episode {
    id;
    shortId;
    accessKey;
    seriesId;
    episodeNumber;
    title;
    duration;
    status;
    isVertical;
    series;
    urls;
    watchProgresses;
    playCount;
    likeCount;
    dislikeCount;
    favoriteCount;
    createdAt;
    updatedAt;
    hasSequel;
    generateShortId() {
        if (!this.shortId) {
            this.shortId = short_id_util_1.ShortIdUtil.generate();
        }
        if (!this.accessKey) {
            this.accessKey = access_key_util_1.AccessKeyUtil.generateAccessKey(32);
        }
    }
};
exports.Episode = Episode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Episode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 11, unique: true, nullable: true, name: 'short_id' }),
    __metadata("design:type", String)
], Episode.prototype, "shortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, unique: true, nullable: true, name: 'access_key' }),
    __metadata("design:type", String)
], Episode.prototype, "accessKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'series_id' }),
    __metadata("design:type", Number)
], Episode.prototype, "seriesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'episode_number' }),
    __metadata("design:type", Number)
], Episode.prototype, "episodeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'title' }),
    __metadata("design:type", String)
], Episode.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'duration' }),
    __metadata("design:type", Number)
], Episode.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'published', name: 'status' }),
    __metadata("design:type", String)
], Episode.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_vertical' }),
    __metadata("design:type", Boolean)
], Episode.prototype, "isVertical", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => series_entity_1.Series, s => s.episodes),
    (0, typeorm_1.JoinColumn)({ name: 'series_id' }),
    __metadata("design:type", series_entity_1.Series)
], Episode.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => episode_url_entity_1.EpisodeUrl, url => url.episode, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Episode.prototype, "urls", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => watch_progress_entity_1.WatchProgress, wp => wp.episode, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Episode.prototype, "watchProgresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'play_count' }),
    __metadata("design:type", Number)
], Episode.prototype, "playCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'like_count' }),
    __metadata("design:type", Number)
], Episode.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'dislike_count' }),
    __metadata("design:type", Number)
], Episode.prototype, "dislikeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'favorite_count' }),
    __metadata("design:type", Number)
], Episode.prototype, "favoriteCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Episode.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Episode.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'has_sequel' }),
    __metadata("design:type", Boolean)
], Episode.prototype, "hasSequel", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Episode.prototype, "generateShortId", null);
exports.Episode = Episode = __decorate([
    (0, typeorm_1.Entity)('episodes')
], Episode);
//# sourceMappingURL=episode.entity.js.map
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
exports.EpisodeUrl = void 0;
const typeorm_1 = require("typeorm");
const episode_entity_1 = require("./episode.entity");
const access_key_util_1 = require("../../common/utils/access-key.util");
let EpisodeUrl = class EpisodeUrl {
    id;
    episodeId;
    quality;
    ossUrl;
    cdnUrl;
    originUrl;
    subtitleUrl;
    accessKey;
    createdAt;
    updatedAt;
    episode;
    ensureAccessKey() {
        if (!this.accessKey && this.episodeId && this.quality) {
            this.accessKey = access_key_util_1.AccessKeyUtil.generateDeterministicKey(this.episodeId, this.quality);
        }
    }
};
exports.EpisodeUrl = EpisodeUrl;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], EpisodeUrl.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'episode_id' }),
    __metadata("design:type", Number)
], EpisodeUrl.prototype, "episodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, name: 'quality' }),
    __metadata("design:type", String)
], EpisodeUrl.prototype, "quality", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'oss_url' }),
    __metadata("design:type", String)
], EpisodeUrl.prototype, "ossUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'cdn_url' }),
    __metadata("design:type", String)
], EpisodeUrl.prototype, "cdnUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false, name: 'origin_url' }),
    __metadata("design:type", String)
], EpisodeUrl.prototype, "originUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'subtitle_url' }),
    __metadata("design:type", Object)
], EpisodeUrl.prototype, "subtitleUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, unique: true, name: 'access_key' }),
    __metadata("design:type", String)
], EpisodeUrl.prototype, "accessKey", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], EpisodeUrl.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], EpisodeUrl.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => episode_entity_1.Episode, ep => ep.urls),
    (0, typeorm_1.JoinColumn)({ name: 'episode_id' }),
    __metadata("design:type", episode_entity_1.Episode)
], EpisodeUrl.prototype, "episode", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EpisodeUrl.prototype, "ensureAccessKey", null);
exports.EpisodeUrl = EpisodeUrl = __decorate([
    (0, typeorm_1.Entity)('episode_urls')
], EpisodeUrl);
//# sourceMappingURL=episode-url.entity.js.map
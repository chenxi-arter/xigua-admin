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
exports.ShortVideo = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const short_id_util_1 = require("../../shared/utils/short-id.util");
let ShortVideo = class ShortVideo {
    id;
    shortId;
    title;
    description;
    coverUrl;
    videoUrl;
    duration;
    playCount;
    likeCount;
    platformName;
    categoryId;
    category;
    createdAt;
    generateShortId() {
        if (!this.shortId) {
            this.shortId = short_id_util_1.ShortIdUtil.generate();
        }
    }
};
exports.ShortVideo = ShortVideo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 11, unique: true, nullable: true, name: 'short_id' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "shortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'title' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'cover_url' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "coverUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'video_url' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'duration' }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'play_count' }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "playCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'like_count' }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: '官方平台', name: 'platform_name' }),
    __metadata("design:type", String)
], ShortVideo.prototype, "platformName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, c => c.shortVideos, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], ShortVideo.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ShortVideo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShortVideo.prototype, "generateShortId", null);
exports.ShortVideo = ShortVideo = __decorate([
    (0, typeorm_1.Entity)('short_videos')
], ShortVideo);
//# sourceMappingURL=short-video.entity.js.map
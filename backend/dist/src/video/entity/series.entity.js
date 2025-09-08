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
exports.Series = void 0;
const typeorm_1 = require("typeorm");
const episode_entity_1 = require("./episode.entity");
const category_entity_1 = require("./category.entity");
const short_id_util_1 = require("../../shared/utils/short-id.util");
const filter_option_entity_1 = require("./filter-option.entity");
let Series = class Series {
    id;
    shortId;
    title;
    externalId;
    description;
    coverUrl;
    totalEpisodes;
    createdAt;
    episodes;
    category;
    categoryId;
    score;
    playCount;
    upStatus;
    upCount;
    status;
    starring;
    actor;
    director;
    regionOption;
    regionOptionId;
    languageOption;
    languageOptionId;
    statusOption;
    statusOptionId;
    yearOption;
    yearOptionId;
    releaseDate;
    isCompleted;
    updatedAt;
    isActive;
    deletedAt;
    deletedBy;
    generateShortId() {
        if (!this.shortId) {
            this.shortId = short_id_util_1.ShortIdUtil.generate();
        }
    }
};
exports.Series = Series;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Series.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 11, unique: true, nullable: true, name: 'short_id' }),
    __metadata("design:type", String)
], Series.prototype, "shortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, name: 'title' }),
    __metadata("design:type", String)
], Series.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128, nullable: true, unique: true, name: 'external_id' }),
    __metadata("design:type", Object)
], Series.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", String)
], Series.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true, name: 'cover_url' }),
    __metadata("design:type", String)
], Series.prototype, "coverUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'total_episodes' }),
    __metadata("design:type", Number)
], Series.prototype, "totalEpisodes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Series.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => episode_entity_1.Episode, ep => ep.series),
    __metadata("design:type", Array)
], Series.prototype, "episodes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, c => c.series, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Series.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'category_id' }),
    __metadata("design:type", Number)
], Series.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Series.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'play_count' }),
    __metadata("design:type", Number)
], Series.prototype, "playCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true, name: 'up_status' }),
    __metadata("design:type", String)
], Series.prototype, "upStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'up_count' }),
    __metadata("design:type", Number)
], Series.prototype, "upCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, default: 'on-going', name: 'status' }),
    __metadata("design:type", String)
], Series.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'starring' }),
    __metadata("design:type", String)
], Series.prototype, "starring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'actor' }),
    __metadata("design:type", String)
], Series.prototype, "actor", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true, name: 'director' }),
    __metadata("design:type", String)
], Series.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_option_entity_1.FilterOption, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'region_option_id' }),
    __metadata("design:type", filter_option_entity_1.FilterOption)
], Series.prototype, "regionOption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'region_option_id' }),
    __metadata("design:type", Number)
], Series.prototype, "regionOptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_option_entity_1.FilterOption, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'language_option_id' }),
    __metadata("design:type", filter_option_entity_1.FilterOption)
], Series.prototype, "languageOption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'language_option_id' }),
    __metadata("design:type", Number)
], Series.prototype, "languageOptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_option_entity_1.FilterOption, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'status_option_id' }),
    __metadata("design:type", filter_option_entity_1.FilterOption)
], Series.prototype, "statusOption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'status_option_id' }),
    __metadata("design:type", Number)
], Series.prototype, "statusOptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_option_entity_1.FilterOption, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'year_option_id' }),
    __metadata("design:type", filter_option_entity_1.FilterOption)
], Series.prototype, "yearOption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'year_option_id' }),
    __metadata("design:type", Number)
], Series.prototype, "yearOptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'release_date' }),
    __metadata("design:type", Date)
], Series.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_completed' }),
    __metadata("design:type", Boolean)
], Series.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'updated_at' }),
    __metadata("design:type", Date)
], Series.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 1, default: 1, name: 'is_active' }),
    __metadata("design:type", Number)
], Series.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], Series.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'deleted_by' }),
    __metadata("design:type", Number)
], Series.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Series.prototype, "generateShortId", null);
exports.Series = Series = __decorate([
    (0, typeorm_1.Entity)('series')
], Series);
//# sourceMappingURL=series.entity.js.map
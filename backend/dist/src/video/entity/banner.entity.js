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
exports.Banner = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const series_entity_1 = require("./series.entity");
let Banner = class Banner {
    id;
    title;
    imageUrl;
    seriesId;
    categoryId;
    linkUrl;
    weight;
    isActive;
    startTime;
    endTime;
    description;
    createdAt;
    updatedAt;
    impressions;
    clicks;
    category;
    series;
};
exports.Banner = Banner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Banner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci'
    }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, name: 'image_url' }),
    __metadata("design:type", String)
], Banner.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'series_id' }),
    __metadata("design:type", Number)
], Banner.prototype, "seriesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", Number)
], Banner.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true, name: 'link_url' }),
    __metadata("design:type", String)
], Banner.prototype, "linkUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Banner.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Banner.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'start_time' }),
    __metadata("design:type", Date)
], Banner.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'end_time' }),
    __metadata("design:type", Date)
], Banner.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci'
    }),
    __metadata("design:type", String)
], Banner.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'impressions' }),
    __metadata("design:type", Number)
], Banner.prototype, "impressions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'clicks' }),
    __metadata("design:type", Number)
], Banner.prototype, "clicks", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Banner.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => series_entity_1.Series, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'series_id' }),
    __metadata("design:type", series_entity_1.Series)
], Banner.prototype, "series", void 0);
exports.Banner = Banner = __decorate([
    (0, typeorm_1.Entity)('banners')
], Banner);
//# sourceMappingURL=banner.entity.js.map
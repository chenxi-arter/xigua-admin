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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const series_entity_1 = require("./series.entity");
const short_video_entity_1 = require("./short-video.entity");
let Category = class Category {
    id;
    categoryId;
    name;
    routeName;
    isEnabled;
    createdAt;
    updatedAt;
    series;
    shortVideos;
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, name: 'category_id', unique: true }),
    __metadata("design:type", String)
], Category.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, name: 'name' }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true, name: 'route_name' }),
    __metadata("design:type", String)
], Category.prototype, "routeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_enabled' }),
    __metadata("design:type", Boolean)
], Category.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => series_entity_1.Series, s => s.category),
    __metadata("design:type", Array)
], Category.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => short_video_entity_1.ShortVideo, sv => sv.category),
    __metadata("design:type", Array)
], Category.prototype, "shortVideos", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)('categories')
], Category);
//# sourceMappingURL=category.entity.js.map
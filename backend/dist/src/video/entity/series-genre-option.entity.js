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
exports.SeriesGenreOption = void 0;
const typeorm_1 = require("typeorm");
const series_entity_1 = require("./series.entity");
const filter_option_entity_1 = require("./filter-option.entity");
let SeriesGenreOption = class SeriesGenreOption {
    id;
    seriesId;
    optionId;
    createdAt;
    series;
    option;
};
exports.SeriesGenreOption = SeriesGenreOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], SeriesGenreOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'series_id' }),
    __metadata("design:type", Number)
], SeriesGenreOption.prototype, "seriesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'option_id' }),
    __metadata("design:type", Number)
], SeriesGenreOption.prototype, "optionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SeriesGenreOption.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => series_entity_1.Series, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'series_id' }),
    __metadata("design:type", series_entity_1.Series)
], SeriesGenreOption.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_option_entity_1.FilterOption),
    (0, typeorm_1.JoinColumn)({ name: 'option_id' }),
    __metadata("design:type", filter_option_entity_1.FilterOption)
], SeriesGenreOption.prototype, "option", void 0);
exports.SeriesGenreOption = SeriesGenreOption = __decorate([
    (0, typeorm_1.Unique)('uq_series_option', ['seriesId', 'optionId']),
    (0, typeorm_1.Index)('idx_series', ['seriesId']),
    (0, typeorm_1.Index)('idx_option', ['optionId']),
    (0, typeorm_1.Entity)('series_genre_options')
], SeriesGenreOption);
//# sourceMappingURL=series-genre-option.entity.js.map
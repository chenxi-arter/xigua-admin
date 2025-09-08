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
exports.BrowseHistory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const series_entity_1 = require("./series.entity");
let BrowseHistory = class BrowseHistory {
    id;
    userId;
    seriesId;
    browseType;
    durationSeconds;
    lastEpisodeNumber;
    visitCount;
    userAgent;
    ipAddress;
    createdAt;
    updatedAt;
    user;
    series;
};
exports.BrowseHistory = BrowseHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], BrowseHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], BrowseHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'series_id' }),
    __metadata("design:type", Number)
], BrowseHistory.prototype, "seriesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'episode_list', name: 'browse_type' }),
    __metadata("design:type", String)
], BrowseHistory.prototype, "browseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'duration_seconds' }),
    __metadata("design:type", Number)
], BrowseHistory.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'last_episode_number' }),
    __metadata("design:type", Object)
], BrowseHistory.prototype, "lastEpisodeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1, name: 'visit_count' }),
    __metadata("design:type", Number)
], BrowseHistory.prototype, "visitCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'user_agent' }),
    __metadata("design:type", Object)
], BrowseHistory.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' }),
    __metadata("design:type", Object)
], BrowseHistory.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BrowseHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BrowseHistory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], BrowseHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => series_entity_1.Series),
    (0, typeorm_1.JoinColumn)({ name: 'series_id' }),
    __metadata("design:type", series_entity_1.Series)
], BrowseHistory.prototype, "series", void 0);
exports.BrowseHistory = BrowseHistory = __decorate([
    (0, typeorm_1.Entity)('browse_history')
], BrowseHistory);
//# sourceMappingURL=browse-history.entity.js.map
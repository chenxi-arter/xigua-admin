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
exports.WatchLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_entity_1 = require("./episode.entity");
let WatchLog = class WatchLog {
    id;
    userId;
    episodeId;
    watchDuration;
    startPosition;
    endPosition;
    watchDate;
    createdAt;
    user;
    episode;
};
exports.WatchLog = WatchLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'episode_id' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "episodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'watch_duration' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "watchDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'start_position' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "startPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'end_position' }),
    __metadata("design:type", Number)
], WatchLog.prototype, "endPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'watch_date' }),
    __metadata("design:type", Date)
], WatchLog.prototype, "watchDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WatchLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WatchLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => episode_entity_1.Episode),
    (0, typeorm_1.JoinColumn)({ name: 'episode_id' }),
    __metadata("design:type", episode_entity_1.Episode)
], WatchLog.prototype, "episode", void 0);
exports.WatchLog = WatchLog = __decorate([
    (0, typeorm_1.Entity)('watch_logs'),
    (0, typeorm_1.Index)(['userId', 'watchDate']),
    (0, typeorm_1.Index)(['episodeId', 'watchDate']),
    (0, typeorm_1.Index)(['watchDate'])
], WatchLog);
//# sourceMappingURL=watch-log.entity.js.map
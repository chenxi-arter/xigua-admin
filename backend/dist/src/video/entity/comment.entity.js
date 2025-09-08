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
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_entity_1 = require("./episode.entity");
let Comment = class Comment {
    id;
    userId;
    episodeId;
    content;
    appearSecond;
    createdAt;
    user;
    episode;
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'episode_id' }),
    __metadata("design:type", Number)
], Comment.prototype, "episodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'content' }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'appear_second' }),
    __metadata("design:type", Number)
], Comment.prototype, "appearSecond", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, u => u.comments),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Comment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => episode_entity_1.Episode, ep => ep.comments),
    (0, typeorm_1.JoinColumn)({ name: 'episode_id' }),
    __metadata("design:type", episode_entity_1.Episode)
], Comment.prototype, "episode", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)('comments')
], Comment);
//# sourceMappingURL=comment.entity.js.map
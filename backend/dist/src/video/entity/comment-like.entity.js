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
exports.CommentLike = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entity/user.entity");
const comment_entity_1 = require("./comment.entity");
let CommentLike = class CommentLike {
    id;
    userId;
    commentId;
    isRead;
    createdAt;
    user;
    comment;
};
exports.CommentLike = CommentLike;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], CommentLike.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", Number)
], CommentLike.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment_id', type: 'int' }),
    __metadata("design:type", Number)
], CommentLike.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CommentLike.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CommentLike.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], CommentLike.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comment_entity_1.Comment),
    (0, typeorm_1.JoinColumn)({ name: 'comment_id' }),
    __metadata("design:type", comment_entity_1.Comment)
], CommentLike.prototype, "comment", void 0);
exports.CommentLike = CommentLike = __decorate([
    (0, typeorm_1.Entity)('comment_likes'),
    (0, typeorm_1.Unique)('idx_user_comment', ['userId', 'commentId']),
    (0, typeorm_1.Index)(['commentId']),
    (0, typeorm_1.Index)(['createdAt'])
], CommentLike);
//# sourceMappingURL=comment-like.entity.js.map
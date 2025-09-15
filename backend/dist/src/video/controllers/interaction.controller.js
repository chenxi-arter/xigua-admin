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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionController = void 0;
const common_1 = require("@nestjs/common");
const base_controller_1 = require("../controllers/base.controller");
const episode_interaction_service_1 = require("../services/episode-interaction.service");
class EpisodeReactionDto {
    type;
}
let InteractionController = class InteractionController extends base_controller_1.BaseController {
    interactionService;
    constructor(interactionService) {
        super();
        this.interactionService = interactionService;
    }
    async react(id, dto) {
        if (!dto?.type || !['like', 'dislike', 'favorite'].includes(dto.type)) {
            return this.error('type必须是 like|dislike|favorite', 400);
        }
        await this.interactionService.increment(id, dto.type);
        return this.success({ id, type: dto.type }, '更新成功');
    }
};
exports.InteractionController = InteractionController;
__decorate([
    (0, common_1.Post)(':id/reaction'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EpisodeReactionDto]),
    __metadata("design:returntype", Promise)
], InteractionController.prototype, "react", null);
exports.InteractionController = InteractionController = __decorate([
    (0, common_1.Controller)('video/episode'),
    __metadata("design:paramtypes", [episode_interaction_service_1.EpisodeInteractionService])
], InteractionController);
//# sourceMappingURL=interaction.controller.js.map
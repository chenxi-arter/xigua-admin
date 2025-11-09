"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("./entity/user.entity");
const favorite_entity_1 = require("./entity/favorite.entity");
const episode_entity_1 = require("../video/entity/episode.entity");
const episode_reaction_entity_1 = require("../video/entity/episode-reaction.entity");
const user_service_1 = require("./user.service");
const favorite_service_1 = require("./services/favorite.service");
const liked_episodes_service_1 = require("./services/liked-episodes.service");
const user_controller_1 = require("./user.controller");
const favorite_controller_1 = require("./controllers/favorite.controller");
const liked_episodes_controller_1 = require("./controllers/liked-episodes.controller");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const telegram_auth_service_1 = require("../auth/telegram-auth.service");
const auth_module_1 = require("../auth/auth.module");
const video_module_1 = require("../video/video.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, favorite_entity_1.Favorite, episode_entity_1.Episode, episode_reaction_entity_1.EpisodeReaction]),
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => video_module_1.VideoModule),
        ],
        controllers: [user_controller_1.UserController, favorite_controller_1.FavoriteController, liked_episodes_controller_1.LikedEpisodesController],
        providers: [user_service_1.UserService, favorite_service_1.FavoriteService, liked_episodes_service_1.LikedEpisodesService, jwt_strategy_1.JwtStrategy, telegram_auth_service_1.TelegramAuthService],
        exports: [user_service_1.UserService, favorite_service_1.FavoriteService, liked_episodes_service_1.LikedEpisodesService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map
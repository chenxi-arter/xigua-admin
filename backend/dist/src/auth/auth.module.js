"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const telegram_strategy_1 = require("./strategies/telegram.strategy");
const auth_service_1 = require("./auth.service");
const telegram_auth_service_1 = require("./telegram-auth.service");
const guest_service_1 = require("./guest.service");
const account_merge_service_1 = require("./account-merge.service");
const auth_controller_1 = require("./auth.controller");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
const user_entity_1 = require("../user/entity/user.entity");
const user_online_daily_entity_1 = require("../user/entity/user-online-daily.entity");
const watch_progress_entity_1 = require("../video/entity/watch-progress.entity");
const favorite_entity_1 = require("../user/entity/favorite.entity");
const episode_reaction_entity_1 = require("../video/entity/episode-reaction.entity");
const comment_entity_1 = require("../video/entity/comment.entity");
const comment_like_entity_1 = require("../video/entity/comment-like.entity");
const user_module_1 = require("../user/user.module");
const core_module_1 = require("../core/core.module");
const dau_service_1 = require("../admin/services/dau.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("./guards/optional-jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
            typeorm_1.TypeOrmModule.forFeature([
                refresh_token_entity_1.RefreshToken,
                user_entity_1.User,
                user_online_daily_entity_1.UserOnlineDaily,
                watch_progress_entity_1.WatchProgress,
                favorite_entity_1.Favorite,
                episode_reaction_entity_1.EpisodeReaction,
                comment_entity_1.Comment,
                comment_like_entity_1.CommentLike,
            ]),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            core_module_1.CoreModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '1h'
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            jwt_strategy_1.JwtStrategy,
            telegram_strategy_1.TelegramStrategy,
            auth_service_1.AuthService,
            telegram_auth_service_1.TelegramAuthService,
            guest_service_1.GuestService,
            account_merge_service_1.AccountMergeService,
            dau_service_1.DauService,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_jwt_auth_guard_1.OptionalJwtAuthGuard,
        ],
        exports: [
            passport_1.PassportModule,
            jwt_1.JwtModule,
            auth_service_1.AuthService,
            telegram_auth_service_1.TelegramAuthService,
            guest_service_1.GuestService,
            account_merge_service_1.AccountMergeService,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_jwt_auth_guard_1.OptionalJwtAuthGuard,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
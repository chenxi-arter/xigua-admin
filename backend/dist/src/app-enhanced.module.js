"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnhancedModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const video_module_1 = require("./video/video.module");
const test_module_1 = require("./test/test.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const rate_limit_guard_1 = require("./common/guards/rate-limit.guard");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
let AppEnhancedModule = class AppEnhancedModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.SecurityLoggerMiddleware, logger_middleware_1.LoggerMiddleware, logger_middleware_1.PerformanceMiddleware)
            .forRoutes('*');
    }
};
exports.AppEnhancedModule = AppEnhancedModule;
exports.AppEnhancedModule = AppEnhancedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            video_module_1.VideoModule,
            test_module_1.TestModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useFactory: () => new common_2.ValidationPipe({
                    transform: true,
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    disableErrorMessages: process.env.NODE_ENV === 'production',
                    exceptionFactory: (errors) => {
                        const messages = errors.map(error => {
                            const constraints = error.constraints;
                            if (constraints) {
                                return Object.values(constraints).join(', ');
                            }
                            return `${error.property} 验证失败`;
                        });
                        return {
                            statusCode: 400,
                            message: '请求参数验证失败',
                            errors: messages,
                            error: 'Bad Request',
                        };
                    },
                }),
            },
            rate_limit_guard_1.RateLimitGuard,
        ],
    })
], AppEnhancedModule);
//# sourceMappingURL=app-enhanced.module.js.map
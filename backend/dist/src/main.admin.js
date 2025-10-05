"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_admin_module_1 = require("./app.admin.module");
const date_util_1 = require("./common/utils/date.util");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_admin_module_1.AdminAppModule);
    app.setGlobalPrefix('api');
    app.use((req, _res, next) => {
        const headerOverride = req.header('x-http-method-override');
        const queryOverride = typeof req.query._method === 'string' ? req.query._method : undefined;
        const override = headerOverride || queryOverride;
        if (override) {
            const upper = override.toUpperCase();
            if (upper === 'PUT' || upper === 'DELETE' || upper === 'PATCH') {
                req.method = upper;
            }
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: false,
        forbidNonWhitelisted: false,
        exceptionFactory: (errors) => {
            const details = errors.map((e) => ({
                property: e.property,
                constraints: e.constraints,
                children: e.children?.length ? e.children : undefined,
            }));
            return new common_1.BadRequestException({ message: '参数验证失败', details });
        }
    }));
    app.enableCors({
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-HTTP-Method-Override'],
        optionsSuccessStatus: 204,
    });
    const appTimezone = process.env.APP_TIMEZONE || process.env.DB_TIMEZONE || 'Asia/Shanghai';
    date_util_1.DateUtil.setTimezone(appTimezone);
    const adminPort = Number(process.env.ADMIN_PORT) || 8080;
    await app.listen(adminPort);
}
void bootstrap();
//# sourceMappingURL=main.admin.js.map
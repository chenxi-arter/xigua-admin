"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_client_module_1 = require("./app.client.module");
const date_util_1 = require("./common/utils/date.util");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_client_module_1.ClientAppModule);
    app.setGlobalPrefix('api');
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
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const appTimezone = process.env.APP_TIMEZONE || process.env.DB_TIMEZONE || 'Asia/Shanghai';
    date_util_1.DateUtil.setTimezone(appTimezone);
    const clientPort = Number(process.env.CLIENT_PORT) || 3000;
    await app.listen(clientPort);
}
void bootstrap();
//# sourceMappingURL=main.client.js.map
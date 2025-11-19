"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const date_util_1 = require("./common/utils/date.util");
const legal_constants_1 = require("./common/constants/legal.constants");
async function bootstrap() {
    console.log('\n' + '='.repeat(80));
    console.log('法律免责声明 / Legal Disclaimer');
    console.log('='.repeat(80));
    console.log(legal_constants_1.LEGAL_DISCLAIMER.DEVELOPER_STATEMENT);
    console.log('='.repeat(80) + '\n');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
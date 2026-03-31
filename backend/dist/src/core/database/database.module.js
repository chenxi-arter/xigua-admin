"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("../config/database.config");
const typeorm_2 = require("typeorm");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (databaseConfig) => {
                    return databaseConfig.getTypeOrmConfig();
                },
                inject: [database_config_1.DatabaseConfig],
                dataSourceFactory: async (options) => {
                    const logger = new common_1.Logger('DatabaseModule');
                    const dataSource = new typeorm_2.DataSource(options);
                    await dataSource.initialize();
                    const dbOpts = options;
                    logger.log(`\x1b[36m🗄️  MySQL connected ✔  ${dbOpts.host}:${dbOpts.port}  db=${dbOpts.database}\x1b[0m`);
                    return dataSource;
                },
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map
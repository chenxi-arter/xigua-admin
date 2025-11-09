"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const browse_history_entity_1 = require("../entity/browse-history.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const series_entity_1 = require("../entity/series.entity");
const browse_history_service_1 = require("../services/browse-history.service");
const browse_history_cleanup_service_1 = require("../services/browse-history-cleanup.service");
const browse_history_controller_1 = require("../browse-history.controller");
const category_validator_1 = require("../../common/validators/category-validator");
const category_service_1 = require("../services/category.service");
const category_entity_1 = require("../entity/category.entity");
const app_logger_service_1 = require("../../common/logger/app-logger.service");
const app_config_service_1 = require("../../common/config/app-config.service");
let HistoryModule = class HistoryModule {
};
exports.HistoryModule = HistoryModule;
exports.HistoryModule = HistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([browse_history_entity_1.BrowseHistory, user_entity_1.User, series_entity_1.Series, category_entity_1.Category]),
        ],
        controllers: [browse_history_controller_1.BrowseHistoryController],
        providers: [
            browse_history_service_1.BrowseHistoryService,
            browse_history_cleanup_service_1.BrowseHistoryCleanupService,
            category_service_1.CategoryService,
            category_validator_1.CategoryValidator,
            app_logger_service_1.AppLoggerService,
            app_config_service_1.AppConfigService,
        ],
        exports: [browse_history_service_1.BrowseHistoryService, browse_history_cleanup_service_1.BrowseHistoryCleanupService, typeorm_1.TypeOrmModule],
    })
], HistoryModule);
//# sourceMappingURL=history.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const category_entity_1 = require("../entity/category.entity");
const series_entity_1 = require("../entity/series.entity");
const filter_service_1 = require("../services/filter.service");
const category_service_1 = require("../services/category.service");
const app_logger_service_1 = require("../../common/logger/app-logger.service");
const app_config_service_1 = require("../../common/config/app-config.service");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([filter_type_entity_1.FilterType, filter_option_entity_1.FilterOption, category_entity_1.Category, series_entity_1.Series])],
        providers: [filter_service_1.FilterService, category_service_1.CategoryService, app_logger_service_1.AppLoggerService, app_config_service_1.AppConfigService],
        exports: [filter_service_1.FilterService, category_service_1.CategoryService, typeorm_1.TypeOrmModule],
    })
], CatalogModule);
//# sourceMappingURL=catalog.module.js.map
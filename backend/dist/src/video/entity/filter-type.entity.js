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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterType = void 0;
const typeorm_1 = require("typeorm");
const filter_option_entity_1 = require("./filter-option.entity");
let FilterType = class FilterType {
    id;
    name;
    code;
    indexPosition;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    options;
};
exports.FilterType = FilterType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FilterType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, comment: '筛选器类型名称' }),
    __metadata("design:type", String)
], FilterType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true, comment: '筛选器类型代码' }),
    __metadata("design:type", String)
], FilterType.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'index_position', default: 0, comment: '在筛选器中的位置索引' }),
    __metadata("design:type", Number)
], FilterType.prototype, "indexPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1, comment: '是否启用' }),
    __metadata("design:type", Boolean)
], FilterType.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0, comment: '排序顺序' }),
    __metadata("design:type", Number)
], FilterType.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], FilterType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], FilterType.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => filter_option_entity_1.FilterOption, filterOption => filterOption.filterType),
    __metadata("design:type", Array)
], FilterType.prototype, "options", void 0);
exports.FilterType = FilterType = __decorate([
    (0, typeorm_1.Entity)('filter_types')
], FilterType);
//# sourceMappingURL=filter-type.entity.js.map
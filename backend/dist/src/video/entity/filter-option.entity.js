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
exports.FilterOption = void 0;
const typeorm_1 = require("typeorm");
const filter_type_entity_1 = require("./filter-type.entity");
let FilterOption = class FilterOption {
    id;
    filterTypeId;
    name;
    value;
    isDefault;
    isActive;
    sortOrder;
    createdAt;
    updatedAt;
    filterType;
};
exports.FilterOption = FilterOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FilterOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'filter_type_id', comment: '筛选器类型ID' }),
    __metadata("design:type", Number)
], FilterOption.prototype, "filterTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, comment: '选项名称' }),
    __metadata("design:type", String)
], FilterOption.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, comment: '选项值' }),
    __metadata("design:type", Object)
], FilterOption.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', width: 1, default: 0, comment: '是否默认选中' }),
    __metadata("design:type", Boolean)
], FilterOption.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1, comment: '是否启用' }),
    __metadata("design:type", Boolean)
], FilterOption.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0, comment: '排序顺序' }),
    __metadata("design:type", Number)
], FilterOption.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], FilterOption.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], FilterOption.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => filter_type_entity_1.FilterType, filterType => filterType.options),
    (0, typeorm_1.JoinColumn)({ name: 'filter_type_id' }),
    __metadata("design:type", filter_type_entity_1.FilterType)
], FilterOption.prototype, "filterType", void 0);
exports.FilterOption = FilterOption = __decorate([
    (0, typeorm_1.Entity)('filter_options')
], FilterOption);
//# sourceMappingURL=filter-option.entity.js.map
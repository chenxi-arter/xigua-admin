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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOptionsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const filter_option_entity_1 = require("../../video/entity/filter-option.entity");
let AdminOptionsController = class AdminOptionsController {
    filterOptionRepo;
    constructor(filterOptionRepo) {
        this.filterOptionRepo = filterOptionRepo;
    }
    async debugOptions(type) {
        if (!type) {
            return { error: 'type parameter is required' };
        }
        const options = await this.filterOptionRepo
            .createQueryBuilder('option')
            .innerJoin('option.filterType', 'filterType')
            .where('filterType.code = :typeCode', { typeCode: type })
            .orderBy('option.id', 'ASC')
            .select([
            'option.id',
            'option.name',
            'option.value',
            'option.isActive',
            'option.isDefault',
            'option.sortOrder',
            'filterType.id',
            'filterType.code',
        ])
            .getMany();
        return {
            type,
            total: options.length,
            options: options.map(opt => ({
                id: opt.id,
                name: opt.name,
                value: opt.value,
                isActive: opt.isActive,
                isDefault: opt.isDefault,
                sortOrder: opt.sortOrder,
                filterTypeId: opt.filterType?.id,
                filterTypeCode: opt.filterType?.code,
            })),
        };
    }
    async getOptions(types) {
        if (!types) {
            return {};
        }
        const typeList = types.split(',').map(t => t.trim());
        const result = {};
        for (const typeCode of typeList) {
            const options = await this.filterOptionRepo
                .createQueryBuilder('option')
                .innerJoin('option.filterType', 'filterType')
                .where('filterType.code = :typeCode', { typeCode })
                .andWhere('option.isActive = 1')
                .andWhere('option.isDefault = 0')
                .orderBy('option.sortOrder', 'ASC')
                .select([
                'option.id',
                'option.name',
                'option.value',
                'option.sortOrder',
            ])
                .getMany();
            result[typeCode] = options.map(opt => ({
                id: opt.id,
                name: opt.name,
                value: opt.value,
                sortOrder: opt.sortOrder,
            }));
        }
        return result;
    }
};
exports.AdminOptionsController = AdminOptionsController;
__decorate([
    (0, common_1.Get)('debug'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOptionsController.prototype, "debugOptions", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('types')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOptionsController.prototype, "getOptions", null);
exports.AdminOptionsController = AdminOptionsController = __decorate([
    (0, common_1.Controller)('admin/options'),
    __param(0, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminOptionsController);
//# sourceMappingURL=admin-options.controller.js.map
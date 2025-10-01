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
exports.AdminCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../../video/entity/category.entity");
let AdminCategoriesController = class AdminCategoriesController {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    normalize(raw) {
        const payload = {};
        if (typeof raw.categoryId === 'string')
            payload.categoryId = raw.categoryId;
        if (typeof raw.name === 'string')
            payload.name = raw.name;
        if (typeof raw.routeName === 'string')
            payload.routeName = raw.routeName;
        if (raw.isEnabled !== undefined) {
            payload.isEnabled = raw.isEnabled === true || raw.isEnabled === 'true' || raw.isEnabled === 1 || raw.isEnabled === '1';
        }
        return payload;
    }
    async list(page = 1, size = 20) {
        const take = Math.max(Number(size) || 20, 1);
        const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
        const [items, total] = await this.categoryRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
        return { total, items, page: Number(page) || 1, size: take };
    }
    async create(body) {
        const entity = this.categoryRepo.create(this.normalize(body));
        return this.categoryRepo.save(entity);
    }
    async remove(id) {
        await this.categoryRepo.delete({ id: Number(id) });
        return { success: true };
    }
};
exports.AdminCategoriesController = AdminCategoriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCategoriesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCategoriesController.prototype, "remove", null);
exports.AdminCategoriesController = AdminCategoriesController = __decorate([
    (0, common_1.Controller)('admin/categories'),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminCategoriesController);
//# sourceMappingURL=admin-categories.controller.js.map
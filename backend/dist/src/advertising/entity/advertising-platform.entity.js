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
exports.AdvertisingPlatform = void 0;
const typeorm_1 = require("typeorm");
const advertising_campaign_entity_1 = require("./advertising-campaign.entity");
let AdvertisingPlatform = class AdvertisingPlatform {
    id;
    name;
    code;
    description;
    iconUrl;
    color;
    isEnabled;
    sortOrder;
    config;
    createdBy;
    createdAt;
    updatedAt;
    campaigns;
};
exports.AdvertisingPlatform = AdvertisingPlatform;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], AdvertisingPlatform.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false, comment: '平台名称' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '平台代码（用于生成campaign_code）' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '平台描述' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon_url', type: 'varchar', length: 500, nullable: true, comment: '平台图标URL' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: '#1890ff', comment: '平台主题色' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_enabled', type: 'boolean', default: true, comment: '是否启用' }),
    __metadata("design:type", Boolean)
], AdvertisingPlatform.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0, comment: '排序权重' }),
    __metadata("design:type", Number)
], AdvertisingPlatform.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: '平台特有配置信息' }),
    __metadata("design:type", Object)
], AdvertisingPlatform.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, nullable: true, comment: '创建人' }),
    __metadata("design:type", String)
], AdvertisingPlatform.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], AdvertisingPlatform.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], AdvertisingPlatform.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => advertising_campaign_entity_1.AdvertisingCampaign, campaign => campaign.platform),
    __metadata("design:type", Array)
], AdvertisingPlatform.prototype, "campaigns", void 0);
exports.AdvertisingPlatform = AdvertisingPlatform = __decorate([
    (0, typeorm_1.Entity)('advertising_platforms'),
    (0, typeorm_1.Index)(['code']),
    (0, typeorm_1.Index)(['isEnabled']),
    (0, typeorm_1.Index)(['sortOrder']),
    (0, typeorm_1.Index)(['createdAt'])
], AdvertisingPlatform);
//# sourceMappingURL=advertising-platform.entity.js.map
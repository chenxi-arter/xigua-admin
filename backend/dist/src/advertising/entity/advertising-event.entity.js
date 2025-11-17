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
exports.AdvertisingEvent = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const advertising_campaign_entity_1 = require("./advertising-campaign.entity");
var EventType;
(function (EventType) {
    EventType["CLICK"] = "click";
    EventType["VIEW"] = "view";
    EventType["REGISTER"] = "register";
    EventType["LOGIN"] = "login";
    EventType["PLAY"] = "play";
    EventType["SHARE"] = "share";
})(EventType || (exports.EventType = EventType = {}));
let AdvertisingEvent = class AdvertisingEvent {
    id;
    campaignId;
    campaignCode;
    eventType;
    eventData;
    userId;
    sessionId;
    deviceId;
    referrer;
    userAgent;
    ipAddress;
    country;
    region;
    city;
    eventTime;
    createdAt;
    campaign;
};
exports.AdvertisingEvent = AdvertisingEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], AdvertisingEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_id', type: 'bigint', nullable: false, comment: '投放计划ID' }),
    __metadata("design:type", Number)
], AdvertisingEvent.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_code', type: 'varchar', length: 50, nullable: false, comment: '计划代码' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "campaignCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'event_type',
        type: 'enum',
        enum: EventType,
        nullable: false,
        comment: '事件类型'
    }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_data', type: 'json', nullable: true, comment: '事件详细数据' }),
    __metadata("design:type", Object)
], AdvertisingEvent.prototype, "eventData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', nullable: true, comment: '用户ID（如果已注册）' }),
    __metadata("design:type", Number)
], AdvertisingEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', type: 'varchar', length: 100, nullable: true, comment: '会话ID' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 100, nullable: true, comment: '设备唯一标识' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: '来源页面' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true, comment: '用户代理' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true, comment: 'IP地址' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, comment: '国家' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, comment: '地区' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, comment: '城市' }),
    __metadata("design:type", String)
], AdvertisingEvent.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '事件时间' }),
    __metadata("design:type", Date)
], AdvertisingEvent.prototype, "eventTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], AdvertisingEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => advertising_campaign_entity_1.AdvertisingCampaign, campaign => campaign.events, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaign_id' }),
    __metadata("design:type", advertising_campaign_entity_1.AdvertisingCampaign)
], AdvertisingEvent.prototype, "campaign", void 0);
exports.AdvertisingEvent = AdvertisingEvent = __decorate([
    (0, typeorm_1.Entity)('advertising_events'),
    (0, typeorm_1.Index)(['campaignId']),
    (0, typeorm_1.Index)(['campaignCode']),
    (0, typeorm_1.Index)(['eventType']),
    (0, typeorm_1.Index)(['eventTime']),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['sessionId']),
    (0, typeorm_1.Index)(['deviceId']),
    (0, typeorm_1.Index)(['createdAt'])
], AdvertisingEvent);
//# sourceMappingURL=advertising-event.entity.js.map
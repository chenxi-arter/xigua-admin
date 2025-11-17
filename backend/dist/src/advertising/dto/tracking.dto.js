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
exports.ConversionResponseDto = exports.EventResponseDto = exports.CreateConversionDto = exports.BatchCreateEventDto = exports.CreateEventDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const entity_1 = require("../entity");
class CreateEventDto {
    campaignCode;
    eventType;
    eventData;
    sessionId;
    deviceId;
    referrer;
    userAgent;
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "campaignCode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entity_1.EventType),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateEventDto.prototype, "eventData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "referrer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "userAgent", void 0);
class BatchCreateEventDto {
    events;
}
exports.BatchCreateEventDto = BatchCreateEventDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => CreateEventDto),
    __metadata("design:type", Array)
], BatchCreateEventDto.prototype, "events", void 0);
class CreateConversionDto {
    campaignCode;
    conversionType;
    conversionValue;
    userId;
    sessionId;
    deviceId;
}
exports.CreateConversionDto = CreateConversionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversionDto.prototype, "campaignCode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(entity_1.ConversionType),
    __metadata("design:type", String)
], CreateConversionDto.prototype, "conversionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConversionDto.prototype, "conversionValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConversionDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversionDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversionDto.prototype, "deviceId", void 0);
class EventResponseDto {
    success;
    message;
}
exports.EventResponseDto = EventResponseDto;
class ConversionResponseDto {
    success;
    message;
    conversionId;
}
exports.ConversionResponseDto = ConversionResponseDto;
//# sourceMappingURL=tracking.dto.js.map
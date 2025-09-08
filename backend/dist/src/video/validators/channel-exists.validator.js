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
exports.IsValidChannelExistsConstraint = void 0;
exports.IsValidChannelExists = IsValidChannelExists;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entity/category.entity");
let IsValidChannelExistsConstraint = class IsValidChannelExistsConstraint {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    validate(channeid) {
        if (channeid === undefined || channeid === null) {
            return true;
        }
        const numericChanneid = Number(channeid);
        if (isNaN(numericChanneid) || numericChanneid < 0) {
            return false;
        }
        return true;
    }
    defaultMessage() {
        return '频道ID不存在或已禁用';
    }
};
exports.IsValidChannelExistsConstraint = IsValidChannelExistsConstraint;
exports.IsValidChannelExistsConstraint = IsValidChannelExistsConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidChannelExists', async: true }),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IsValidChannelExistsConstraint);
function IsValidChannelExists(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidChannelExistsConstraint,
        });
    };
}
//# sourceMappingURL=channel-exists.validator.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTelegramHashConstraint = void 0;
exports.IsValidChannelId = IsValidChannelId;
exports.IsValidFilterIds = IsValidFilterIds;
exports.IsValidMediaType = IsValidMediaType;
exports.IsValidSortType = IsValidSortType;
exports.IsTelegramHash = IsTelegramHash;
exports.IsValidUrl = IsValidUrl;
exports.IsValidComment = IsValidComment;
exports.IsValidTimestamp = IsValidTimestamp;
const class_validator_1 = require("class-validator");
function IsValidChannelId(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidChannelId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return /^[1-9]\d*$/.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的频道ID格式（正整数字符串）`;
                },
            },
        });
    };
}
function IsValidFilterIds(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidFilterIds',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return /^\d+(,\d+)*$/.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的筛选ID格式（如：0,1,2,3,4）`;
                },
            },
        });
    };
}
function IsValidMediaType(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidMediaType',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return ['short', 'series'].includes(value);
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的媒体类型（short 或 series）`;
                },
            },
        });
    };
}
function IsValidSortType(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidSortType',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return ['latest', 'like', 'play'].includes(value);
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的排序类型（latest、like 或 play）`;
                },
            },
        });
    };
}
let IsTelegramHashConstraint = class IsTelegramHashConstraint {
    validate(hash, args) {
        if (typeof hash !== 'string')
            return false;
        return /^[a-f0-9]{64}$/i.test(hash);
    }
    defaultMessage(args) {
        return `${args.property} 必须是有效的Telegram验证哈希`;
    }
};
exports.IsTelegramHashConstraint = IsTelegramHashConstraint;
exports.IsTelegramHashConstraint = IsTelegramHashConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isTelegramHash', async: false })
], IsTelegramHashConstraint);
function IsTelegramHash(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTelegramHashConstraint,
        });
    };
}
function IsValidUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidUrl',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    try {
                        new URL(value);
                        return true;
                    }
                    catch {
                        return false;
                    }
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的URL格式`;
                },
            },
        });
    };
}
function IsValidComment(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidComment',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const trimmed = value.trim();
                    return trimmed.length >= 1 && trimmed.length <= 500;
                },
                defaultMessage(args) {
                    return `${args.property} 长度必须在1-500字符之间，且不能只包含空白字符`;
                },
            },
        });
    };
}
function IsValidTimestamp(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidTimestamp',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'number')
                        return false;
                    const now = Math.floor(Date.now() / 1000);
                    const oneHour = 3600;
                    return value > 0 && value <= now + oneHour;
                },
                defaultMessage(args) {
                    return `${args.property} 必须是有效的时间戳（秒）`;
                },
            },
        });
    };
}
//# sourceMappingURL=custom-validators.js.map
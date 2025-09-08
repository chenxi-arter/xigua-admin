"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberRangeConstraint = exports.ArrayLengthConstraint = exports.StrongPasswordConstraint = exports.ChinesePhoneNumberConstraint = exports.ImageUrlConstraint = exports.VideoUrlConstraint = exports.EnhancedStringLengthConstraint = void 0;
exports.EnhancedStringLength = EnhancedStringLength;
exports.IsVideoUrl = IsVideoUrl;
exports.IsImageUrl = IsImageUrl;
exports.IsChinesePhoneNumber = IsChinesePhoneNumber;
exports.IsStrongPassword = IsStrongPassword;
exports.ArrayLength = ArrayLength;
exports.NumberRange = NumberRange;
const class_validator_1 = require("class-validator");
let EnhancedStringLengthConstraint = class EnhancedStringLengthConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const [min, max] = args.constraints;
        const length = this.getStringLength(value);
        return length >= min && length <= max;
    }
    defaultMessage(args) {
        const [min, max] = args.constraints;
        return `字符长度必须在 ${min} 到 ${max} 之间（中文字符按2个字符计算）`;
    }
    getStringLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            if ((char >= 0x4e00 && char <= 0x9fff) ||
                (char >= 0x3400 && char <= 0x4dbf) ||
                (char >= 0x20000 && char <= 0x2a6df)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    }
};
exports.EnhancedStringLengthConstraint = EnhancedStringLengthConstraint;
exports.EnhancedStringLengthConstraint = EnhancedStringLengthConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'enhancedStringLength', async: false })
], EnhancedStringLengthConstraint);
function EnhancedStringLength(min, max, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [min, max],
            validator: EnhancedStringLengthConstraint,
        });
    };
}
let VideoUrlConstraint = class VideoUrlConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return false;
            }
            const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m3u8'];
            const pathname = url.pathname.toLowerCase();
            return allowedExtensions.some(ext => pathname.endsWith(ext)) || pathname.includes('.m3u8');
        }
        catch {
            return false;
        }
    }
    defaultMessage(args) {
        return '必须是有效的视频URL地址';
    }
};
exports.VideoUrlConstraint = VideoUrlConstraint;
exports.VideoUrlConstraint = VideoUrlConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'videoUrl', async: false })
], VideoUrlConstraint);
function IsVideoUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: VideoUrlConstraint,
        });
    };
}
let ImageUrlConstraint = class ImageUrlConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return false;
            }
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
            const pathname = url.pathname.toLowerCase();
            return allowedExtensions.some(ext => pathname.endsWith(ext));
        }
        catch {
            return false;
        }
    }
    defaultMessage(args) {
        return '必须是有效的图片URL地址';
    }
};
exports.ImageUrlConstraint = ImageUrlConstraint;
exports.ImageUrlConstraint = ImageUrlConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'imageUrl', async: false })
], ImageUrlConstraint);
function IsImageUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: ImageUrlConstraint,
        });
    };
}
let ChinesePhoneNumberConstraint = class ChinesePhoneNumberConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(value);
    }
    defaultMessage(args) {
        return '请输入有效的中国大陆手机号码';
    }
};
exports.ChinesePhoneNumberConstraint = ChinesePhoneNumberConstraint;
exports.ChinesePhoneNumberConstraint = ChinesePhoneNumberConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'chinesePhoneNumber', async: false })
], ChinesePhoneNumberConstraint);
function IsChinesePhoneNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: ChinesePhoneNumberConstraint,
        });
    };
}
let StrongPasswordConstraint = class StrongPasswordConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const [minLength = 8] = args.constraints;
        const hasNumber = /\d/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasUpperCaseOrSpecial = /[A-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        return value.length >= minLength && hasNumber && hasLowerCase && hasUpperCaseOrSpecial;
    }
    defaultMessage(args) {
        const [minLength = 8] = args.constraints;
        return `密码必须至少${minLength}位，且包含数字、小写字母和大写字母或特殊字符`;
    }
};
exports.StrongPasswordConstraint = StrongPasswordConstraint;
exports.StrongPasswordConstraint = StrongPasswordConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'strongPassword', async: false })
], StrongPasswordConstraint);
function IsStrongPassword(minLength = 8, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [minLength],
            validator: StrongPasswordConstraint,
        });
    };
}
let ArrayLengthConstraint = class ArrayLengthConstraint {
    validate(value, args) {
        if (!Array.isArray(value)) {
            return false;
        }
        const [min, max] = args.constraints;
        return value.length >= min && value.length <= max;
    }
    defaultMessage(args) {
        const [min, max] = args.constraints;
        return `数组长度必须在 ${min} 到 ${max} 之间`;
    }
};
exports.ArrayLengthConstraint = ArrayLengthConstraint;
exports.ArrayLengthConstraint = ArrayLengthConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'arrayLength', async: false })
], ArrayLengthConstraint);
function ArrayLength(min, max, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [min, max],
            validator: ArrayLengthConstraint,
        });
    };
}
let NumberRangeConstraint = class NumberRangeConstraint {
    validate(value, args) {
        if (typeof value !== 'number' || isNaN(value)) {
            return false;
        }
        const [min, max] = args.constraints;
        return value >= min && value <= max;
    }
    defaultMessage(args) {
        const [min, max] = args.constraints;
        return `数值必须在 ${min} 到 ${max} 之间`;
    }
};
exports.NumberRangeConstraint = NumberRangeConstraint;
exports.NumberRangeConstraint = NumberRangeConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'numberRange', async: false })
], NumberRangeConstraint);
function NumberRange(min, max, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [min, max],
            validator: NumberRangeConstraint,
        });
    };
}
//# sourceMappingURL=enhanced-validation.decorator.js.map
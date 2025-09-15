import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class EnhancedStringLengthConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
    private getStringLength;
}
export declare function EnhancedStringLength(min: number, max: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class VideoUrlConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsVideoUrl(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class ImageUrlConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsImageUrl(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class ChinesePhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsChinesePhoneNumber(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class StrongPasswordConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsStrongPassword(minLength?: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class ArrayLengthConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function ArrayLength(min: number, max: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class NumberRangeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function NumberRange(min: number, max: number, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

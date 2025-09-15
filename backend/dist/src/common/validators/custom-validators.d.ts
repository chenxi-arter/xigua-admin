import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare function IsValidChannelId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidFilterIds(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidMediaType(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidSortType(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare class IsTelegramHashConstraint implements ValidatorConstraintInterface {
    validate(hash: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsTelegramHash(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidUrl(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidComment(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export declare function IsValidTimestamp(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

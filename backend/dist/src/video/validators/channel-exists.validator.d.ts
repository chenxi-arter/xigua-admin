import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
export declare class IsValidChannelExistsConstraint implements ValidatorConstraintInterface {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    validate(channeid: any): boolean;
    defaultMessage(): string;
}
export declare function IsValidChannelExists(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

import { BadRequestException, PipeTransform, ValidationPipe } from '@nestjs/common';
export declare class ValidationToItemsPipe extends ValidationPipe implements PipeTransform<any> {
    constructor();
    createExceptionFactory(): (errors: any[]) => BadRequestException;
}

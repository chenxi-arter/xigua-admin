import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private getHttpStatus;
    private buildErrorResponse;
    private getErrorType;
    private isValidationError;
    private extractValidationErrors;
    private logError;
}

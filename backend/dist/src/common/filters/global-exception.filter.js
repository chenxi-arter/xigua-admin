"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = this.getHttpStatus(exception);
        const errorResponse = this.buildErrorResponse(exception, request, status);
        this.logError(exception, request, status);
        response.status(status).json(errorResponse);
    }
    getHttpStatus(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
    buildErrorResponse(exception, request, status) {
        const baseResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'object' && response !== null) {
                return {
                    ...baseResponse,
                    ...response,
                };
            }
            return {
                ...baseResponse,
                message: response,
                error: this.getErrorType(status),
            };
        }
        if (this.isValidationError(exception)) {
            return {
                ...baseResponse,
                message: '请求参数验证失败',
                errors: this.extractValidationErrors(exception),
                error: 'Bad Request',
            };
        }
        return {
            ...baseResponse,
            message: '服务器内部错误',
            error: 'Internal Server Error',
        };
    }
    getErrorType(status) {
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                return 'Bad Request';
            case common_1.HttpStatus.UNAUTHORIZED:
                return 'Unauthorized';
            case common_1.HttpStatus.FORBIDDEN:
                return 'Forbidden';
            case common_1.HttpStatus.NOT_FOUND:
                return 'Not Found';
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                return 'Too Many Requests';
            case common_1.HttpStatus.INTERNAL_SERVER_ERROR:
                return 'Internal Server Error';
            default:
                return 'Unknown Error';
        }
    }
    isValidationError(exception) {
        return Array.isArray(exception) &&
            exception.every(error => error instanceof class_validator_1.ValidationError);
    }
    extractValidationErrors(exception) {
        return exception.map(error => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints,
        }));
    }
    logError(exception, request, status) {
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || '';
        const logMessage = `${method} ${url} - ${status} - ${ip} - ${userAgent}`;
        if (status >= 500) {
            this.logger.error(logMessage, exception instanceof Error ? exception.stack : exception);
        }
        else if (status >= 400) {
            this.logger.warn(logMessage);
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map
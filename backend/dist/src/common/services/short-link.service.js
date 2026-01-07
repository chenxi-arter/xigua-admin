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
var ShortLinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ShortLinkService = ShortLinkService_1 = class ShortLinkService {
    configService;
    logger = new common_1.Logger(ShortLinkService_1.name);
    apiUrl = 'https://api.short.io/links';
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('SHORT_IO_API_KEY') || '';
        if (!this.apiKey) {
            this.logger.warn('SHORT_IO_API_KEY is not configured');
        }
    }
    async createShortLink(dto) {
        if (!this.apiKey) {
            throw new common_1.HttpException('Short.io API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const payload = {
            allowDuplicates: dto.allowDuplicates ?? false,
            originalURL: dto.originalURL,
            domain: dto.domain,
            ...(dto.ttl && { ttl: dto.ttl }),
        };
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': this.apiKey,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Short.io API error: ${response.status} - ${errorText}`);
                throw new common_1.HttpException(`Failed to create short link: ${errorText}`, response.status);
            }
            const data = await response.json();
            return {
                id: data.id || data.idString,
                originalURL: data.originalURL,
                shortURL: data.shortURL,
                domain: data.domain,
                expiresAt: data.expiresAt,
                createdAt: data.createdAt,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Error creating short link:', error);
            throw new common_1.HttpException('Failed to create short link', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ShortLinkService = ShortLinkService;
exports.ShortLinkService = ShortLinkService = ShortLinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ShortLinkService);
//# sourceMappingURL=short-link.service.js.map
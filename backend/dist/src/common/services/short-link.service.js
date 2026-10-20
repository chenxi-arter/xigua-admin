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
    defaultDomain;
    allowedDomains;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('SHORT_IO_API_KEY');
        if (!apiKey) {
            this.logger.warn('SHORT_IO_API_KEY is not configured. Short link service will not work until configured.');
            this.apiKey = '';
        }
        else {
            this.apiKey = apiKey;
            this.logger.log('Short.io service initialized successfully');
        }
        this.defaultDomain = this.configService.get('SHORT_IO_DEFAULT_DOMAIN') || 'xgtv.short.gy';
        this.allowedDomains = (this.configService.get('SHORT_LINK_ALLOWED_DOMAINS') || '')
            .split(',')
            .map((d) => d.trim().toLowerCase())
            .filter((d) => d.length > 0);
        if (this.allowedDomains.length === 0) {
            this.logger.warn('SHORT_LINK_ALLOWED_DOMAINS 未配置：目前任何 HTTPS 地址都能创建短链（存在开放重定向风险，建议配置白名单）');
        }
    }
    async createShortLink(dto) {
        if (!this.apiKey) {
            throw new common_1.HttpException('Short.io API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.validateUrl(dto.originalURL);
        const payload = {
            allowDuplicates: dto.allowDuplicates ?? false,
            originalURL: dto.originalURL,
            domain: dto.domain || this.defaultDomain,
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
                let errorMessage = `Failed to create short link: ${errorText}`;
                if (response.status === 404 && errorText.includes('Domain not found')) {
                    errorMessage = '域名不存在。请在 Short.io 控制台配置该域名，或不传 domain 参数使用默认域名';
                }
                else if (response.status === 401) {
                    errorMessage = 'Short.io API 密钥无效，请检查 SHORT_IO_API_KEY 配置';
                }
                else if (response.status === 429) {
                    errorMessage = 'Short.io API 请求频率超限，请稍后重试';
                }
                throw new common_1.HttpException(errorMessage, response.status);
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
    validateUrl(url) {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.toLowerCase();
            if (parsedUrl.protocol !== 'https:') {
                this.logger.warn(`Blocked non-HTTPS URL: ${url}`);
                throw new common_1.HttpException('URL 必须使用 HTTPS 协议', common_1.HttpStatus.BAD_REQUEST);
            }
            const allowedDomains = this.allowedDomains;
            if (allowedDomains.length === 0) {
                this.logger.log(`URL validation passed (no whitelist configured): ${hostname}`);
                return;
            }
            const isAllowed = allowedDomains.some(domain => {
                if (domain.startsWith('*.')) {
                    const baseDomain = domain.substring(2);
                    return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
                }
                return hostname === domain;
            });
            if (!isAllowed) {
                this.logger.warn(`Blocked short link creation for non-whitelisted domain: ${hostname}`);
                throw new common_1.HttpException(`域名 ${hostname} 不在允许的白名单内。请联系管理员添加该域名。`, common_1.HttpStatus.FORBIDDEN);
            }
            this.logger.log(`URL validation passed (whitelist match): ${hostname}`);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Invalid URL format: ${url}`);
            throw new common_1.HttpException('URL 格式无效', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ShortLinkService = ShortLinkService;
exports.ShortLinkService = ShortLinkService = ShortLinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ShortLinkService);
//# sourceMappingURL=short-link.service.js.map
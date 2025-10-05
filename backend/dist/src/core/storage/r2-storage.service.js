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
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
let R2StorageService = class R2StorageService {
    s3;
    bucketName;
    publicBaseUrl;
    endpointBucketBase;
    initialized = false;
    constructor() {
    }
    ensureInitialized() {
        if (this.initialized) {
            return;
        }
        const endpoint = process.env.R2_ENDPOINT_URL;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
        if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('R2 storage not configured. Required environment variables: ' +
                'R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
        }
        this.bucketName = bucketName;
        this.publicBaseUrl = publicBaseUrl;
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint,
            credentials: { accessKeyId, secretAccessKey },
            forcePathStyle: true,
        });
        this.endpointBucketBase = `${String(endpoint).replace(/\/$/, '')}/${this.bucketName}`;
        this.initialized = true;
        console.log('✅ R2 Storage initialized');
    }
    async uploadBuffer(buffer, originalName, opts) {
        this.ensureInitialized();
        const keyPrefix = opts?.keyPrefix ?? 'uploads/';
        const safeExt = (originalName && originalName.includes('.')) ? originalName.split('.').pop() : undefined;
        const key = `${keyPrefix}${(0, crypto_1.randomUUID)()}${safeExt ? '.' + safeExt.toLowerCase() : ''}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: opts?.contentType,
            ACL: undefined,
        });
        await this.s3.send(command);
        const base = (this.publicBaseUrl ?? this.endpointBucketBase).replace(/\/$/, '');
        const url = `${base}/${key}`;
        return { key, url };
    }
};
exports.R2StorageService = R2StorageService;
exports.R2StorageService = R2StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], R2StorageService);
//# sourceMappingURL=r2-storage.service.js.map
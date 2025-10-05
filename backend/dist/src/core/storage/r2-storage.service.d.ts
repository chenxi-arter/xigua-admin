export interface R2UploadOptions {
    keyPrefix?: string;
    contentType?: string;
}
export declare class R2StorageService {
    private s3;
    private bucketName;
    private publicBaseUrl?;
    private endpointBucketBase;
    private initialized;
    constructor();
    private ensureInitialized;
    uploadBuffer(buffer: Buffer, originalName?: string, opts?: R2UploadOptions): Promise<{
        key: string;
        url?: string;
    }>;
}

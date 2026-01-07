export declare class CreateShortLinkDto {
    originalURL: string;
    allowDuplicates?: boolean;
    ttl?: string;
    domain?: string;
}
export declare class ShortLinkResponseDto {
    id: string;
    originalURL: string;
    shortURL: string;
    domain: string;
    expiresAt?: string;
    createdAt?: string;
}

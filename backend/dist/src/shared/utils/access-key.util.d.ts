export declare class AccessKeyUtil {
    static generateAccessKey(length?: number): string;
    static generateDeterministicKey(id: number, salt?: string): string;
    static generateFromString(key: string, length?: number): string;
    static isValidAccessKey(key: string): boolean;
    static generateUuidKey(): string;
    static generateBatch(count: number, length?: number): string[];
}

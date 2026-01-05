export declare class ShortIdUtil {
    private static readonly CHARSET;
    private static readonly CHARSET_LENGTH;
    static generate(): string;
    static isValid(shortId: string): boolean;
    static isShortId(str: string): boolean;
    static generateWithTimestamp(): string;
    static generateBatch(count: number): string[];
    static isDuplicate(shortId: string, existingIds: string[]): boolean;
    static generateUnique(existingIds: string[], maxAttempts?: number): string;
}

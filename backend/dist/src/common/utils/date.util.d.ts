export declare class DateUtil {
    private static timezone;
    static setTimezone(timezone: string): void;
    static getTimezone(): string;
    static formatDateTime(date: Date | string): string;
    static formatDate(date: Date | string): string;
    static now(): Date;
    static utcToBeijing(utcDate: Date | string): string;
}

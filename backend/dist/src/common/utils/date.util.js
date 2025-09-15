"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
class DateUtil {
    static timezone = process?.env?.APP_TIMEZONE || 'Asia/Shanghai';
    static setTimezone(timezone) {
        if (timezone && typeof timezone === 'string') {
            this.timezone = timezone;
        }
    }
    static getTimezone() {
        return this.timezone;
    }
    static formatDateTime(date) {
        if (!date)
            return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime()))
            return '';
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: this.timezone
        };
        const formatted = dateObj.toLocaleString('zh-CN', options);
        return formatted.replace(/\//g, '-');
    }
    static formatDate(date) {
        if (!date)
            return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime()))
            return '';
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: this.timezone
        };
        const formatted = dateObj.toLocaleDateString('zh-CN', options);
        return formatted.replace(/\//g, '-');
    }
    static now() {
        return new Date();
    }
    static utcToBeijing(utcDate) {
        return this.formatDateTime(utcDate);
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=date.util.js.map
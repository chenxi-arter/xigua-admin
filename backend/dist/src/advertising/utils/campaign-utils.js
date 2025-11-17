"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignUtils = void 0;
const crypto = require("crypto");
class CampaignUtils {
    static PLATFORM_CODES = {
        'tiktok': 'TK',
        'wechat': 'WX',
        'baidu': 'BD',
        'google': 'GG',
        'weibo': 'WB',
        'xiaohongshu': 'XHS',
        'kuaishou': 'KS',
        'other': 'OT'
    };
    static generateCampaignCode(platform) {
        const platformCode = this.PLATFORM_CODES[platform] || 'OT';
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `${platformCode}_${dateStr}_${randomStr}`;
    }
    static async getLocationFromIp(ipAddress) {
        try {
            const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
            const data = await response.json();
            if (data.status === 'success') {
                return {
                    country: data.country,
                    region: data.regionName,
                    city: data.city
                };
            }
        }
        catch (error) {
            console.error('获取地理位置失败:', error);
        }
        return { country: undefined, region: undefined, city: undefined };
    }
    static calculateTimeToConversion(firstClickTime, conversionTime) {
        return Math.floor((conversionTime.getTime() - firstClickTime.getTime()) / 1000);
    }
    static calculateConversionRate(conversions, clicks) {
        return clicks > 0 ? conversions / clicks : 0;
    }
    static calculateCPC(cost, clicks) {
        return clicks > 0 ? cost / clicks : 0;
    }
    static calculateCPA(cost, conversions) {
        return conversions > 0 ? cost / conversions : 0;
    }
}
exports.CampaignUtils = CampaignUtils;
//# sourceMappingURL=campaign-utils.js.map
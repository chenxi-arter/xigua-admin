"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortIdUtil = void 0;
const crypto = require("crypto");
class ShortIdUtil {
    static CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    static CHARSET_LENGTH = ShortIdUtil.CHARSET.length;
    static generate() {
        const randomBytes = crypto.randomBytes(8);
        let num = 0n;
        for (let i = 0; i < randomBytes.length; i++) {
            num = (num << 8n) + BigInt(randomBytes[i]);
        }
        let result = '';
        const base = BigInt(ShortIdUtil.CHARSET_LENGTH);
        for (let i = 0; i < 11; i++) {
            const remainder = Number(num % base);
            result = ShortIdUtil.CHARSET[remainder] + result;
            num = num / base;
        }
        return result;
    }
    static isValid(shortId) {
        if (!shortId || shortId.length !== 11) {
            return false;
        }
        for (const char of shortId) {
            if (!ShortIdUtil.CHARSET.includes(char)) {
                return false;
            }
        }
        return true;
    }
    static isShortId(str) {
        return this.isValid(str);
    }
    static generateWithTimestamp() {
        const timestamp = Date.now();
        const timestampStr = timestamp.toString(36);
        const randomPart = ShortIdUtil.generate().substring(0, 11 - timestampStr.length);
        return (timestampStr + randomPart).substring(0, 11);
    }
    static generateBatch(count) {
        const ids = new Set();
        while (ids.size < count) {
            ids.add(ShortIdUtil.generate());
        }
        return Array.from(ids);
    }
    static isDuplicate(shortId, existingIds) {
        return existingIds.includes(shortId);
    }
    static generateUnique(existingIds, maxAttempts = 100) {
        for (let i = 0; i < maxAttempts; i++) {
            const shortId = ShortIdUtil.generate();
            if (!ShortIdUtil.isDuplicate(shortId, existingIds)) {
                return shortId;
            }
        }
        throw new Error('无法生成唯一的短ID，请稍后重试');
    }
}
exports.ShortIdUtil = ShortIdUtil;
//# sourceMappingURL=short-id.util.js.map
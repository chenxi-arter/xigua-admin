"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyUtil = void 0;
const crypto_1 = require("crypto");
const security_env_util_1 = require("./security-env.util");
class AccessKeyUtil {
    static getSecret() {
        return (0, security_env_util_1.assertStrongSecret)('APP_SECRET');
    }
    static generateAccessKey(length = 32) {
        return (0, crypto_1.randomBytes)(length / 2).toString('hex');
    }
    static generateDeterministicKey(id, salt) {
        const saltValue = salt || Date.now().toString();
        return (0, crypto_1.createHmac)('sha256', this.getSecret())
            .update(`${id}_${saltValue}`)
            .digest('hex')
            .substring(0, 32);
    }
    static generateFromString(key, length = 32) {
        const hash = (0, crypto_1.createHmac)('sha256', this.getSecret()).update(key).digest('hex');
        return hash.substring(0, length);
    }
    static isValidAccessKey(key) {
        if (!key || typeof key !== 'string') {
            return false;
        }
        const hexPattern = /^[a-f0-9]{32}$|^[a-f0-9]{64}$/i;
        const alphanumericPattern = /^[a-zA-Z0-9]{32}$/;
        return hexPattern.test(key) || alphanumericPattern.test(key);
    }
    static generateUuidKey() {
        const hex = (0, crypto_1.randomBytes)(16).toString('hex');
        return [
            hex.substring(0, 8),
            hex.substring(8, 12),
            hex.substring(12, 16),
            hex.substring(16, 20),
            hex.substring(20, 32)
        ].join('');
    }
    static generateBatch(count, length = 32) {
        const keys = [];
        const keySet = new Set();
        while (keys.length < count) {
            const key = this.generateAccessKey(length);
            if (!keySet.has(key)) {
                keySet.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
}
exports.AccessKeyUtil = AccessKeyUtil;
//# sourceMappingURL=access-key.util.js.map
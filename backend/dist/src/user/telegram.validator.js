"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTelegramHash = verifyTelegramHash;
const crypto_1 = require("crypto");
function verifyTelegramHash(botToken, data) {
    const { hash, loginType, deviceInfo, ...userData } = data;
    void loginType;
    void deviceInfo;
    const filteredData = Object.fromEntries(Object.entries(userData).filter(([, value]) => value !== undefined));
    const checkString = Object.keys(filteredData)
        .sort()
        .map((k) => `${k}=${filteredData[k]}`)
        .join('\n');
    const secretKey = (0, crypto_1.createHash)('sha256').update(botToken).digest();
    const calculatedHash = (0, crypto_1.createHmac)('sha256', secretKey)
        .update(checkString)
        .digest('hex');
    return calculatedHash === hash;
}
//# sourceMappingURL=telegram.validator.js.map
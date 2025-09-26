"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt = require("bcrypt");
class PasswordUtil {
    static SALT_ROUNDS = 12;
    static async hashPassword(password) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    static validatePasswordStrength(password) {
        if (password.length < 6) {
            return { valid: false, message: '密码长度不能少于6位' };
        }
        if (password.length > 20) {
            return { valid: false, message: '密码长度不能超过20位' };
        }
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (!hasLetter) {
            return { valid: false, message: '密码必须包含至少一个字母' };
        }
        if (!hasNumber) {
            return { valid: false, message: '密码必须包含至少一个数字' };
        }
        return { valid: true };
    }
}
exports.PasswordUtil = PasswordUtil;
//# sourceMappingURL=password.util.js.map
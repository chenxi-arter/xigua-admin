"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertStrongSecret = assertStrongSecret;
exports.optionalSecret = optionalSecret;
exports.validateSecurityEnv = validateSecurityEnv;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('SecurityEnv');
const WEAK_SECRETS = new Set([
    'very-secret-key',
    'default_secret',
    'default-secret',
    'secret',
    'changeme',
    'change-me',
    'password',
    'your-secret-key',
    'your_jwt_secret',
    'your_secret',
]);
const MIN_SECRET_LENGTH = 16;
const PLACEHOLDER_PATTERNS = [
    /^your[_-]/i,
    /[_-]here$/i,
    /change[_-]?(me|in[_-]?production)/i,
    /placeholder/i,
    /^x{8,}$/i,
    /^example/i,
];
function isRepeatedChar(value) {
    return value.length > 0 && new Set(value).size === 1;
}
function isPlaceholder(value) {
    if (isRepeatedChar(value))
        return true;
    return PLACEHOLDER_PATTERNS.some((re) => re.test(value));
}
function normalize(raw) {
    if (!raw)
        return undefined;
    const value = raw.trim();
    return value.length > 0 ? value : undefined;
}
function assertStrongSecret(name, rawValue) {
    const fallback = rawValue === undefined ? process.env[name] : rawValue;
    const value = normalize(fallback);
    if (!value) {
        throw new Error(`[安全配置] 缺少环境变量 ${name}。请参考 .env.example 配置；` +
            `可用 \`openssl rand -base64 48\` 生成高熵随机值。`);
    }
    if (WEAK_SECRETS.has(value.toLowerCase())) {
        throw new Error(`[安全配置] ${name} 仍是已知弱密钥（历史泄露值），请立即轮换为高熵随机值。`);
    }
    if (isPlaceholder(value)) {
        throw new Error(`[安全配置] ${name} 看起来仍是占位值（如 your_xxx_here / changeme），` +
            `请用 \`openssl rand -base64 48\` 生成真实密钥。`);
    }
    if (value.length < MIN_SECRET_LENGTH) {
        throw new Error(`[安全配置] ${name} 长度不足 ${MIN_SECRET_LENGTH} 位，请使用高熵随机值。`);
    }
    return value;
}
function optionalSecret(name, rawValue) {
    const fallback = rawValue === undefined ? process.env[name] : rawValue;
    const value = normalize(fallback);
    if (!value)
        return undefined;
    logger.warn(`[安全配置] 检测到过渡期旧密钥 ${name}，旧 token 仍会被接受。` +
        `迁移完成后请从环境变量中删除该配置。`);
    return value;
}
function validateSecurityEnv() {
    assertStrongSecret('JWT_SECRET');
    assertStrongSecret('ADMIN_JWT_SECRET');
    assertStrongSecret('APP_SECRET');
}
//# sourceMappingURL=security-env.util.js.map
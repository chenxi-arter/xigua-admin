"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAvatarUtil = void 0;
class DefaultAvatarUtil {
    static DEFAULT_AVATARS = [
        'https://static.656932.com/defaultavatar/1.png',
        'https://static.656932.com/defaultavatar/2.png',
        'https://static.656932.com/defaultavatar/3.png',
        'https://static.656932.com/defaultavatar/4.png',
        'https://static.656932.com/defaultavatar/5.png',
    ];
    static getRandomAvatar() {
        const randomIndex = Math.floor(Math.random() * this.DEFAULT_AVATARS.length);
        return this.DEFAULT_AVATARS[randomIndex];
    }
    static getAvatarByUserId(userId) {
        const index = userId % this.DEFAULT_AVATARS.length;
        return this.DEFAULT_AVATARS[index];
    }
    static getAvatarBySeed(seed) {
        const index = Math.abs(seed) % this.DEFAULT_AVATARS.length;
        return this.DEFAULT_AVATARS[index];
    }
    static getAllAvatars() {
        return [...this.DEFAULT_AVATARS];
    }
}
exports.DefaultAvatarUtil = DefaultAvatarUtil;
//# sourceMappingURL=default-avatar.util.js.map
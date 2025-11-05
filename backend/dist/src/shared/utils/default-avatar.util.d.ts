export declare class DefaultAvatarUtil {
    private static readonly DEFAULT_AVATARS;
    static getRandomAvatar(): string;
    static getAvatarByUserId(userId: number): string;
    static getAvatarBySeed(seed: number): string;
    static getAllAvatars(): string[];
}

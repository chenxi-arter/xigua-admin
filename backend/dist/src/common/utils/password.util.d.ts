export declare class PasswordUtil {
    private static readonly SALT_ROUNDS;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static validatePasswordStrength(password: string): {
        valid: boolean;
        message?: string;
    };
}

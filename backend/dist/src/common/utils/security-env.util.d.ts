export declare function assertStrongSecret(name: string, rawValue?: string): string;
export declare function optionalSecret(name: string, rawValue?: string): string | undefined;
export type ServiceRole = 'client' | 'admin' | 'all';
export declare function validateSecurityEnv(): void;

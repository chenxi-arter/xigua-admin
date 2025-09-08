export declare enum Environment {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    TEST = "test"
}
export declare class AppConfig {
    nodeEnv: Environment;
    port: number;
    appName: string;
    appVersion: string;
    appUrl?: string;
    globalPrefix?: string;
    enableCors?: boolean;
    enableSwagger?: boolean;
    enableVersioning?: boolean;
    defaultVersion?: string;
    throttleTtl?: number;
    throttleLimit?: number;
    jwtSecret?: string;
    jwtExpiresIn?: string;
    jwtRefreshExpiresIn?: string;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get isTest(): boolean;
    getCorsConfig(): {
        origin: boolean | (string | undefined)[];
        methods: string[];
        allowedHeaders: string[];
        credentials: boolean;
    };
    getThrottleConfig(): {
        ttl: number | undefined;
        limit: number | undefined;
    };
    getJwtConfig(): {
        secret: string | undefined;
        signOptions: {
            expiresIn: string | undefined;
        };
    };
}

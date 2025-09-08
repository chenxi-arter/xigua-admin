import { ConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get database(): {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    get redis(): {
        host: string;
        port: number;
        password: string | undefined;
        db: number;
        ttl: number;
    };
    get app(): {
        port: number;
        env: string;
        apiPrefix: string;
        corsOrigin: string;
        maxFileSize: number;
    };
    get jwt(): {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    get upload(): {
        destination: string;
        maxSize: number;
        allowedMimeTypes: string[];
    };
    get cache(): {
        defaultTtl: number;
        homeVideosTtl: number;
        filterDataTtl: number;
        videoDetailsTtl: number;
        categoriesTtl: number;
        tagsTtl: number;
    };
    get pagination(): {
        defaultLimit: number;
        maxLimit: number;
        defaultPage: number;
    };
    get logging(): {
        level: string;
        enableConsole: boolean;
        enableFile: boolean;
        filePath: string;
        maxFiles: number;
        maxSize: string;
    };
    get security(): {
        rateLimitTtl: number;
        rateLimitMax: number;
        enableHelmet: boolean;
        enableCors: boolean;
    };
    get thirdParty(): {
        cdnUrl: string | undefined;
        cdnAccessKey: string | undefined;
        cdnSecretKey: string | undefined;
        emailHost: string | undefined;
        emailPort: number;
        emailUser: string | undefined;
        emailPassword: string | undefined;
        smsAccessKey: string | undefined;
        smsSecretKey: string | undefined;
        smsSignName: string | undefined;
    };
    get business(): {
        maxVideoSize: number;
        supportedVideoFormats: string[];
        maxCommentLength: number;
        enableCommentReview: boolean;
        maxUsernameLength: number;
        minPasswordLength: number;
        maxSeriesEpisodes: number;
        defaultSeriesStatus: number;
    };
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get isTest(): boolean;
    get databaseUrl(): string;
    get redisUrl(): string;
}

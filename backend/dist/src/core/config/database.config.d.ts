export declare class DatabaseConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    database?: string;
    charset?: string;
    timezone?: string;
    synchronize?: boolean;
    logging?: boolean;
    maxConnections?: number;
    minConnections?: number;
    acquireTimeout?: number;
    timeout?: number;
    getTypeOrmConfig(): {
        type: "sqlite";
        database: string;
        synchronize: boolean;
        logging: boolean;
        autoLoadEntities: boolean;
        host?: undefined;
        port?: undefined;
        username?: undefined;
        password?: undefined;
        charset?: undefined;
        timezone?: undefined;
        extra?: undefined;
        retryAttempts?: undefined;
        retryDelay?: undefined;
    } | {
        type: "mysql";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        charset: string;
        timezone: string;
        synchronize: boolean | undefined;
        logging: boolean | undefined;
        extra: {
            connectionLimit: number | undefined;
            charset: string;
            dateStrings: boolean;
            typeCast: (field: any, next: () => any) => any;
        };
        autoLoadEntities: boolean;
        retryAttempts: number;
        retryDelay: number;
    };
}

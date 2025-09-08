export declare class HealthService {
    getHealthStatus(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
    };
    getDetailedHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
        memory: {
            rss: string;
            heapTotal: string;
            heapUsed: string;
            external: string;
            arrayBuffers: string;
        };
        cpu: {
            user: number;
            system: number;
        };
        platform: {
            arch: NodeJS.Architecture;
            platform: NodeJS.Platform;
            nodeVersion: string;
            pid: number;
        };
        warnings: string[];
        services: {
            database: boolean;
            redis?: boolean;
            external?: boolean;
        };
    }>;
    getSystemInfo(): {
        timestamp: string;
        system: {
            platform: NodeJS.Platform;
            arch: NodeJS.Architecture;
            nodeVersion: string;
            pid: number;
            uptime: number;
        };
        performance: {
            memory: {
                heapUsed: number;
                heapTotal: number;
                rss: number;
                external: number;
            };
            uptime: number;
            loadAverage: any;
        };
    };
    checkServiceHealth(): Promise<{
        database: boolean;
        redis?: boolean;
        external?: boolean;
    }>;
    private getMemoryWarnings;
    private getPerformanceMetrics;
}

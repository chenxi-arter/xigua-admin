import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
    };
    detailedCheck(): Promise<{
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
    systemInfo(): {
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
}

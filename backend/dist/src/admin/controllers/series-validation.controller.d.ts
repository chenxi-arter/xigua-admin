import { Repository } from 'typeorm';
import { Series } from '../../video/entity/series.entity';
import { Episode } from '../../video/entity/episode.entity';
export declare class SeriesValidationController {
    private readonly seriesRepo;
    private readonly episodeRepo;
    constructor(seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>);
    checkMissingEpisodes(seriesId?: number): Promise<{
        success: boolean;
        data: {
            total: number;
            checkedSeries: number;
            items: any[];
        };
        message: string;
        timestamp: string;
    } | {
        success: boolean;
        data: null;
        message: any;
        timestamp: string;
    }>;
    getSeriesEpisodeDetails(seriesId: number): Promise<{
        success: boolean;
        data: {
            series: {
                id: number;
                shortId: string;
                title: string;
                totalEpisodes: number;
                isCompleted: boolean;
            };
            episodes: {
                id: number;
                shortId: string;
                episodeNumber: number;
                title: string;
                status: string;
                duration: number;
            }[];
            validation: {
                expectedCount: number;
                actualCount: number;
                isContinuous: boolean;
                missingEpisodes: number[];
                duplicates: any[];
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: null;
        message: any;
    }>;
    checkDuplicateNames(): Promise<{
        success: boolean;
        data: {
            total: number;
            checkedSeries: number;
            totalDuplicateCount: any;
            items: any[];
        };
        message: string;
        timestamp: string;
    } | {
        success: boolean;
        data: null;
        message: any;
        timestamp: string;
    }>;
    checkDuplicateExternalIds(): Promise<{
        success: boolean;
        data: {
            total: number;
            checkedSeries: number;
            totalDuplicateCount: any;
            items: any[];
        };
        message: string;
        timestamp: string;
    } | {
        success: boolean;
        data: null;
        message: any;
        timestamp: string;
    }>;
    getValidationStats(): Promise<{
        success: boolean;
        code: number;
        message: string;
        timestamp: string;
        data: {
            overview: {
                totalSeries: number;
                totalEpisodes: number;
                healthySeries: number;
                issuesSeries: number;
            };
            issues: {
                missingEpisodes: number;
                duplicateEpisodes: number;
                duplicateNames: number;
                duplicateExternalIds: number;
                emptySeries: number;
            };
            breakdown: {
                onlyMissing: number;
                onlyDuplicate: number;
                bothIssues: number;
                empty: number;
            };
            quality: {
                score: number;
                grade: string;
                trend: string;
                issueRate: string;
            };
            lastCheck: {
                timestamp: string;
                duration: number;
            };
        };
    } | {
        success: boolean;
        data: null;
        message: any;
        code?: undefined;
        timestamp?: undefined;
    }>;
}

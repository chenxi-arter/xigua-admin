import { IngestService } from '../services/ingest.service';
import { IngestSeriesDto } from '../dto/ingest-series.dto';
import { UpdateIngestSeriesDto } from '../dto/update-ingest-series.dto';
export declare class IngestController {
    private readonly ingestService;
    constructor(ingestService: IngestService);
    ingestSeries(dto: IngestSeriesDto): Promise<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
        action: "created" | "updated";
    }>;
    ingestSeriesBatch(payload: {
        items: IngestSeriesDto[];
    }): Promise<import("../../common/utils/response.util").ApiResponse<{
        summary: {
            created: number;
            updated: number;
            failed: number;
            total: number;
        };
        items: {
            statusCode?: number;
            seriesId?: number;
            shortId?: string | null;
            action?: "created" | "updated";
            error?: string;
            details?: any;
            externalId?: string | null;
            title?: string;
        }[];
    }>>;
    updateSeries(dto: UpdateIngestSeriesDto): Promise<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
    }>;
    getSeriesProgress(externalId: string): Promise<import("../../common/utils/response.util").ApiResponse<null> | import("../../common/utils/response.util").ApiResponse<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
        upCount: number;
        upStatus: string | null;
        totalEpisodes: number;
        isCompleted: boolean;
    }>>;
}

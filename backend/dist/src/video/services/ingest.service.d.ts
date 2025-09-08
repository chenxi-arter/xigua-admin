import { Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { Episode } from '../entity/episode.entity';
import { EpisodeUrl } from '../entity/episode-url.entity';
import { IngestSeriesDto } from '../dto/ingest-series.dto';
import { UpdateIngestSeriesDto } from '../dto/update-ingest-series.dto';
import { FilterType } from '../entity/filter-type.entity';
import { FilterOption } from '../entity/filter-option.entity';
export declare class IngestService {
    private readonly seriesRepo;
    private readonly episodeRepo;
    private readonly urlRepo;
    private readonly filterTypeRepo;
    private readonly filterOptionRepo;
    constructor(seriesRepo: Repository<Series>, episodeRepo: Repository<Episode>, urlRepo: Repository<EpisodeUrl>, filterTypeRepo: Repository<FilterType>, filterOptionRepo: Repository<FilterOption>);
    private updateSeriesProgress;
    private resolveOptionId;
    upsertSeries(payload: IngestSeriesDto): Promise<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
        action: 'created' | 'updated';
    }>;
    updateSeries(payload: UpdateIngestSeriesDto): Promise<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
    }>;
    getSeriesProgressByExternalId(externalId: string): Promise<{
        seriesId: number;
        shortId: string | null;
        externalId: string | null;
        upCount: number;
        upStatus: string | null;
        totalEpisodes: number;
        isCompleted: boolean;
    }>;
}

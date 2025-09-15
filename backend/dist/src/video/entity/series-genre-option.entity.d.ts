import { Series } from './series.entity';
import { FilterOption } from './filter-option.entity';
export declare class SeriesGenreOption {
    id: number;
    seriesId: number;
    optionId: number;
    createdAt: Date;
    series: Series;
    option: FilterOption;
}

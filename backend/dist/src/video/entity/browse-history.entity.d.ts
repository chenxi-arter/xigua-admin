import { User } from '../../user/entity/user.entity';
import { Series } from './series.entity';
export declare class BrowseHistory {
    id: number;
    userId: number;
    seriesId: number;
    browseType: string;
    lastEpisodeNumber: number | null;
    visitCount: number;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    series: Series;
}

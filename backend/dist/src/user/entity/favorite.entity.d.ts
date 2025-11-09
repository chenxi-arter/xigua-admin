import { User } from './user.entity';
import { Series } from '../../video/entity/series.entity';
export declare class Favorite {
    id: number;
    userId: number;
    seriesId: number;
    episodeId?: number;
    favoriteType: 'series' | 'episode';
    createdAt: Date;
    updatedAt: Date;
    user: User;
    series: Series;
}

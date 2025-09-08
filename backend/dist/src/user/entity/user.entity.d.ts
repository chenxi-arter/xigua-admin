import { Comment } from '../../video/entity/comment.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
export declare class User {
    id: number;
    shortId: string;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
    created_at: Date;
    comments: Comment[];
    watchProgresses: WatchProgress[];
    generateShortId(): void;
}

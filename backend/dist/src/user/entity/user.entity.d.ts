import { Comment } from '../../video/entity/comment.entity';
import { WatchProgress } from '../../video/entity/watch-progress.entity';
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    telegram_id: number;
    shortId: string;
    first_name: string;
    last_name: string;
    username: string;
    nickname: string;
    photo_url: string | null;
    is_active: boolean;
    isGuest: boolean;
    guestToken: string;
    created_at: Date;
    comments: Comment[];
    watchProgresses: WatchProgress[];
    generateShortId(): void;
}

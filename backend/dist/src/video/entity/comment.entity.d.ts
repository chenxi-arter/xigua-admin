import { User } from '../../user/entity/user.entity';
export declare class Comment {
    id: number;
    userId: number;
    episodeShortId: string;
    parentId?: number;
    rootId?: number;
    replyToUserId?: number;
    floorNumber: number;
    replyCount: number;
    content: string;
    appearSecond: number;
    createdAt: Date;
    user: User;
}

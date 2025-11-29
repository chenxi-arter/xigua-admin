import { User } from '../../user/entity/user.entity';
import { Comment } from './comment.entity';
export declare class CommentLike {
    id: number;
    userId: number;
    commentId: number;
    isRead: boolean;
    createdAt: Date;
    user: User;
    comment: Comment;
}

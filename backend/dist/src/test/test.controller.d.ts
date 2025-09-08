import { UserService } from '../user/user.service';
export declare class TestController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: number;
            username: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
}

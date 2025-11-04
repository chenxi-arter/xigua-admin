export declare class FakeCommentService {
    private readonly enabled;
    private readonly minFakeComments;
    private readonly maxFakeComments;
    private readonly commentTemplates;
    private readonly nicknameTemplates;
    private hashCode;
    private seededRandom;
    generateFakeComments(episodeShortId: string, count: number): {
        id: number;
        content: string;
        appearSecond: number;
        replyCount: number;
        createdAt: Date;
        username: string;
        nickname: string;
        photoUrl: null;
        recentReplies: never[];
        isFake: boolean;
    }[];
    mixComments(episodeShortId: string, realComments: Array<Record<string, any>>, realTotal: number, page: number, size: number): {
        comments: (Record<string, any> | {
            id: number;
            content: string;
            appearSecond: number;
            replyCount: number;
            createdAt: Date;
            username: string;
            nickname: string;
            photoUrl: null;
            recentReplies: never[];
            isFake: boolean;
        })[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
        fakeCount: number;
    };
    isEnabled(): boolean;
    getFakeCommentCount(episodeShortId: string): number;
    getFakeCommentCounts(episodeShortIds: string[]): Map<string, number>;
    getConfig(): {
        enabled: boolean;
        minFakeComments: number;
        maxFakeComments: number;
        templateCount: number;
        nicknameCount: number;
    };
}

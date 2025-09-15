import { BaseController } from '../controllers/base.controller';
import { EpisodeInteractionService, EpisodeReactionType } from '../services/episode-interaction.service';
declare class EpisodeReactionDto {
    type: EpisodeReactionType;
}
export declare class InteractionController extends BaseController {
    private readonly interactionService;
    constructor(interactionService: EpisodeInteractionService);
    react(id: number, dto: EpisodeReactionDto): Promise<import("../controllers/base.controller").ApiResponse<null> | import("../controllers/base.controller").ApiResponse<{
        id: number;
        type: EpisodeReactionType;
    }>>;
}
export {};

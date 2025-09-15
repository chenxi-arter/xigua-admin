"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatBrowseHistoryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const episode_entity_1 = require("../entity/episode.entity");
const series_entity_1 = require("../entity/series.entity");
const base_controller_1 = require("./base.controller");
const date_util_1 = require("../../common/utils/date.util");
let CompatBrowseHistoryController = class CompatBrowseHistoryController extends base_controller_1.BaseController {
    watchProgressRepo;
    episodeRepo;
    seriesRepo;
    constructor(watchProgressRepo, episodeRepo, seriesRepo) {
        super();
        this.watchProgressRepo = watchProgressRepo;
        this.episodeRepo = episodeRepo;
        this.seriesRepo = seriesRepo;
    }
    async getUserBrowseHistory(req, page = '1', size = '10') {
        const pageNum = Math.max(parseInt(page || '1', 10), 1);
        const sizeNum = Math.max(parseInt(size || '10', 10), 1);
        const userId = Number(req.user?.userId);
        const progresses = await this.watchProgressRepo.find({
            where: { userId },
            relations: ['episode', 'episode.series', 'episode.series.category'],
            order: { updatedAt: 'DESC' },
        });
        const seriesMap = new Map();
        for (const p of progresses) {
            const ep = p.episode;
            if (!ep || !ep.series)
                continue;
            const s = ep.series;
            const key = s.id;
            const current = seriesMap.get(key) || {
                seriesId: s.id,
                seriesTitle: s.title || `系列${s.id}`,
                seriesShortId: s.shortId || '',
                seriesCoverUrl: s.coverUrl || '',
                categoryName: s.category?.name || '',
                lastEpisodeNumber: 0,
                lastVisitTime: new Date(0),
                visitCount: 0,
                __episodeIds: new Set()
            };
            if (!current.__episodeIds.has(ep.id)) {
                current.__episodeIds.add(ep.id);
                current.visitCount += 1;
            }
            if (p.updatedAt > current.lastVisitTime) {
                current.lastVisitTime = p.updatedAt;
                current.lastEpisodeNumber = ep.episodeNumber;
                const capped = Math.max(0, Math.min(p.stopAtSecond || 0, ep.duration || 0));
                current.__finalDurationSeconds = capped;
            }
            seriesMap.set(key, current);
        }
        const listAll = Array.from(seriesMap.values())
            .sort((a, b) => b.lastVisitTime.getTime() - a.lastVisitTime.getTime())
            .map((item) => ({
            id: item.seriesId,
            seriesId: item.seriesId,
            seriesTitle: item.seriesTitle,
            seriesShortId: item.seriesShortId,
            seriesCoverUrl: item.seriesCoverUrl,
            categoryName: item.categoryName,
            browseType: 'episode_watch',
            browseTypeDesc: '观看剧集',
            lastEpisodeNumber: item.lastEpisodeNumber,
            lastEpisodeTitle: item.lastEpisodeNumber ? `第${item.lastEpisodeNumber}集` : null,
            visitCount: item.visitCount,
            durationSeconds: item.__finalDurationSeconds || 0,
            lastVisitTime: date_util_1.DateUtil.formatDateTime(item.lastVisitTime),
            watchStatus: item.lastEpisodeNumber ? `观看至第${item.lastEpisodeNumber}集` : '浏览中'
        }));
        const total = listAll.length;
        const offset = (pageNum - 1) * sizeNum;
        const pageList = listAll.slice(offset, offset + sizeNum);
        return this.success({
            list: pageList,
            total,
            page: pageNum,
            size: sizeNum,
            hasMore: total > pageNum * sizeNum,
        }, '获取浏览记录成功');
    }
};
exports.CompatBrowseHistoryController = CompatBrowseHistoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CompatBrowseHistoryController.prototype, "getUserBrowseHistory", null);
exports.CompatBrowseHistoryController = CompatBrowseHistoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('video/browse-history'),
    __param(0, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CompatBrowseHistoryController);
//# sourceMappingURL=compat-browse-history.controller.js.map
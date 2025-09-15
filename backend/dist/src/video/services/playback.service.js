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
exports.PlaybackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const episode_entity_1 = require("../entity/episode.entity");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const date_util_1 = require("../../common/utils/date.util");
const watch_progress_service_1 = require("./watch-progress.service");
let PlaybackService = class PlaybackService {
    episodeRepo;
    watchProgressRepo;
    watchProgressService;
    cacheManager;
    constructor(episodeRepo, watchProgressRepo, watchProgressService, cacheManager) {
        this.episodeRepo = episodeRepo;
        this.watchProgressRepo = watchProgressRepo;
        this.watchProgressService = watchProgressService;
        this.cacheManager = cacheManager;
    }
    async saveProgress(userId, episodeId, stopAtSecond) {
        const result = await this.watchProgressService.updateWatchProgress(userId, episodeId, stopAtSecond);
        await this.clearProgressRelatedCache(episodeId);
        return result;
    }
    async saveProgressWithBrowseHistory(userId, episodeId, stopAtSecond, req) {
        try {
            const result = await this.watchProgressService.updateWatchProgress(userId, episodeId, stopAtSecond);
            const episode = await this.episodeRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            await this.clearProgressRelatedCache(episodeId);
            return result;
        }
        catch (error) {
            console.error('保存观看进度失败:', error);
            throw error;
        }
    }
    async getProgress(userId, episodeId) {
        const progressList = await this.watchProgressService.getUserWatchProgress(userId, episodeId);
        const progress = progressList.length > 0 ? progressList[0] : null;
        return { stopAtSecond: progress?.stopAtSecond || 0 };
    }
    async getUserSeriesProgress(userId, seriesId) {
        try {
            const episodes = await this.episodeRepo.find({
                where: { series: { id: seriesId } },
                order: { episodeNumber: 'ASC' },
                relations: ['series']
            });
            if (episodes.length === 0) {
                return null;
            }
            const episodeIds = episodes.map(ep => ep.id);
            const progressList = await this.watchProgressService.getUserWatchProgressByEpisodeIds(userId, episodeIds);
            let totalWatchTime = 0;
            let currentEpisode = 0;
            let currentEpisodeShortId = '';
            let watchProgress = 0;
            let watchPercentage = 0;
            let lastWatchTime = new Date(0);
            let completedEpisodes = 0;
            progressList.forEach(progress => {
                const episode = episodes.find(ep => ep.id === progress.episodeId);
                if (episode) {
                    totalWatchTime += progress.stopAtSecond;
                    if (progress.updatedAt > lastWatchTime ||
                        (progress.updatedAt.getTime() === lastWatchTime.getTime() && episode.episodeNumber > currentEpisode)) {
                        lastWatchTime = progress.updatedAt;
                        currentEpisode = episode.episodeNumber;
                        currentEpisodeShortId = episode.shortId;
                        watchProgress = progress.stopAtSecond;
                        if (episode.duration > 0) {
                            watchPercentage = Math.round((progress.stopAtSecond / episode.duration) * 100);
                        }
                    }
                    if (episode.duration > 0 && (progress.stopAtSecond / episode.duration) >= 0.9) {
                        completedEpisodes++;
                    }
                }
            });
            return {
                currentEpisode: currentEpisode > 0 ? currentEpisode : 1,
                currentEpisodeShortId: currentEpisodeShortId || (episodes.length > 0 ? episodes[0].shortId : ''),
                watchProgress,
                watchPercentage,
                totalWatchTime,
                lastWatchTime: lastWatchTime.getTime() > 0 ? date_util_1.DateUtil.formatDateTime(lastWatchTime) : date_util_1.DateUtil.formatDateTime(new Date()),
                isCompleted: completedEpisodes === episodes.length && episodes.length > 0
            };
        }
        catch (error) {
            console.error('获取用户系列播放进度失败:', error);
            return null;
        }
    }
    async clearProgressRelatedCache(episodeId) {
        try {
            const episode = await this.episodeRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            if (episode && episode.series) {
                const seriesId = episode.series.id;
                const seriesShortId = episode.series.shortId;
                const patterns = [
                    `episode_list:${seriesId}:*`,
                    `episode_list:${seriesShortId}:*`,
                ];
                for (const pattern of patterns) {
                    await this.cacheManager.del(pattern);
                }
                console.log(`🧹 清理进度相关缓存: episodeId=${episodeId}, seriesId=${seriesId}`);
            }
        }
        catch (error) {
            console.error('清理进度相关缓存失败:', error);
        }
    }
    formatDateTime(date) {
        if (!date)
            return '';
        const beijingTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (8 * 3600000));
        const year = beijingTime.getFullYear();
        const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
        const day = String(beijingTime.getDate()).padStart(2, '0');
        const hours = String(beijingTime.getHours()).padStart(2, '0');
        const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
};
exports.PlaybackService = PlaybackService;
exports.PlaybackService = PlaybackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        watch_progress_service_1.WatchProgressService, Object])
], PlaybackService);
//# sourceMappingURL=playback.service.js.map
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
exports.WatchProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_progress_entity_1 = require("../entity/watch-progress.entity");
const episode_entity_1 = require("../entity/episode.entity");
let WatchProgressService = class WatchProgressService {
    watchProgressRepo;
    episodeRepo;
    constructor(watchProgressRepo, episodeRepo) {
        this.watchProgressRepo = watchProgressRepo;
        this.episodeRepo = episodeRepo;
    }
    async updateWatchProgress(userId, episodeId, stopAtSecond) {
        const episode = await this.episodeRepo.findOne({
            where: { id: episodeId },
        });
        if (!episode) {
            return { ok: false, reason: 'episode_not_found' };
        }
        let watchProgress = await this.watchProgressRepo.findOne({
            where: {
                userId,
                episodeId,
            },
        });
        if (watchProgress) {
            watchProgress.stopAtSecond = stopAtSecond;
            watchProgress.updatedAt = new Date();
        }
        else {
            watchProgress = this.watchProgressRepo.create({
                userId,
                episodeId,
                stopAtSecond,
                updatedAt: new Date(),
            });
        }
        await this.watchProgressRepo.save(watchProgress);
        return { ok: true };
    }
    async getUserWatchProgress(userId, episodeId) {
        const whereCondition = { userId };
        if (episodeId) {
            whereCondition.episodeId = episodeId;
        }
        const progressList = await this.watchProgressRepo.find({
            where: whereCondition,
            relations: ['episode', 'episode.series'],
            order: { updatedAt: 'DESC' },
        });
        return progressList.map(progress => ({
            userId: progress.userId,
            episodeId: progress.episodeId,
            stopAtSecond: progress.stopAtSecond,
            updatedAt: progress.updatedAt,
            episode: {
                id: progress.episode.id,
                title: progress.episode.title,
                episodeNumber: progress.episode.episodeNumber,
                series: {
                    id: progress.episode.series.id,
                    title: progress.episode.series.title,
                    coverUrl: progress.episode.series.coverUrl,
                },
            },
        }));
    }
    async getRecentWatchedEpisodes(userId, limit = 10) {
        const progressList = await this.watchProgressRepo.find({
            where: { userId },
            relations: ['episode', 'episode.series'],
            order: { updatedAt: 'DESC' },
            take: limit,
        });
        return progressList.map(progress => ({
            userId: progress.userId,
            episodeId: progress.episodeId,
            stopAtSecond: progress.stopAtSecond,
            updatedAt: progress.updatedAt,
            episode: {
                id: progress.episode.id,
                title: progress.episode.title,
                episodeNumber: progress.episode.episodeNumber,
                series: {
                    id: progress.episode.series.id,
                    title: progress.episode.series.title,
                    coverUrl: progress.episode.series.coverUrl,
                },
            },
        }));
    }
    async getUserWatchProgressByEpisodeIds(userId, episodeIds) {
        if (episodeIds.length === 0) {
            return [];
        }
        const progressList = await this.watchProgressRepo.find({
            where: {
                userId,
                episodeId: (0, typeorm_2.In)(episodeIds),
            },
            order: { updatedAt: 'DESC' },
        });
        return progressList;
    }
    async deleteWatchProgress(userId, episodeId) {
        const result = await this.watchProgressRepo.delete({
            userId,
            episodeId,
        });
        return { ok: (result.affected || 0) > 0 };
    }
    async clearAllWatchProgress(userId) {
        const result = await this.watchProgressRepo.delete({ userId });
        return { ok: true, deletedCount: result.affected || 0 };
    }
    async getEpisodeWatchStats(episodeId) {
        const totalWatchers = await this.watchProgressRepo.count({
            where: { episodeId },
        });
        const completedWatchers = await this.watchProgressRepo
            .createQueryBuilder('wp')
            .where('wp.episodeId = :episodeId', { episodeId })
            .andWhere('wp.stopAtSecond >= :threshold', { threshold: 0 })
            .getCount();
        return {
            totalWatchers,
            completedWatchers,
            completionRate: totalWatchers > 0 ? (completedWatchers / totalWatchers) * 100 : 0,
        };
    }
};
exports.WatchProgressService = WatchProgressService;
exports.WatchProgressService = WatchProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WatchProgressService);
//# sourceMappingURL=watch-progress.service.js.map
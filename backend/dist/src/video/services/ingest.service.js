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
exports.IngestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const series_entity_1 = require("../entity/series.entity");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const access_key_util_1 = require("../../common/utils/access-key.util");
const filter_type_entity_1 = require("../entity/filter-type.entity");
const filter_option_entity_1 = require("../entity/filter-option.entity");
const filter_service_1 = require("./filter.service");
const series_genre_option_entity_1 = require("../entity/series-genre-option.entity");
let IngestService = class IngestService {
    seriesRepo;
    episodeRepo;
    urlRepo;
    filterTypeRepo;
    filterOptionRepo;
    seriesGenreRepo;
    filterService;
    constructor(seriesRepo, episodeRepo, urlRepo, filterTypeRepo, filterOptionRepo, seriesGenreRepo, filterService) {
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
        this.urlRepo = urlRepo;
        this.filterTypeRepo = filterTypeRepo;
        this.filterOptionRepo = filterOptionRepo;
        this.seriesGenreRepo = seriesGenreRepo;
        this.filterService = filterService;
    }
    async updateSeriesProgress(seriesId, isCompleted, status) {
        const episodes = await this.episodeRepo.find({ where: { seriesId } });
        const total = episodes.length;
        let maxEpisodeNumber = 0;
        for (const e of episodes) {
            if (typeof e.episodeNumber === 'number') {
                maxEpisodeNumber = Math.max(maxEpisodeNumber, e.episodeNumber);
            }
        }
        const completed = isCompleted === true || status === 'completed';
        const upStatus = completed
            ? '已完结'
            : (maxEpisodeNumber > 0 ? `更新至第${maxEpisodeNumber}集` : '未发布');
        await this.seriesRepo.update(seriesId, { totalEpisodes: total, upStatus, updatedAt: new Date() });
    }
    async resolveOptionId(typeCode, name) {
        if (!name)
            return undefined;
        const fType = await this.filterTypeRepo.findOne({ where: { code: typeCode, isActive: true } });
        if (!fType) {
            throw new common_1.BadRequestException({
                message: '筛选器类型不存在',
                details: { typeCode },
            });
        }
        const existing = await this.filterOptionRepo.findOne({ where: { filterTypeId: fType.id, name } });
        if (existing)
            return existing.id;
        const maxDisplayOrder = await this.filterOptionRepo
            .createQueryBuilder('option')
            .select('MAX(option.display_order)', 'maxOrder')
            .where('option.filter_type_id = :filterTypeId', { filterTypeId: fType.id })
            .getRawOne();
        const nextDisplayOrder = (maxDisplayOrder?.maxOrder || 0) + 1;
        const created = this.filterOptionRepo.create({
            filterTypeId: fType.id,
            name,
            value: name.toLowerCase(),
            isDefault: false,
            isActive: true,
            sortOrder: nextDisplayOrder,
            displayOrder: nextDisplayOrder
        });
        const saved = await this.filterOptionRepo.save(created);
        console.log(`[INGEST] 创建新筛选选项: ${typeCode}/${name}, display_order: ${nextDisplayOrder}, id: ${saved.id}`);
        try {
            await this.filterService.clearAllFilterTagsCache();
        }
        catch (e) {
            console.warn('[INGEST] 清理筛选器标签缓存失败（忽略）:', e?.message || e);
        }
        return saved.id;
    }
    inferCompletedFromStatus(statusOptionName) {
        if (!statusOptionName)
            return false;
        const name = statusOptionName.toLowerCase();
        const completedKeywords = ['完结', '完成', 'ended', 'finished', 'completed', '完'];
        return completedKeywords.some(keyword => name.includes(keyword));
    }
    async resolveGenreOptionIds(payload) {
        const ids = new Set();
        if (Array.isArray(payload.genreOptionNames)) {
            for (const name of payload.genreOptionNames) {
                const id = await this.resolveOptionId('genre', name);
                if (id)
                    ids.add(id);
            }
        }
        return Array.from(ids);
    }
    async upsertSeriesGenres(seriesId, optionIds, replace = false) {
        if (!Array.isArray(optionIds))
            return;
        const unique = Array.from(new Set(optionIds.filter(x => typeof x === 'number' && x > 0)));
        if (replace) {
            if (unique.length === 0) {
                await this.seriesGenreRepo.delete({ seriesId });
                return;
            }
            await this.seriesGenreRepo.createQueryBuilder()
                .delete()
                .where('series_id = :sid AND option_id NOT IN (:...ids)', { sid: seriesId, ids: unique })
                .execute();
        }
        for (const oid of unique) {
            const exists = await this.seriesGenreRepo.findOne({ where: { seriesId, optionId: oid } });
            if (!exists) {
                const row = this.seriesGenreRepo.create({ seriesId, optionId: oid });
                await this.seriesGenreRepo.save(row);
            }
        }
    }
    async upsertSeries(payload) {
        let series = null;
        if (payload.externalId) {
            series = await this.seriesRepo.findOne({ where: { externalId: payload.externalId } });
        }
        if (!series) {
            series = await this.seriesRepo.findOne({ where: { title: payload.title } });
        }
        let action = 'updated';
        if (!series) {
            action = 'created';
            const regionId = payload.regionOptionId ?? await this.resolveOptionId('region', payload.regionOptionName);
            const languageId = payload.languageOptionId ?? await this.resolveOptionId('language', payload.languageOptionName);
            const statusId = payload.statusOptionId ?? await this.resolveOptionId('status', payload.statusOptionName);
            const yearId = payload.yearOptionId ?? await this.resolveOptionId('year', payload.yearOptionName);
            series = this.seriesRepo.create({
                title: payload.title,
                externalId: payload.externalId,
                description: payload.description,
                coverUrl: payload.coverUrl,
                categoryId: payload.categoryId,
                releaseDate: payload.releaseDate ? new Date(payload.releaseDate) : undefined,
                isCompleted: payload.isCompleted,
                score: payload.seriesScore ?? payload.score ?? 0,
                playCount: payload.playCount ?? 0,
                starring: payload.starring,
                actor: payload.actor,
                director: payload.director,
                regionOptionId: regionId,
                languageOptionId: languageId,
                statusOptionId: statusId,
                yearOptionId: yearId,
            });
        }
        else {
            action = 'updated';
            series.externalId = payload.externalId || series.externalId;
            series.description = payload.description;
            series.coverUrl = payload.coverUrl;
            series.categoryId = payload.categoryId;
            if (payload.isCompleted !== undefined) {
                series.isCompleted = payload.isCompleted;
            }
            if (payload.releaseDate !== undefined)
                series.releaseDate = new Date(payload.releaseDate);
            const scoreValue = payload.seriesScore ?? payload.score;
            if (scoreValue !== undefined)
                series.score = scoreValue;
            if (payload.playCount !== undefined)
                series.playCount = payload.playCount;
            if (payload.starring !== undefined)
                series.starring = payload.starring;
            if (payload.actor !== undefined)
                series.actor = payload.actor;
            if (payload.director !== undefined)
                series.director = payload.director;
            const regionId = payload.regionOptionId ?? await this.resolveOptionId('region', payload.regionOptionName);
            const languageId = payload.languageOptionId ?? await this.resolveOptionId('language', payload.languageOptionName);
            const statusId = payload.statusOptionId ?? await this.resolveOptionId('status', payload.statusOptionName);
            const yearId = payload.yearOptionId ?? await this.resolveOptionId('year', payload.yearOptionName);
            if (regionId !== undefined)
                series.regionOptionId = regionId;
            if (languageId !== undefined)
                series.languageOptionId = languageId;
            if (statusId !== undefined)
                series.statusOptionId = statusId;
            if (yearId !== undefined)
                series.yearOptionId = yearId;
        }
        series = await this.seriesRepo.save(series);
        try {
            const genreIds = await this.resolveGenreOptionIds(payload);
            if (genreIds.length) {
                await this.upsertSeriesGenres(series.id, genreIds, false);
            }
        }
        catch (e) {
            console.warn('[INGEST] 题材写入失败（忽略不中断）：', e?.message || e);
        }
        for (const ep of payload.episodes || []) {
            let episode = await this.episodeRepo.findOne({ where: { seriesId: series.id, episodeNumber: ep.episodeNumber } });
            if (!episode) {
                const initialLikeCount = this.generateInitialLikeCount();
                const initialFavoriteCount = this.generateInitialFavoriteCount(initialLikeCount);
                const initialPlayCount = this.generateInitialPlayCount(initialLikeCount);
                episode = this.episodeRepo.create({
                    seriesId: series.id,
                    episodeNumber: ep.episodeNumber,
                    title: ep.title ?? `第${ep.episodeNumber}集`,
                    duration: ep.duration ?? 0,
                    status: ep.status ?? 'published',
                    isVertical: ep.isVertical ?? false,
                    likeCount: initialLikeCount,
                    favoriteCount: initialFavoriteCount,
                    playCount: initialPlayCount,
                    dislikeCount: Math.floor(Math.random() * 20),
                });
            }
            else {
                if (ep.title !== undefined)
                    episode.title = ep.title;
                if (ep.duration !== undefined)
                    episode.duration = ep.duration;
                if (ep.status !== undefined)
                    episode.status = ep.status;
                if (ep.isVertical !== undefined)
                    episode.isVertical = ep.isVertical;
            }
            episode = await this.episodeRepo.save(episode);
            if (Array.isArray(ep.urls)) {
                for (const u of ep.urls) {
                    const existing = await this.urlRepo.findOne({ where: { episodeId: episode.id, quality: u.quality } });
                    if (existing) {
                        if (u.ossUrl !== undefined)
                            existing.ossUrl = u.ossUrl;
                        if (u.cdnUrl !== undefined)
                            existing.cdnUrl = u.cdnUrl;
                        existing.subtitleUrl = u.subtitleUrl ?? null;
                        existing.originUrl = u.originUrl;
                        await this.urlRepo.save(existing);
                    }
                    else {
                        const entity = this.urlRepo.create({
                            episodeId: episode.id,
                            quality: u.quality,
                            ossUrl: u.ossUrl ?? '',
                            cdnUrl: u.cdnUrl ?? (u.ossUrl ?? ''),
                            subtitleUrl: u.subtitleUrl ?? null,
                            originUrl: u.originUrl,
                            accessKey: payload.externalId
                                ? access_key_util_1.AccessKeyUtil.generateFromString(`${payload.externalId}:${ep.episodeNumber}:${u.quality}`)
                                : undefined,
                        });
                        await this.urlRepo.save(entity);
                    }
                }
            }
        }
        await this.updateSeriesProgress(series.id, series.isCompleted);
        if (payload.status === 'deleted') {
            await this.seriesRepo.update(series.id, { isActive: 0, deletedAt: new Date(), updatedAt: new Date() });
        }
        else {
            await this.seriesRepo.update(series.id, { isActive: 1, updatedAt: new Date() });
        }
        return { seriesId: series.id, shortId: series.shortId, externalId: series.externalId ?? null, action };
    }
    async updateSeries(payload) {
        const series = await this.seriesRepo.findOne({ where: { externalId: payload.externalId } });
        if (!series) {
            throw new common_1.NotFoundException({
                message: '系列不存在',
                details: { externalId: payload.externalId }
            });
        }
        const update = {};
        if (payload.title !== undefined)
            update.title = payload.title;
        if (payload.description !== undefined)
            update.description = payload.description;
        if (payload.coverUrl !== undefined)
            update.coverUrl = payload.coverUrl;
        if (payload.categoryId !== undefined)
            update.categoryId = payload.categoryId;
        if (payload.isCompleted !== undefined) {
            update.isCompleted = payload.isCompleted;
        }
        if (payload.releaseDate !== undefined)
            update.releaseDate = new Date(payload.releaseDate);
        const scoreValue = payload.seriesScore ?? payload.score;
        if (scoreValue !== undefined)
            update.score = scoreValue;
        if (payload.playCount !== undefined)
            update.playCount = payload.playCount;
        if (payload.starring !== undefined)
            update.starring = payload.starring;
        if (payload.actor !== undefined)
            update.actor = payload.actor;
        if (payload.director !== undefined)
            update.director = payload.director;
        const regionId = payload.regionOptionId ?? await this.resolveOptionId('region', payload.regionOptionName);
        const languageId = payload.languageOptionId ?? await this.resolveOptionId('language', payload.languageOptionName);
        const statusId = payload.statusOptionId ?? await this.resolveOptionId('status', payload.statusOptionName);
        const yearId = payload.yearOptionId ?? await this.resolveOptionId('year', payload.yearOptionName);
        if (regionId !== undefined)
            update.regionOptionId = regionId;
        if (languageId !== undefined)
            update.languageOptionId = languageId;
        if (statusId !== undefined)
            update.statusOptionId = statusId;
        if (yearId !== undefined)
            update.yearOptionId = yearId;
        if (payload.status === 'deleted') {
            await this.seriesRepo.update(series.id, { isActive: 0, deletedAt: new Date(), updatedAt: new Date() });
        }
        else if (Object.keys(update).length) {
            await this.seriesRepo.update(series.id, { ...update, updatedAt: new Date() });
            await this.seriesRepo.update(series.id, { isActive: 1, deletedAt: null, updatedAt: new Date() });
        }
        try {
            const genreIds = await this.resolveGenreOptionIds(payload);
            if (genreIds.length) {
                await this.upsertSeriesGenres(series.id, genreIds, !!payload.replaceGenres);
            }
            else if (payload.replaceGenres) {
                await this.upsertSeriesGenres(series.id, [], true);
            }
        }
        catch (e) {
            console.warn('[INGEST] 更新题材失败（忽略不中断）：', e?.message || e);
        }
        if (Array.isArray(payload.episodes)) {
            const seenEpisodeNumbers = new Set();
            for (const ep of payload.episodes) {
                seenEpisodeNumbers.add(ep.episodeNumber);
                let episode = await this.episodeRepo.findOne({ where: { seriesId: series.id, episodeNumber: ep.episodeNumber } });
                if (!episode) {
                    const initialLikeCount = this.generateInitialLikeCount();
                    const initialFavoriteCount = this.generateInitialFavoriteCount(initialLikeCount);
                    const initialPlayCount = this.generateInitialPlayCount(initialLikeCount);
                    episode = this.episodeRepo.create({
                        seriesId: series.id,
                        episodeNumber: ep.episodeNumber,
                        title: ep.title ?? `第${ep.episodeNumber}集`,
                        duration: ep.duration ?? 0,
                        status: ep.status ?? 'published',
                        isVertical: ep.isVertical ?? false,
                        likeCount: initialLikeCount,
                        favoriteCount: initialFavoriteCount,
                        playCount: initialPlayCount,
                        dislikeCount: Math.floor(Math.random() * 20),
                    });
                }
                else {
                    if (ep.title !== undefined)
                        episode.title = ep.title;
                    if (ep.duration !== undefined)
                        episode.duration = ep.duration;
                    if (ep.status !== undefined)
                        episode.status = ep.status;
                    if (ep.isVertical !== undefined)
                        episode.isVertical = ep.isVertical;
                }
                episode = await this.episodeRepo.save(episode);
                if (Array.isArray(ep.urls)) {
                    const seenQualities = new Set();
                    for (const u of ep.urls) {
                        seenQualities.add(u.quality);
                        const existing = await this.urlRepo.findOne({ where: { episodeId: episode.id, quality: u.quality } });
                        if (existing) {
                            if (u.ossUrl !== undefined)
                                existing.ossUrl = u.ossUrl;
                            if (u.cdnUrl !== undefined)
                                existing.cdnUrl = u.cdnUrl;
                            if (u.subtitleUrl !== undefined)
                                existing.subtitleUrl = u.subtitleUrl ?? null;
                            if (u.originUrl !== undefined)
                                existing.originUrl = u.originUrl;
                            await this.urlRepo.save(existing);
                        }
                        else {
                            const accessKey = access_key_util_1.AccessKeyUtil.generateFromString(`${payload.externalId}:${ep.episodeNumber}:${u.quality}`);
                            const entity = this.urlRepo.create({
                                episodeId: episode.id,
                                quality: u.quality,
                                ossUrl: u.ossUrl ?? '',
                                cdnUrl: u.cdnUrl ?? (u.ossUrl ?? ''),
                                originUrl: u.originUrl ?? (u.ossUrl ?? ''),
                                subtitleUrl: u.subtitleUrl ?? null,
                                accessKey: accessKey,
                            });
                            await this.urlRepo.save(entity);
                        }
                    }
                    if (payload.removeMissingUrls) {
                        const toRemove = await this.urlRepo.find({ where: { episodeId: episode.id } });
                        for (const r of toRemove) {
                            if (!seenQualities.has(r.quality)) {
                                await this.urlRepo.remove(r);
                            }
                        }
                    }
                }
            }
            if (payload.removeMissingEpisodes) {
                const all = await this.episodeRepo.find({ where: { seriesId: series.id } });
                for (const e of all) {
                    if (!seenEpisodeNumbers.has(e.episodeNumber)) {
                        const urls = await this.urlRepo.find({ where: { episodeId: e.id } });
                        if (urls.length)
                            await this.urlRepo.remove(urls);
                        await this.episodeRepo.remove(e);
                    }
                }
            }
        }
        await this.updateSeriesProgress(series.id, (update.isCompleted ?? series.isCompleted));
        return { seriesId: series.id, shortId: series.shortId, externalId: series.externalId ?? null };
    }
    async getSeriesProgressByExternalId(externalId) {
        const series = await this.seriesRepo.findOne({ where: { externalId } });
        if (!series) {
            throw new common_1.NotFoundException({
                message: '系列不存在',
                details: { externalId }
            });
        }
        await this.updateSeriesProgress(series.id, series.isCompleted);
        await this.updateSeriesProgress(series.id, series.isCompleted);
        const refreshed = await this.seriesRepo.findOne({ where: { id: series.id } });
        return {
            seriesId: refreshed.id,
            shortId: refreshed.shortId ?? null,
            externalId: refreshed.externalId ?? null,
            upStatus: refreshed.upStatus ?? null,
            totalEpisodes: refreshed.totalEpisodes,
            isCompleted: !!refreshed.isCompleted,
        };
    }
    generateInitialLikeCount() {
        const rand = Math.random();
        if (rand > 0.8) {
            return Math.floor(800 + Math.random() * 700);
        }
        else if (rand > 0.5) {
            return Math.floor(200 + Math.random() * 600);
        }
        else {
            return Math.floor(20 + Math.random() * 180);
        }
    }
    generateInitialFavoriteCount(likeCount) {
        const percentage = 0.08 + Math.random() * 0.07;
        const favoriteCount = Math.floor(likeCount * percentage);
        return Math.min(favoriteCount, 200);
    }
    generateInitialPlayCount(likeCount) {
        const multiplier = 3 + Math.random() * 5;
        return Math.floor(likeCount * multiplier);
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(2, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __param(3, (0, typeorm_1.InjectRepository)(filter_type_entity_1.FilterType)),
    __param(4, (0, typeorm_1.InjectRepository)(filter_option_entity_1.FilterOption)),
    __param(5, (0, typeorm_1.InjectRepository)(series_genre_option_entity_1.SeriesGenreOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        filter_service_1.FilterService])
], IngestService);
//# sourceMappingURL=ingest.service.js.map
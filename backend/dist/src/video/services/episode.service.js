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
exports.EpisodeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const access_key_util_1 = require("../../shared/utils/access-key.util");
let EpisodeService = class EpisodeService {
    episodeRepo;
    episodeUrlRepo;
    cacheManager;
    constructor(episodeRepo, episodeUrlRepo, cacheManager) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.cacheManager = cacheManager;
    }
    async buildEpisodeUrlResponseByEpisodeId(episodeId) {
        const episode = await this.episodeRepo.findOne({ where: { id: episodeId }, relations: ['series'] });
        if (!episode) {
            throw new common_1.NotFoundException('播放地址不存在或已过期');
        }
        const allUrls = await this.episodeUrlRepo.find({
            where: { episodeId: episode.id },
            order: { quality: 'DESC' },
        });
        return {
            episodeId: episode.id,
            episodeShortId: episode.shortId,
            episodeTitle: episode.title,
            seriesId: episode.series?.id,
            seriesShortId: episode.series?.shortId,
            urls: allUrls.map(u => ({
                id: u.id,
                quality: u.quality,
                ossUrl: u.ossUrl,
                cdnUrl: u.cdnUrl,
                subtitleUrl: u.subtitleUrl,
                accessKey: u.accessKey,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            })),
        };
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        const episodeUrl = this.episodeUrlRepo.create({
            episodeId,
            quality,
            ossUrl,
            cdnUrl,
            subtitleUrl,
            accessKey: access_key_util_1.AccessKeyUtil.generateAccessKey(),
        });
        const saved = await this.episodeUrlRepo.save(episodeUrl);
        await this.clearEpisodeCache(episodeId.toString());
        return saved;
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        if (!access_key_util_1.AccessKeyUtil.isValidAccessKey(accessKey)) {
            throw new common_1.BadRequestException('无效的访问密钥格式');
        }
        const episodeByKey = await this.episodeRepo.findOne({
            where: { accessKey },
            relations: ['series'],
        });
        if (episodeByKey) {
            const allUrls = await this.episodeUrlRepo.find({
                where: { episodeId: episodeByKey.id },
                order: { quality: 'DESC' },
            });
            return {
                ...(await this.buildEpisodeUrlResponseByEpisodeId(episodeByKey.id)),
                accessKeySource: 'episode',
            };
        }
        const episodeUrl = await this.episodeUrlRepo.findOne({
            where: { accessKey },
            relations: ['episode', 'episode.series'],
        });
        if (!episodeUrl) {
            throw new common_1.NotFoundException('播放地址不存在或已过期');
        }
        const siblingUrls = await this.episodeUrlRepo.find({
            where: { episodeId: episodeUrl.episodeId },
            order: { quality: 'DESC' },
        });
        return {
            ...(await this.buildEpisodeUrlResponseByEpisodeId(episodeUrl.episodeId)),
            accessKeySource: 'url',
        };
    }
    async getEpisodeUrlByEpisodeKey(accessKey) {
        if (!access_key_util_1.AccessKeyUtil.isValidAccessKey(accessKey)) {
            throw new common_1.BadRequestException('无效的访问密钥格式');
        }
        const episode = await this.episodeRepo.findOne({ where: { accessKey }, relations: ['series'] });
        if (!episode) {
            throw new common_1.NotFoundException('播放地址不存在或已过期');
        }
        return {
            ...(await this.buildEpisodeUrlResponseByEpisodeId(episode.id)),
            accessKeySource: 'episode',
        };
    }
    async getEpisodeUrlByUrlKey(accessKey) {
        if (!access_key_util_1.AccessKeyUtil.isValidAccessKey(accessKey)) {
            throw new common_1.BadRequestException('无效的访问密钥格式');
        }
        const episodeUrl = await this.episodeUrlRepo.findOne({ where: { accessKey } });
        if (!episodeUrl) {
            throw new common_1.NotFoundException('播放地址不存在或已过期');
        }
        return {
            ...(await this.buildEpisodeUrlResponseByEpisodeId(episodeUrl.episodeId)),
            accessKeySource: 'url',
        };
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        await this.episodeRepo.update(episodeId, { hasSequel });
        await this.clearEpisodeCache(episodeId.toString());
        return { ok: true };
    }
    async generateAccessKeysForExisting() {
        const episodeUrls = await this.episodeUrlRepo.find({
            where: { accessKey: '' },
        });
        const urlUpdates = episodeUrls.map(url => {
            url.accessKey = access_key_util_1.AccessKeyUtil.generateAccessKey();
            return url;
        });
        if (urlUpdates.length > 0) {
            await this.episodeUrlRepo.save(urlUpdates);
        }
        const episodesMissingKey = await this.episodeRepo.find({ where: { accessKey: null } });
        const episodeKeyUpdates = episodesMissingKey.map(ep => {
            ep.accessKey = access_key_util_1.AccessKeyUtil.generateAccessKey(32);
            return ep;
        });
        if (episodeKeyUpdates.length > 0) {
            await this.episodeRepo.save(episodeKeyUpdates);
        }
        await this.clearAllCache();
        return { updatedUrlKeys: urlUpdates.length, updatedEpisodeKeys: episodeKeyUpdates.length };
    }
    async getEpisodeById(episodeId) {
        return this.episodeRepo.findOne({
            where: { id: episodeId },
            relations: ['series', 'urls'],
        });
    }
    async getEpisodeByShortId(episodeShortId) {
        return this.episodeRepo.findOne({
            where: { shortId: episodeShortId },
            relations: ['series', 'urls'],
        });
    }
    async getEpisodeUrls(episodeId) {
        return this.episodeUrlRepo.find({
            where: { episodeId },
            order: { quality: 'DESC' },
        });
    }
    async incrementPlayCount(episodeId) {
        await this.episodeRepo.increment({ id: episodeId }, 'playCount', 1);
        await this.clearEpisodeCache(episodeId.toString());
        return { ok: true };
    }
    async deleteEpisodeUrl(urlId) {
        const episodeUrl = await this.episodeUrlRepo.findOne({
            where: { id: urlId },
        });
        if (!episodeUrl) {
            throw new Error('播放地址不存在');
        }
        await this.episodeUrlRepo.remove(episodeUrl);
        await this.clearEpisodeCache(episodeUrl.episodeId.toString());
        return { ok: true };
    }
    async deleteEpisode(episodeId) {
        const episode = await this.episodeRepo.findOne({
            where: { id: episodeId },
            relations: ['urls', 'watchProgresses']
        });
        if (!episode) {
            throw new Error('剧集不存在');
        }
        await this.episodeRepo.manager.transaction(async (manager) => {
            if (episode.urls && episode.urls.length > 0) {
                await manager.delete('episode_urls', { episodeId: episodeId });
            }
            if (episode.watchProgresses && episode.watchProgresses.length > 0) {
                await manager.delete('watch_progress', { episodeId: episodeId });
            }
            await manager.delete('episode_reactions', { episodeId: episodeId });
            await manager.delete('episodes', { id: episodeId });
        });
        await this.clearEpisodeCache(episodeId.toString());
        await this.clearAllCache();
        return { ok: true, message: '剧集及相关数据删除成功' };
    }
    async clearEpisodeCache(episodeId) {
        try {
            await this.cacheManager.del(`video_details_${episodeId}`);
            const homeKeys = ['home_videos_1_1', 'home_videos_1_2', 'home_videos_1_3'];
            for (const key of homeKeys) {
                await this.cacheManager.del(key);
            }
            const filterKeys = ['filter_data_1_0,0,0,0,0_1', 'filter_data_1_0,0,0,0,0_2'];
            for (const key of filterKeys) {
                await this.cacheManager.del(key);
            }
        }
        catch (error) {
            console.error('清除剧集缓存失败:', error);
        }
    }
    async clearAllCache() {
        try {
            const homeKeys = ['home_videos_1_1', 'home_videos_1_2', 'home_videos_1_3'];
            for (const key of homeKeys) {
                await this.cacheManager.del(key);
            }
            await this.cacheManager.del('filter_tags_1');
            const filterKeys = ['filter_data_1_0,0,0,0,0_1', 'filter_data_1_0,0,0,0,0_2', 'filter_data_1_0,0,0,0,0_3'];
            for (const key of filterKeys) {
                await this.cacheManager.del(key);
            }
        }
        catch (error) {
            console.error('清除所有缓存失败:', error);
        }
    }
};
exports.EpisodeService = EpisodeService;
exports.EpisodeService = EpisodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], EpisodeService);
//# sourceMappingURL=episode.service.js.map
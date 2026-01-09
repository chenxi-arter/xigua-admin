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
exports.UrlService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const play_count_service_1 = require("./play-count.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_entity_1 = require("../entity/episode.entity");
const episode_url_entity_1 = require("../entity/episode-url.entity");
const series_entity_1 = require("../entity/series.entity");
const access_key_util_1 = require("../../common/utils/access-key.util");
let UrlService = class UrlService {
    episodeRepo;
    episodeUrlRepo;
    seriesRepo;
    cacheManager;
    playCountService;
    constructor(episodeRepo, episodeUrlRepo, seriesRepo, cacheManager, playCountService) {
        this.episodeRepo = episodeRepo;
        this.episodeUrlRepo = episodeUrlRepo;
        this.seriesRepo = seriesRepo;
        this.cacheManager = cacheManager;
        this.playCountService = playCountService;
    }
    async incrementSeriesPlayCount(seriesId) {
        await this.playCountService.increment(seriesId);
    }
    async createEpisodeUrl(episodeId, quality, ossUrl, cdnUrl, subtitleUrl) {
        try {
            const episode = await this.episodeRepo.findOne({
                where: { id: episodeId },
                relations: ['series']
            });
            if (!episode) {
                throw new Error('剧集不存在');
            }
            let episodeUrl = await this.episodeUrlRepo.findOne({
                where: { episodeId, quality }
            });
            if (episodeUrl) {
                episodeUrl.ossUrl = ossUrl;
                episodeUrl.cdnUrl = cdnUrl;
                episodeUrl.subtitleUrl = subtitleUrl || null;
            }
            else {
                episodeUrl = this.episodeUrlRepo.create({
                    episodeId,
                    quality,
                    ossUrl,
                    cdnUrl,
                    subtitleUrl: subtitleUrl || null,
                    originUrl: cdnUrl,
                });
            }
            const saved = await this.episodeUrlRepo.save(episodeUrl);
            return {
                code: 200,
                data: {
                    id: saved.id,
                    episodeId: saved.episodeId,
                    quality: saved.quality,
                    accessKey: saved.accessKey,
                    ossUrl: saved.ossUrl,
                    cdnUrl: saved.cdnUrl,
                    subtitleUrl: saved.subtitleUrl
                },
                msg: '播放地址创建成功'
            };
        }
        catch (error) {
            console.error('创建剧集播放地址失败:', error);
            throw new Error('创建剧集播放地址失败');
        }
    }
    async getEpisodeUrlByAccessKey(accessKey) {
        try {
            const episodeUrl = await this.episodeUrlRepo.findOne({
                where: { accessKey },
                relations: ['episode', 'episode.series']
            });
            if (!episodeUrl) {
                throw new Error('播放地址不存在或访问密钥无效');
            }
            if (episodeUrl.episode?.series?.id) {
                await this.incrementSeriesPlayCount(episodeUrl.episode.series.id);
            }
            const allUrls = await this.episodeUrlRepo.find({
                where: { episodeId: episodeUrl.episodeId },
                order: { quality: 'DESC' },
            });
            return {
                episodeId: episodeUrl.episode.id,
                episodeShortId: episodeUrl.episode.shortId,
                episodeTitle: episodeUrl.episode.title,
                seriesId: episodeUrl.episode.series?.id,
                seriesShortId: episodeUrl.episode.series?.shortId,
                urls: allUrls.map(url => ({
                    id: url.id,
                    quality: url.quality,
                    ossUrl: url.ossUrl,
                    cdnUrl: url.cdnUrl,
                    subtitleUrl: url.subtitleUrl,
                    accessKey: url.accessKey,
                    createdAt: url.createdAt,
                    updatedAt: url.updatedAt
                })),
                accessKeySource: 'url'
            };
        }
        catch (error) {
            console.error('通过访问密钥获取播放地址失败:', error);
            throw new Error('播放地址不存在或访问密钥无效');
        }
    }
    async getEpisodeUrlByKey(prefix, key) {
        try {
            if (prefix === 'ep') {
                const episode = await this.episodeRepo.findOne({
                    where: { accessKey: key },
                    relations: ['urls', 'series']
                });
                if (!episode) {
                    throw new Error('剧集不存在或访问密钥无效');
                }
                if (episode.series?.id) {
                    await this.incrementSeriesPlayCount(episode.series.id);
                }
                return {
                    episodeId: episode.id,
                    episodeShortId: episode.shortId,
                    episodeTitle: episode.title,
                    seriesId: episode.series?.id,
                    seriesShortId: episode.series?.shortId,
                    urls: episode.urls?.map(url => ({
                        id: url.id,
                        quality: url.quality,
                        ossUrl: url.ossUrl,
                        cdnUrl: url.cdnUrl,
                        subtitleUrl: url.subtitleUrl,
                        accessKey: url.accessKey,
                        createdAt: url.createdAt,
                        updatedAt: url.updatedAt
                    })) || [],
                    accessKeySource: 'episode'
                };
            }
            else if (prefix === 'url') {
                return await this.getEpisodeUrlByAccessKey(key);
            }
            else {
                throw new Error('无效的前缀，仅支持 ep 或 url');
            }
        }
        catch (error) {
            console.error('通过键值获取播放地址失败:', error);
            throw error;
        }
    }
    async generateAccessKeysForExisting() {
        try {
            let updatedCount = 0;
            const episodesWithoutKey = await this.episodeRepo.find({
                where: { accessKey: '' }
            });
            for (const episode of episodesWithoutKey) {
                episode.accessKey = access_key_util_1.AccessKeyUtil.generateAccessKey(32);
                await this.episodeRepo.save(episode);
                updatedCount++;
            }
            const urlsWithoutKey = await this.episodeUrlRepo.find({
                where: { accessKey: '' },
                relations: ['episode', 'episode.series']
            });
            for (const url of urlsWithoutKey) {
                if (url.episode?.series?.externalId) {
                    url.accessKey = access_key_util_1.AccessKeyUtil.generateFromString(`${url.episode.series.externalId}:${url.episode.episodeNumber}:${url.quality}`);
                }
                else {
                    url.accessKey = access_key_util_1.AccessKeyUtil.generateAccessKey(32);
                }
                await this.episodeUrlRepo.save(url);
                updatedCount++;
            }
            return {
                code: 200,
                data: {
                    updatedCount,
                    message: `已为 ${updatedCount} 个记录生成访问密钥`
                },
                msg: '访问密钥生成完成'
            };
        }
        catch (error) {
            console.error('生成访问密钥失败:', error);
            throw new Error('生成访问密钥失败');
        }
    }
    async updateEpisodeSequel(episodeId, hasSequel) {
        try {
            const episode = await this.episodeRepo.findOne({
                where: { id: episodeId }
            });
            if (!episode) {
                throw new Error('剧集不存在');
            }
            episode.hasSequel = hasSequel;
            await this.episodeRepo.save(episode);
            return {
                code: 200,
                data: {
                    episodeId: episode.id,
                    hasSequel: episode.hasSequel
                },
                msg: '续集状态更新成功'
            };
        }
        catch (error) {
            console.error('更新剧集续集状态失败:', error);
            throw new Error('更新剧集续集状态失败');
        }
    }
};
exports.UrlService = UrlService;
exports.UrlService = UrlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_url_entity_1.EpisodeUrl)),
    __param(2, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object, play_count_service_1.PlayCountService])
], UrlService);
//# sourceMappingURL=url.service.js.map
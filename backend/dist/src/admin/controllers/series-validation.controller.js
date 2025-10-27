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
exports.SeriesValidationController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const series_entity_1 = require("../../video/entity/series.entity");
const episode_entity_1 = require("../../video/entity/episode.entity");
let SeriesValidationController = class SeriesValidationController {
    seriesRepo;
    episodeRepo;
    constructor(seriesRepo, episodeRepo) {
        this.seriesRepo = seriesRepo;
        this.episodeRepo = episodeRepo;
    }
    async checkMissingEpisodes(seriesId) {
        try {
            let seriesQuery = this.seriesRepo
                .createQueryBuilder('s')
                .where('s.is_active = :isActive', { isActive: 1 });
            if (seriesId) {
                seriesQuery = seriesQuery.andWhere('s.id = :seriesId', { seriesId });
            }
            const seriesList = await seriesQuery
                .orderBy('s.id', 'DESC')
                .getMany();
            const results = [];
            for (const series of seriesList) {
                const episodes = await this.episodeRepo
                    .find({
                    where: { seriesId: series.id },
                    order: { episodeNumber: 'ASC' },
                });
                if (episodes.length === 0) {
                    results.push({
                        seriesId: series.id,
                        seriesTitle: series.title,
                        seriesShortId: series.shortId,
                        totalEpisodes: 0,
                        missingEpisodes: [],
                        status: 'NO_EPISODES',
                        message: '该系列没有任何剧集',
                    });
                    continue;
                }
                const episodeNumbers = episodes.map(ep => ep.episodeNumber).filter(n => n != null).sort((a, b) => a - b);
                const maxEpisode = Math.max(...episodeNumbers);
                const missingEpisodes = [];
                for (let i = 1; i <= maxEpisode; i++) {
                    if (!episodeNumbers.includes(i)) {
                        missingEpisodes.push(i);
                    }
                }
                const duplicates = episodeNumbers.filter((num, index) => episodeNumbers.indexOf(num) !== index);
                const uniqueDuplicates = [...new Set(duplicates)].filter(num => num != null);
                if (missingEpisodes.length > 0 || uniqueDuplicates.length > 0) {
                    results.push({
                        seriesId: series.id,
                        seriesTitle: series.title,
                        seriesShortId: series.shortId,
                        totalEpisodes: episodes.length,
                        expectedEpisodes: maxEpisode,
                        missingEpisodes,
                        duplicateEpisodes: uniqueDuplicates,
                        status: 'HAS_ISSUES',
                        issues: {
                            hasMissing: missingEpisodes.length > 0,
                            hasDuplicates: uniqueDuplicates.length > 0,
                            missingCount: missingEpisodes.length,
                            duplicateCount: uniqueDuplicates.length,
                        },
                    });
                }
            }
            return {
                success: true,
                data: {
                    total: results.length,
                    checkedSeries: seriesList.length,
                    items: results,
                },
                message: results.length > 0
                    ? `发现 ${results.length} 个系列存在集数问题`
                    : '所有系列集数连续，无问题',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('检查缺集失败:', error);
            return {
                success: false,
                data: null,
                message: error?.message || '检查失败',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getSeriesEpisodeDetails(seriesId) {
        try {
            const series = await this.seriesRepo.findOne({
                where: { id: seriesId },
            });
            if (!series) {
                return {
                    success: false,
                    data: null,
                    message: '系列不存在',
                };
            }
            const episodes = await this.episodeRepo
                .createQueryBuilder('e')
                .where('e.series_id = :seriesId', { seriesId })
                .orderBy('e.episode_number', 'ASC')
                .getMany();
            const episodeNumbers = episodes.map(ep => ep.episodeNumber).sort((a, b) => a - b);
            const maxEpisode = episodeNumbers.length > 0 ? Math.max(...episodeNumbers) : 0;
            const missingEpisodes = [];
            for (let i = 1; i <= maxEpisode; i++) {
                if (!episodeNumbers.includes(i)) {
                    missingEpisodes.push(i);
                }
            }
            const episodeMap = new Map();
            episodes.forEach(ep => {
                if (!episodeMap.has(ep.episodeNumber)) {
                    episodeMap.set(ep.episodeNumber, []);
                }
                episodeMap.get(ep.episodeNumber).push({
                    id: ep.id,
                    shortId: ep.shortId,
                    title: ep.title,
                    status: ep.status,
                });
            });
            const duplicates = [];
            episodeMap.forEach((eps, num) => {
                if (eps?.length > 1) {
                    duplicates.push({
                        episodeNumber: num,
                        count: eps.length,
                        episodes: eps,
                    });
                }
            });
            return {
                success: true,
                data: {
                    series: {
                        id: series.id,
                        shortId: series.shortId,
                        title: series.title,
                        totalEpisodes: episodes.length,
                        isCompleted: series.isCompleted,
                    },
                    episodes: episodes.map(ep => ({
                        id: ep.id,
                        shortId: ep.shortId,
                        episodeNumber: ep.episodeNumber,
                        title: ep.title,
                        status: ep.status,
                        duration: ep.duration,
                    })),
                    validation: {
                        expectedCount: maxEpisode,
                        actualCount: episodes.length,
                        isContinuous: missingEpisodes.length === 0 && duplicates.length === 0,
                        missingEpisodes,
                        duplicates,
                    },
                },
            };
        }
        catch (error) {
            return {
                success: false,
                data: null,
                message: error?.message || '获取失败',
            };
        }
    }
    async checkDuplicateNames() {
        try {
            const seriesList = await this.seriesRepo
                .createQueryBuilder('s')
                .select(['s.id', 's.title', 's.shortId', 's.externalId', 's.createdAt'])
                .where('s.is_active = :isActive', { isActive: 1 })
                .orderBy('s.id', 'DESC')
                .getMany();
            const titleMap = new Map();
            seriesList.forEach(series => {
                const title = series.title.trim();
                if (!titleMap.has(title)) {
                    titleMap.set(title, []);
                }
                titleMap.get(title)?.push({
                    id: series.id,
                    shortId: series.shortId,
                    title: series.title,
                    externalId: series.externalId,
                    createdAt: series.createdAt,
                });
            });
            const duplicates = [];
            titleMap.forEach((seriesArray, title) => {
                if (seriesArray.length > 1) {
                    duplicates.push({
                        title,
                        count: seriesArray.length,
                        series: seriesArray.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
                    });
                }
            });
            duplicates.sort((a, b) => b.count - a.count);
            return {
                success: true,
                data: {
                    total: duplicates.length,
                    checkedSeries: seriesList.length,
                    totalDuplicateCount: duplicates.reduce((sum, item) => sum + item.count, 0),
                    items: duplicates,
                },
                message: duplicates.length > 0
                    ? `发现 ${duplicates.length} 个重复的系列名`
                    : '未发现重复系列名',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('检查重复系列名失败:', error);
            return {
                success: false,
                data: null,
                message: error?.message || '检查失败',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async checkDuplicateExternalIds() {
        try {
            const seriesList = await this.seriesRepo
                .createQueryBuilder('s')
                .select(['s.id', 's.title', 's.shortId', 's.externalId', 's.createdAt'])
                .where('s.is_active = :isActive', { isActive: 1 })
                .andWhere('s.external_id IS NOT NULL')
                .andWhere('s.external_id != :empty', { empty: '' })
                .orderBy('s.id', 'DESC')
                .getMany();
            const externalIdMap = new Map();
            seriesList.forEach(series => {
                const extId = series.externalId;
                if (extId) {
                    if (!externalIdMap.has(extId)) {
                        externalIdMap.set(extId, []);
                    }
                    externalIdMap.get(extId)?.push({
                        id: series.id,
                        shortId: series.shortId,
                        title: series.title,
                        externalId: series.externalId,
                        createdAt: series.createdAt,
                    });
                }
            });
            const duplicates = [];
            externalIdMap.forEach((seriesArray, externalId) => {
                if (seriesArray.length > 1) {
                    duplicates.push({
                        externalId,
                        count: seriesArray.length,
                        series: seriesArray.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
                    });
                }
            });
            duplicates.sort((a, b) => b.count - a.count);
            return {
                success: true,
                data: {
                    total: duplicates.length,
                    checkedSeries: seriesList.length,
                    totalDuplicateCount: duplicates.reduce((sum, item) => sum + item.count, 0),
                    items: duplicates,
                },
                message: duplicates.length > 0
                    ? `发现 ${duplicates.length} 个重复的外部ID`
                    : '未发现重复外部ID',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('检查重复外部ID失败:', error);
            return {
                success: false,
                data: null,
                message: error?.message || '检查失败',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getValidationStats() {
        try {
            const startTime = Date.now();
            const totalSeries = await this.seriesRepo.count({
                where: { isActive: 1 },
            });
            const totalEpisodes = await this.episodeRepo.count();
            const allActiveSeries = await this.seriesRepo.find({
                where: { isActive: 1 },
                select: ['id'],
            });
            let emptySeries = 0;
            for (const s of allActiveSeries) {
                const count = await this.episodeRepo.count({
                    where: { seriesId: s.id },
                });
                if (count === 0) {
                    emptySeries++;
                }
            }
            const seriesList = await this.seriesRepo
                .createQueryBuilder('s')
                .where('s.is_active = :isActive', { isActive: 1 })
                .getMany();
            let missingCount = 0;
            let duplicateCount = 0;
            let bothCount = 0;
            for (const series of seriesList) {
                const episodes = await this.episodeRepo.find({
                    where: { seriesId: series.id },
                    select: ['id', 'episodeNumber'],
                });
                if (episodes.length === 0) {
                    continue;
                }
                const numbers = episodes.map(e => e.episodeNumber).filter(n => n != null).sort((a, b) => a - b);
                const max = Math.max(...numbers);
                const missing = [];
                for (let i = 1; i <= max; i++) {
                    if (!numbers.includes(i)) {
                        missing.push(i);
                    }
                }
                const duplicates = numbers.filter((num, index) => numbers.indexOf(num) !== index);
                const hasDuplicates = [...new Set(duplicates)].length > 0;
                if (missing.length > 0 && hasDuplicates) {
                    bothCount++;
                }
                else if (missing.length > 0) {
                    missingCount++;
                }
                else if (hasDuplicates) {
                    duplicateCount++;
                }
            }
            const titleMap = new Map();
            seriesList.forEach(series => {
                const title = series.title.trim();
                titleMap.set(title, (titleMap.get(title) || 0) + 1);
            });
            const duplicateNamesCount = Array.from(titleMap.values()).filter(count => count > 1).length;
            const extIdMap = new Map();
            seriesList.forEach(series => {
                if (series.externalId) {
                    extIdMap.set(series.externalId, (extIdMap.get(series.externalId) || 0) + 1);
                }
            });
            const duplicateExternalIdsCount = Array.from(extIdMap.values()).filter(count => count > 1).length;
            const issuesSeries = missingCount + duplicateCount + bothCount + emptySeries;
            const healthySeries = totalSeries - issuesSeries;
            const issueRate = totalSeries > 0 ? (issuesSeries / totalSeries) : 0;
            const score = Math.round((1 - issueRate) * 100);
            let grade = 'F';
            if (score >= 95)
                grade = 'A+';
            else if (score >= 90)
                grade = 'A';
            else if (score >= 85)
                grade = 'B+';
            else if (score >= 80)
                grade = 'B';
            else if (score >= 75)
                grade = 'C+';
            else if (score >= 70)
                grade = 'C';
            else if (score >= 60)
                grade = 'D';
            const duration = Date.now() - startTime;
            return {
                success: true,
                code: 200,
                message: '数据质量统计获取成功',
                timestamp: new Date().toISOString(),
                data: {
                    overview: {
                        totalSeries,
                        totalEpisodes,
                        healthySeries,
                        issuesSeries,
                    },
                    issues: {
                        missingEpisodes: missingCount,
                        duplicateEpisodes: duplicateCount,
                        duplicateNames: duplicateNamesCount,
                        duplicateExternalIds: duplicateExternalIdsCount,
                        emptySeries,
                    },
                    breakdown: {
                        onlyMissing: missingCount,
                        onlyDuplicate: duplicateCount,
                        bothIssues: bothCount,
                        empty: emptySeries,
                    },
                    quality: {
                        score,
                        grade,
                        trend: 'stable',
                        issueRate: `${(issueRate * 100).toFixed(1)}%`,
                    },
                    lastCheck: {
                        timestamp: new Date().toISOString(),
                        duration,
                    },
                },
            };
        }
        catch (error) {
            return {
                success: false,
                data: null,
                message: error?.message || '获取统计失败',
            };
        }
    }
};
exports.SeriesValidationController = SeriesValidationController;
__decorate([
    (0, common_1.Get)('check-missing-episodes'),
    __param(0, (0, common_1.Query)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeriesValidationController.prototype, "checkMissingEpisodes", null);
__decorate([
    (0, common_1.Get)('episodes/:seriesId'),
    __param(0, (0, common_1.Param)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeriesValidationController.prototype, "getSeriesEpisodeDetails", null);
__decorate([
    (0, common_1.Get)('check-duplicate-names'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeriesValidationController.prototype, "checkDuplicateNames", null);
__decorate([
    (0, common_1.Get)('check-duplicate-external-ids'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeriesValidationController.prototype, "checkDuplicateExternalIds", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeriesValidationController.prototype, "getValidationStats", null);
exports.SeriesValidationController = SeriesValidationController = __decorate([
    (0, common_1.Controller)('admin/series/validation'),
    __param(0, (0, typeorm_1.InjectRepository)(series_entity_1.Series)),
    __param(1, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeriesValidationController);
//# sourceMappingURL=series-validation.controller.js.map
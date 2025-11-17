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
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_1 = require("../entity");
let PlatformService = class PlatformService {
    platformRepository;
    constructor(platformRepository) {
        this.platformRepository = platformRepository;
    }
    async findAll(enabled) {
        const queryBuilder = this.platformRepository.createQueryBuilder('platform');
        if (enabled !== undefined) {
            queryBuilder.where('platform.isEnabled = :enabled', { enabled });
        }
        return queryBuilder
            .orderBy('platform.sortOrder', 'ASC')
            .addOrderBy('platform.createdAt', 'ASC')
            .getMany();
    }
    async findOne(id) {
        const platform = await this.platformRepository.findOne({ where: { id } });
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        return platform;
    }
    async findByCode(code) {
        const platform = await this.platformRepository.findOne({ where: { code } });
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with code ${code} not found`);
        }
        return platform;
    }
    async create(createPlatformDto, createdBy) {
        const existingPlatform = await this.platformRepository.findOne({
            where: { code: createPlatformDto.code }
        });
        if (existingPlatform) {
            throw new common_1.ConflictException(`Platform with code ${createPlatformDto.code} already exists`);
        }
        const platform = this.platformRepository.create({
            ...createPlatformDto,
            createdBy,
        });
        return this.platformRepository.save(platform);
    }
    async update(id, updatePlatformDto) {
        const platform = await this.findOne(id);
        Object.assign(platform, updatePlatformDto);
        return this.platformRepository.save(platform);
    }
    async updateStatus(id, updateStatusDto) {
        const platform = await this.findOne(id);
        platform.isEnabled = updateStatusDto.isEnabled;
        return this.platformRepository.save(platform);
    }
    async updateSort(updateSortDto) {
        const queryRunner = this.platformRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of updateSortDto.platforms) {
                await queryRunner.manager.update(entity_1.AdvertisingPlatform, item.id, {
                    sortOrder: item.sortOrder
                });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const platform = await this.platformRepository.findOne({
            where: { id },
            relations: ['campaigns']
        });
        if (!platform) {
            throw new common_1.NotFoundException(`Platform with ID ${id} not found`);
        }
        if (platform.campaigns && platform.campaigns.length > 0) {
            throw new common_1.ConflictException('Cannot delete platform with existing campaigns');
        }
        await this.platformRepository.remove(platform);
    }
};
exports.PlatformService = PlatformService;
exports.PlatformService = PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.AdvertisingPlatform)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlatformService);
//# sourceMappingURL=platform.service.js.map
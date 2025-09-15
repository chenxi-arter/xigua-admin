import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { RedisConfig } from '../../core/config/redis.config';
export declare class PlayCountService implements OnModuleInit, OnModuleDestroy {
    private readonly redisConfig;
    private readonly seriesRepo;
    private redisClient;
    private flushTimer;
    private readonly dirtySetKey;
    private deltaKey;
    constructor(redisConfig: RedisConfig, seriesRepo: Repository<Series>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    increment(seriesId: number): Promise<void>;
    flushDeltas(): Promise<{
        updated: number;
        seriesIds: number[];
    }>;
    private flushDeltasSafely;
}

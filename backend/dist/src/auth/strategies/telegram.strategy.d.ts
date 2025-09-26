import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { TelegramAuthService } from '../telegram-auth.service';
import type { Request } from 'express';
declare const TelegramStrategy_base: new () => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class TelegramStrategy extends TelegramStrategy_base {
    private configService;
    private telegramAuthService;
    private userRepository;
    constructor(configService: ConfigService, telegramAuthService: TelegramAuthService, userRepository: Repository<User>);
    private isInitDataBody;
    validate(req: Request): Promise<User>;
}
export {};

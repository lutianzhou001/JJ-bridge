import { Provider } from '@nestjs/common';
import { default as config } from '../config';
import IORedis, { Redis } from 'ioredis';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

const redisSettings = config.redisSettings;

export const redisProviders: Provider = {
    useFactory: (): Redis => {
        return new IORedis({
            host: redisSettings.host,
            port: redisSettings.port,
            password: redisSettings.password,
        });
    },
    provide: REDIS_PUBLISHER_CLIENT,
};
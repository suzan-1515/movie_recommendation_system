import Raccoon from '@maruware/raccoon';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Raccoon module is a global module that provides the raccoon instance to the entire application.
// It is initialized with the redis connection details from the config service.
@Global()
@Module({
    providers: [
        {
            provide: 'RACCOON',
            inject: [ConfigService],
            useFactory: async (configService:ConfigService) => {
                const raccon = new Raccoon({
                    className: 'movie',
                    redisUrl: `${configService.get<string>('REDIS_HOST')}`,
                    redisPort:configService.get<number>('REDIS_PORT'),
                    redisAuth: configService.get<string>('REDIS_AUTH'),
                  })
                return raccon;
            },
        },
    ],
    exports: ['RACCOON'],
})
export class RacconModule { }

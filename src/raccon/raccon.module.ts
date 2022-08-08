import Raccoon from '@maruware/raccoon';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

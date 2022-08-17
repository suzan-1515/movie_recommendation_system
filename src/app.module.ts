import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movies.module';
import { RacconModule } from './raccon/raccon.module';
import { UserModule } from './user/user.module';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { GroupModule } from './group/group.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MulterModule.register({
      dest: './public/uploads',
    }),
    RacconModule,
    MovieModule,
    UserModule,
    GroupModule,
    
  ],
})
export class AppModule { }

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

// The environment variables file path is resolved based on the NODE_ENV environment variable.
// If the NODE_ENV is not set, the default value is development.
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

// The AppModule is the root module of the application. All the modules used in the application are imported here.
// The ConfigModule is initialized with the environment variables file path and set to be global that can be injected throught other modules.
// The TypeOrmModule is initialized with the TypeOrmConfigService that is used to load the TypeOrm configuration based on the environment variables.
// The MulterModule is initialized with the configuration to store the uploaded files in the uploads directory.
// The MovieModule, RacconModule, UserModule, and GroupModule are imported to be used in the application.
// Note that the MovieModule, RacconModule, UserModule, and GroupModule are user generated whereas rest are third-party imported modules.
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

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from '../movie/movies.module';
import { RacconModule } from '../raccon/raccon.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), RacconModule,MovieModule,],
})
export class AppModule { }

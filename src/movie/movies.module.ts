import { TheMovieDbModule } from '@harshppatel/nestjs-themoviedb-api/dist/src';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    TheMovieDbModule.forAsyncRoot({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          API_KEY: configService.get<string>('TMDB_API'), // You can also pass `language` option from node-themoviedb library
        };
      },
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MovieModule {}

import { Inject, Injectable } from '@nestjs/common';
import Raccoon from '@maruware/raccoon';
import { MovieReactionRequestDto } from './dto/movie-reaction-request.dto';
import { TheMovieDbService } from '@harshppatel/nestjs-themoviedb-api/dist/src';

@Injectable()
export class MoviesService {

    constructor(@Inject('RACCOON') private raccoon: Raccoon, private readonly theMovieDbService: TheMovieDbService) { }

    async likeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} liked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.liked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async unlikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} unliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.unliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async dislikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} disliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.disliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async unDislikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} unDisliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.undisliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async recommendMovie(userId: string, numberOfRecs: number = 10): Promise<any> {
        console.log(`User ${userId} recommended ${numberOfRecs} movies`);
        const moviesId = await this.raccoon.recommendFor(userId, numberOfRecs);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async similarUsers(userId: string): Promise<string[]> {
        console.log(`User ${userId} similar users`);
        return this.raccoon.mostSimilarUsers(userId);
    }

    async bestRatedMovies(): Promise<any> {
        console.log(`Best rated movies`);
        const moviesId = await this.raccoon.bestRated();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async worstRatedMovies(): Promise<any> {
        console.log(`Worst rated movies`);
        const moviesId = await this.raccoon.worstRated();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async mostLikedMovies(): Promise<any> {
        console.log(`Most liked movies`);
        const moviesId = await this.raccoon.mostLiked();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async movieLikers(movieId: string): Promise<string[]> {
        console.log(`Movie ${movieId} liked by users`);
        return this.raccoon.likedBy(movieId);
    }

    async likedMovieCount(movieId: string): Promise<number> {
        console.log(`Movie ${movieId} liked by users`);
        return this.raccoon.likedCount(movieId);
    }

    async disLikedMovieCount(movieId: string): Promise<number> {
        console.log(`Movie ${movieId} disliked by users`);
        return this.raccoon.dislikedCount(movieId);
    }

    async likedMovies(userId: string): Promise<string[]> {
        console.log(`User ${userId} liked movies`);
        const moviesId = await this.raccoon.allLikedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async disLikedMovies(userId: string): Promise<any> {
        console.log(`User ${userId} disliked movies`);
        const moviesId = await this.raccoon.allDislikedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async watchedMovies(userId: string): Promise<any> {
        console.log(`User ${userId} watched movies`);
        const moviesId = await this.raccoon.allWatchedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async getMovieDetail(movieId: string): Promise<any> {
        console.log(`Movie ${movieId} detail`);
        const args = {
            pathParameters: {
                movie_id: movieId,
            },
        };
        return this.theMovieDbService.getMovieEndpoint().getDetails(args);
    }

    async getMoviesDetail(moviesId: string[]): Promise<any> {
        console.log(`Movies ${moviesId.length} detail`);
        let movies = [];
        for await (const element of moviesId) {
            await this.getMovieDetail(element).then(res => {
                if (res)
                    movies.push(res.data);
            }).catch(err => {
                console.log(err);
            });

        }

        return movies;
    }

    async getRandomMovies(genresId: string): Promise<any> {
        console.log(`Random movies`);
        
        const args = {
            query: {
                with_genres: genresId,
            },
        };
        if(!genresId) {
            delete args['query']['with_genres'];
        }

        const movies = await this.theMovieDbService.getDiscoverEndpoint().movie(args);

        return movies.data;
    }
}
